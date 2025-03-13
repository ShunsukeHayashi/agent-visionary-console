
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import DynamicAgentGenerator from "./DynamicAgentGenerator";
import { useAgentForm } from "./agent-form/useAgentForm";
import AgentFormHeader from "./agent-form/AgentFormHeader";
import AgentFormFields from "./agent-form/AgentFormFields";
import AgentAdvancedOptions from "./agent-form/AgentAdvancedOptions";
import AgentFormFooter from "./agent-form/AgentFormFooter";
import { AgentFormValues } from "./agent-form/agentFormSchema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { CommandType } from "./command/CommandButton";
import { FileSpreadsheet, MailCheck, Calculator, FileText, Database } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CreateAgentFormProps {
  onSubmit: (values: AgentFormValues) => void;
  onCancel: () => void;
}

// サンプルの勤怠管理フローテンプレート
const payrollWorkflowTemplate = {
  name: "勤怠・給与計算自動化エージェント",
  type: "payroll",
  description: "メールから受け取った勤怠データを処理し、自動計算して給与明細を生成するエージェントです。OCR処理、データ集計、計算処理、レポート生成機能を備えています。",
  skills: [
    { name: "OCR処理", level: 85 },
    { name: "データ分析", level: 90 },
    { name: "スプレッドシート操作", level: 95 },
    { name: "ドキュメント生成", level: 80 },
    { name: "メール処理", level: 75 }
  ],
  apiTools: [
    {
      name: "OCR API",
      endpoint: "https://api.example.com/ocr",
      description: "手書きデータや画像からテキスト情報を抽出",
      parameters: [
        { name: "image", type: "file", required: true, description: "処理する画像ファイル" }
      ]
    },
    {
      name: "Spreadsheet API",
      description: "Googleスプレッドシートの操作と管理",
      parameters: [
        { name: "sheetId", type: "string", required: true, description: "シートID" },
        { name: "operation", type: "string", required: true, description: "実行する操作" }
      ]
    }
  ],
  functionTools: [
    {
      name: "給与計算",
      description: "勤怠データから給与を自動計算",
      input: "勤怠時間データ",
      output: "給与計算結果"
    },
    {
      name: "給与明細生成",
      description: "計算結果から給与明細PDFを生成",
      input: "給与計算結果",
      output: "給与明細PDF"
    }
  ],
  workflow: {
    steps: [
      {
        name: "データ受け取り",
        description: "メールから勤怠データを受信",
        isAutomated: false,
        assignedTo: "human",
        expectedDuration: 30
      },
      {
        name: "OCR処理",
        description: "画像・PDFからデータを抽出",
        isAutomated: true,
        toolRequired: "OCR API",
        expectedDuration: 10
      },
      {
        name: "データ集約",
        description: "スプレッドシートにデータを集約",
        isAutomated: true,
        toolRequired: "Spreadsheet API",
        expectedDuration: 15
      },
      {
        name: "自動計算",
        description: "給与・残業代等を計算",
        isAutomated: true,
        toolRequired: "給与計算",
        expectedDuration: 5
      },
      {
        name: "給与明細作成",
        description: "個別の給与明細を生成",
        isAutomated: true,
        toolRequired: "給与明細生成",
        expectedDuration: 10
      },
      {
        name: "目視確認",
        description: "人間による最終確認",
        isAutomated: false,
        assignedTo: "human",
        expectedDuration: 60
      }
    ]
  }
};

// 勤怠管理フローのサンプルコマンド
const payrollWorkflowCommands: CommandType[] = [
  {
    id: "receive-data",
    label: "勤怠データ受け取り",
    description: "メールから勤怠データを受け取る",
    icon: "play",
    action: () => { console.log("データ受け取り"); },
    order: 1
  },
  {
    id: "ocr-processing",
    label: "OCR処理",
    description: "画像・PDFからテキストデータを抽出",
    isToolCommand: true,
    toolType: "api",
    action: () => { console.log("OCR処理"); },
    order: 2,
    toolDetails: {
      input: "画像・PDFファイル",
      output: "テキストデータ"
    }
  },
  {
    id: "data-collection",
    label: "スプレッドシート集約",
    description: "データをスプレッドシートに集約",
    isToolCommand: true,
    toolType: "database",
    action: () => { console.log("データ集約"); },
    order: 3
  },
  {
    id: "calculation",
    label: "自動計算処理",
    description: "給与・残業代等を自動計算",
    isToolCommand: true,
    toolType: "function",
    action: () => { console.log("自動計算"); },
    order: 4
  },
  {
    id: "generate-payslip",
    label: "給与明細作成",
    description: "個別の給与明細PDFを生成",
    isToolCommand: true,
    toolType: "document",
    action: () => { console.log("給与明細作成"); },
    order: 5
  },
  {
    id: "human-check",
    label: "目視確認",
    description: "人間による最終確認",
    icon: "list",
    action: () => { console.log("目視確認"); },
    order: 6
  }
];

const CreateAgentForm: React.FC<CreateAgentFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [showPayrollTemplate, setShowPayrollTemplate] = useState(false);

  const {
    form,
    isGoalMode,
    isDynamicGeneration,
    showAdvancedOptions,
    handleSubmit,
    handleAgentGenerated,
    toggleGoalMode,
    setShowAdvancedOptions
  } = useAgentForm({ onSubmit });

  const applyPayrollTemplate = () => {
    form.reset(payrollWorkflowTemplate);
    setShowPayrollTemplate(false);
    toast({
      title: "勤怠・給与計算テンプレート適用",
      description: "テンプレートを適用しました。必要に応じて詳細情報を編集してください。",
    });
  };

  return (
    <>
      <AgentFormHeader 
        isGoalMode={isGoalMode} 
        toggleGoalMode={toggleGoalMode} 
      />
    
      {isGoalMode ? (
        <DynamicAgentGenerator onAgentGenerated={handleAgentGenerated} />
      ) : (
        <>
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPayrollTemplate(!showPayrollTemplate)}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              勤怠・給与計算システムのテンプレートを表示
            </Button>
            
            {showPayrollTemplate && (
              <Card className="p-4 mt-4 border border-dashed border-primary/50 bg-secondary/10">
                <h3 className="text-lg font-medium mb-3">勤怠・給与計算自動化フロー</h3>
                
                <div className="mb-4 text-sm">
                  <p className="mb-2">メールから受け取った勤怠データを処理し、自動計算して給与明細を生成する自動化フローです。</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                      <MailCheck className="h-3 w-3 mr-1" /> データ受け取り
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                      <Database className="h-3 w-3 mr-1" /> データ集約
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center">
                      <Calculator className="h-3 w-3 mr-1" /> 自動計算
                    </span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs flex items-center">
                      <FileText className="h-3 w-3 mr-1" /> 振込書生成
                    </span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ステップ</TableHead>
                        <TableHead>説明</TableHead>
                        <TableHead>自動化</TableHead>
                        <TableHead>使用ツール</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payrollWorkflowTemplate.workflow?.steps?.map((step, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{step.name}</TableCell>
                          <TableCell>{step.description}</TableCell>
                          <TableCell>{step.isAutomated ? "自動" : "手動"}</TableCell>
                          <TableCell>{step.toolRequired || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" className="mr-2" onClick={() => setShowPayrollTemplate(false)}>
                    閉じる
                  </Button>
                  <Button onClick={applyPayrollTemplate}>
                    このテンプレートを適用
                  </Button>
                </div>
              </Card>
            )}
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <AgentFormFields 
                form={form} 
                isDynamicGeneration={isDynamicGeneration} 
              />

              <AgentAdvancedOptions 
                form={form}
                showAdvancedOptions={showAdvancedOptions}
                setShowAdvancedOptions={setShowAdvancedOptions}
              />

              <AgentFormFooter 
                onCancel={onCancel}
                isDynamicGeneration={isDynamicGeneration}
              />
            </form>
          </Form>
        </>
      )}
    </>
  );
};

export default CreateAgentForm;
