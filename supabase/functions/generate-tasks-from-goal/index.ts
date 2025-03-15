import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";
import { 
  thoughtStages, 
  getMainTaskSystemPrompt, 
  getSubtasksSystemPrompt,
  getUserPrompt,
  getSubtasksUserPrompt,
  formatRelatedContext
} from "./prompts.ts";

// CORS ヘッダー
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OpenAI API設定
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const OPENAI_CHAT_MODEL = 'gpt-4o-mini';

// Supabase初期化
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * ゴールからタスクを生成する関数
 * @param goal ユーザーの目標
 * @param relatedInfo 関連情報の配列
 * @returns 生成されたタスクデータ
 */
async function generateTasksFromGoal(goal: string, relatedInfo: any[] = []): Promise<any> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    // 関連情報をコンテキストとして整形
    const relatedContext = formatRelatedContext(relatedInfo);

    // システムプロンプトとユーザープロンプトの取得
    const systemPrompt = getMainTaskSystemPrompt();
    const userPrompt = getUserPrompt(goal, relatedContext);

    // OpenAI APIリクエスト
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    const result = await response.json();
    
    if (!result.choices || !result.choices[0]) {
      console.error('OpenAI API error:', result);
      throw new Error('Failed to generate task from OpenAI');
    }
    
    // JSONレスポンスをパース
    const content = result.choices[0].message.content;
    const taskData = JSON.parse(content);
    
    // 思考ステージをフラット化
    const flattenedTask = {
      ...taskData,
      ...taskData.thoughtStages
    };
    delete flattenedTask.thoughtStages;
    
    return flattenedTask;
    
  } catch (error) {
    console.error('Error generating task:', error);
    throw error;
  }
}

/**
 * 複数のサブタスクを生成する関数
 * @param goal ユーザーの目標
 * @param count 生成するサブタスクの数
 * @param relatedInfo 関連情報の配列
 * @returns 生成されたサブタスクの配列
 */
async function generateSubtasksFromGoal(goal: string, count: number = 3, relatedInfo: any[] = []): Promise<any[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    // 関連情報をコンテキストとして整形
    const relatedContext = formatRelatedContext(relatedInfo);

    // システムプロンプトとユーザープロンプトの取得
    const systemPrompt = getSubtasksSystemPrompt(count);
    const userPrompt = getSubtasksUserPrompt(goal, count, relatedContext);

    // OpenAI APIリクエスト
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    const result = await response.json();
    
    if (!result.choices || !result.choices[0]) {
      console.error('OpenAI API error:', result);
      throw new Error('Failed to generate subtasks from OpenAI');
    }
    
    // JSONレスポンスをパース
    const content = result.choices[0].message.content;
    const data = JSON.parse(content);
    
    return data.subtasks || [];
    
  } catch (error) {
    console.error('Error generating subtasks:', error);
    throw error;
  }
}

serve(async (req) => {
  // CORS プリフライトリクエスト対応
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, generateSubtasks = false, subtaskCount = 3, relatedInfo = [] } = await req.json();
    
    if (!goal) {
      return new Response(
        JSON.stringify({ error: 'Goal is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // メインタスクの生成
    const mainTask = await generateTasksFromGoal(goal, relatedInfo);
    
    let subtasks = [];
    
    // サブタスク生成が要求された場合
    if (generateSubtasks) {
      subtasks = await generateSubtasksFromGoal(goal, subtaskCount, relatedInfo);
    }
    
    return new Response(
      JSON.stringify({ 
        task: mainTask, 
        subtasks,
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
