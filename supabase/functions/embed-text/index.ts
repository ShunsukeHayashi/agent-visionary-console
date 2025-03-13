
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

// CORS ヘッダー
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OpenAI API設定
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const OPENAI_EMBEDDING_MODEL = 'text-embedding-ada-002';

// Supabase初期化
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// テキストをチャンクに分割する関数
function splitIntoChunks(text: string, maxChunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  
  // 段落で分割
  const paragraphs = text.split(/\n\s*\n/);
  
  let currentChunk = "";
  
  for (const paragraph of paragraphs) {
    // 段落が最大チャンクサイズより大きい場合、文で分割
    if (paragraph.length > maxChunkSize) {
      const sentences = paragraph.split(/(?<=[.!?])\s+/);
      
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length + 1 <= maxChunkSize) {
          currentChunk += (currentChunk ? " " : "") + sentence;
        } else {
          if (currentChunk) {
            chunks.push(currentChunk);
          }
          
          // 文自体が最大チャンクサイズより大きい場合は単語で分割
          if (sentence.length > maxChunkSize) {
            const words = sentence.split(/\s+/);
            currentChunk = "";
            
            for (const word of words) {
              if (currentChunk.length + word.length + 1 <= maxChunkSize) {
                currentChunk += (currentChunk ? " " : "") + word;
              } else {
                chunks.push(currentChunk);
                currentChunk = word;
              }
            }
          } else {
            currentChunk = sentence;
          }
        }
      }
    } else {
      // 段落を追加しても最大チャンクサイズを超えない場合
      if (currentChunk.length + paragraph.length + 2 <= maxChunkSize) {
        currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      } else {
        chunks.push(currentChunk);
        currentChunk = paragraph;
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// OpenAIからエンベディングを取得する関数
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input: text.replace(/\n/g, ' ')
    })
  });

  const result = await response.json();
  
  if (!result.data || !result.data[0]) {
    console.error('OpenAI API error:', result);
    throw new Error('Failed to get embedding from OpenAI');
  }
  
  return result.data[0].embedding;
}

// トークン数を概算する関数
function estimateTokens(text: string): number {
  // 4文字あたり約1トークンとして概算
  return Math.ceil(text.length / 4);
}

serve(async (req) => {
  // CORS プリフライトリクエスト対応
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, metadata } = await req.json();
    
    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Title and content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // メインコンテンツのエンベディングを取得
    const embedding = await getEmbedding(title + "\n\n" + content);
    const tokens = estimateTokens(content);
    
    // ナレッジベースにドキュメントを保存
    const { data: knowledgeData, error: knowledgeError } = await supabase
      .from('knowledge_base')
      .insert({
        title,
        content,
        metadata: metadata || {},
        embedding,
        tokens
      })
      .select('id')
      .single();
    
    if (knowledgeError) {
      console.error('Error inserting to knowledge_base:', knowledgeError);
      throw knowledgeError;
    }

    const knowledgeId = knowledgeData.id;
    
    // コンテンツをチャンクに分割
    const chunks = splitIntoChunks(content);
    
    // 各チャンクのエンベディングを取得して保存
    const chunkPromises = chunks.map(async (chunkContent, index) => {
      const chunkEmbedding = await getEmbedding(chunkContent);
      
      return supabase
        .from('knowledge_chunks')
        .insert({
          knowledge_id: knowledgeId,
          chunk_index: index,
          chunk_content: chunkContent,
          embedding: chunkEmbedding
        });
    });
    
    await Promise.all(chunkPromises);
    
    return new Response(
      JSON.stringify({ 
        id: knowledgeId, 
        chunks_count: chunks.length,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
