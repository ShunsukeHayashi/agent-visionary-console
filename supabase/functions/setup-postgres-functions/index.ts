
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

// CORS ヘッダー
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase初期化
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PostgreSQL関数のセットアップ
async function setupPostgresFunctions() {
  // match_knowledge_chunks関数（チャンクレベルのベクトル検索）
  const matchChunksFunction = `
  CREATE OR REPLACE FUNCTION match_knowledge_chunks(query_embedding VECTOR(1536), match_threshold FLOAT, match_count INT)
  RETURNS TABLE(
    id UUID,
    knowledge_id UUID,
    chunk_index INT,
    chunk_content TEXT,
    similarity FLOAT
  )
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
      kc.id,
      kc.knowledge_id,
      kc.chunk_index,
      kc.chunk_content,
      1 - (kc.embedding <=> query_embedding) as similarity
    FROM knowledge_chunks kc
    WHERE 1 - (kc.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
  END;
  $$;
  `;

  // match_documents関数（ドキュメントレベルのベクトル検索）
  const matchDocumentsFunction = `
  CREATE OR REPLACE FUNCTION match_documents(query_embedding VECTOR(1536), match_threshold FLOAT, match_count INT)
  RETURNS TABLE(
    id UUID,
    title TEXT,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
  )
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
      kb.id,
      kb.title,
      kb.content,
      kb.metadata,
      1 - (kb.embedding <=> query_embedding) as similarity
    FROM knowledge_base kb
    WHERE 1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
  END;
  $$;
  `;

  try {
    // 関数を作成
    const { error: chunksError } = await supabase.rpc('pgfunction', { 
      query: matchChunksFunction 
    });
    
    if (chunksError) {
      console.error('Error creating match_knowledge_chunks function:', chunksError);
      throw chunksError;
    }
    
    const { error: docsError } = await supabase.rpc('pgfunction', { 
      query: matchDocumentsFunction 
    });
    
    if (docsError) {
      console.error('Error creating match_documents function:', docsError);
      throw docsError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error setting up Postgres functions:', error);
    throw error;
  }
}

serve(async (req) => {
  // CORS プリフライトリクエスト対応
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Service role key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PostgreSQL関数をセットアップ
    const result = await setupPostgresFunctions();
    
    return new Response(
      JSON.stringify(result),
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
