
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
const OPENAI_CHAT_MODEL = 'gpt-4o-mini';

// Supabase初期化
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// クエリ最適化のためのAI呼び出し
async function optimizeQuery(query: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: '検索クエリを最適化してください。元の意図を保ちながら、より検索に適した形式に変換してください。日本語で回答してください。'
        },
        {
          role: 'user',
          content: `以下の検索クエリを最適化してください: "${query}"`
        }
      ],
      temperature: 0.3,
      max_tokens: 100
    })
  });

  const result = await response.json();
  
  if (!result.choices || !result.choices[0]) {
    console.error('OpenAI API error:', result);
    return query; // エラー時は元のクエリを返す
  }
  
  return result.choices[0].message.content.replace(/^["']|["']$/g, '');
}

// ベクトル検索とキーワード検索を組み合わせた関数
async function searchKnowledgeBase(query: string, limit: number = 5): Promise<any[]> {
  try {
    // 1. クエリをAIで最適化
    const optimizedQuery = await optimizeQuery(query);
    console.log(`Original query: "${query}", Optimized: "${optimizedQuery}"`);
    
    // 2. クエリのエンベディングを取得
    const queryEmbedding = await getEmbedding(optimizedQuery);
    
    // 3. ベクトル検索（チャンクレベル）
    const { data: chunkResults, error: chunkError } = await supabase.rpc(
      'match_knowledge_chunks',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: limit * 2
      }
    );
    
    if (chunkError) {
      console.error('Error in vector search (chunks):', chunkError);
      throw chunkError;
    }
    
    // 知識ベースIDのセットを取得（重複を排除）
    const knowledgeIds = [...new Set(chunkResults.map(item => item.knowledge_id))];
    
    // 4. キーワード検索（全文検索）
    const { data: keywordResults, error: keywordError } = await supabase
      .from('knowledge_base')
      .select('id, title, content, metadata')
      .textSearch('content', optimizedQuery, { 
        type: 'plain',
        config: 'simple'
      })
      .limit(limit);
    
    if (keywordError) {
      console.error('Error in keyword search:', keywordError);
    }
    
    // 5. 全文検索で見つかったIDも追加（重複を排除）
    if (keywordResults) {
      for (const item of keywordResults) {
        if (!knowledgeIds.includes(item.id)) {
          knowledgeIds.push(item.id);
        }
      }
    }
    
    // 6. 最終的な検索結果を取得
    const { data: finalResults, error: finalError } = await supabase
      .from('knowledge_base')
      .select('id, title, content, metadata, created_at')
      .in('id', knowledgeIds)
      .limit(limit);
    
    if (finalError) {
      console.error('Error fetching final results:', finalError);
      throw finalError;
    }
    
    // 7. 関連するチャンクも取得
    for (const result of finalResults) {
      const { data: relatedChunks, error: chunksError } = await supabase
        .from('knowledge_chunks')
        .select('chunk_content, chunk_index')
        .eq('knowledge_id', result.id)
        .order('chunk_index');
      
      if (!chunksError) {
        result.chunks = relatedChunks;
      }
    }
    
    // 8. 検索履歴に保存
    await supabase
      .from('search_history')
      .insert({
        query: query,
        query_embedding: queryEmbedding,
        results: finalResults
      });
    
    return finalResults;
    
  } catch (error) {
    console.error('Error in searchKnowledgeBase:', error);
    throw error;
  }
}

serve(async (req) => {
  // CORS プリフライトリクエスト対応
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 検索実行
    const results = await searchKnowledgeBase(query, limit || 5);
    
    return new Response(
      JSON.stringify({ results, success: true }),
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
