/**
 * プロンプト管理モジュール
 * このファイルはタスク生成に関連するプロンプトを一元管理します
 */

// 思考ステージの定義
export const thoughtStages = [
  { key: 'goal', label: '目標定義', description: 'このタスクの目標は何か？達成すべき成果は？' },
  { key: 'definition', label: '問題定義', description: '解決すべき問題や課題は何か？' },
  { key: 'scenario', label: 'シナリオ', description: 'どのようなシナリオで動作する必要があるか？' },
  { key: 'context', label: 'コンテキスト', description: 'このタスクを取り巻く背景情報や考慮すべき制約は？' },
  { key: 'function', label: '機能要件', description: 'どのような機能を実装する必要があるか？' },
  { key: 'implementation', label: '実装計画', description: 'どのように実装するか？必要なステップは？' },
  { key: 'test_case', label: 'テストケース', description: '正しく機能していることを確認するためのテスト方法は？' },
  { key: 'validation', label: '検証基準', description: 'タスクが正常に完了したことをどのように検証するか？' },
  { key: 'deployment', label: 'デプロイ計画', description: '成果物をどのようにデプロイまたは提供するか？' },
  { key: 'result', label: '結果', description: 'タスクの結果と学びは何か？' }
];

/**
 * メインタスク生成用のシステムプロンプト
 * @param stages 思考ステージの配列
 * @returns システムプロンプト
 */
export function getMainTaskSystemPrompt(stages = thoughtStages): string {
  return `
あなたはタスク管理システムのAIアシスタントです。ユーザーの目標に基づいて、詳細なタスク情報を生成してください。
以下の思考ステージに沿って、タスクの詳細を考えてください：

${stages.map(stage => `- ${stage.label}（${stage.key}）: ${stage.description}`).join('\n')}

応答は以下のJSON形式で返してください：
{
  "name": "タスク名（簡潔で具体的に）",
  "description": "タスクの詳細な説明",
  "priority": "medium", // low, medium, high, urgentのいずれか
  "status": "pending",
  "progress": 0,
  "thoughtStages": {
    "goal": "目標の詳細な記述",
    "definition": "問題定義の詳細",
    "scenario": "想定されるシナリオ",
    "context": "タスクのコンテキスト",
    "function": "必要な機能の詳細",
    "implementation": "実装計画",
    "test_case": "テスト方法",
    "validation": "検証基準",
    "deployment": "デプロイ計画",
    "result": "予想される結果"
  }
}

各思考ステージは日本語で、具体的かつ実用的な内容を記述してください。
`;
}

/**
 * サブタスク生成用のシステムプロンプト
 * @param count 生成するサブタスクの数
 * @returns システムプロンプト
 */
export function getSubtasksSystemPrompt(count: number = 3): string {
  return `
あなたはタスク管理システムのAIアシスタントです。ユーザーの目標に基づいて、${count}個のサブタスクを生成してください。
各サブタスクは、目標を達成するために必要な具体的なステップを表します。

応答は以下のJSON形式で返してください：
{
  "subtasks": [
    {
      "name": "サブタスク1の名前",
      "description": "サブタスク1の詳細な説明",
      "priority": "medium", // low, medium, high, urgentのいずれか
      "status": "pending",
      "progress": 0
    },
    // 他のサブタスク...
  ]
}

各サブタスクは日本語で、具体的かつ実用的な内容を記述してください。
サブタスクは論理的な順序で並べ、目標達成のための一連のステップとなるようにしてください。
`;
}

/**
 * ユーザープロンプトの生成
 * @param goal ユーザーの目標
 * @param relatedContext 関連情報のコンテキスト
 * @returns ユーザープロンプト
 */
export function getUserPrompt(goal: string, relatedContext: string = ''): string {
  return `以下の目標に基づいて、タスクの詳細情報を生成してください：\n\n${goal}${relatedContext}`;
}

/**
 * サブタスク用ユーザープロンプトの生成
 * @param goal ユーザーの目標
 * @param count サブタスクの数
 * @param relatedContext 関連情報のコンテキスト
 * @returns ユーザープロンプト
 */
export function getSubtasksUserPrompt(goal: string, count: number = 3, relatedContext: string = ''): string {
  return `以下の目標に基づいて、${count}個のサブタスクを生成してください：\n\n${goal}${relatedContext}`;
}

/**
 * 関連情報のコンテキストを整形
 * @param relatedInfo 関連情報の配列
 * @returns 整形されたコンテキスト文字列
 */
export function formatRelatedContext(relatedInfo: any[] = []): string {
  if (relatedInfo.length === 0) return '';
  
  return `\n\n関連情報:\n${relatedInfo.map(info => 
    `- ${info.title}: ${info.content.substring(0, 200)}...`
  ).join('\n')}`;
}
