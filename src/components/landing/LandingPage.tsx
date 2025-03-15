import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Zap, Shield, Sparkles, Code, BarChart, Users, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col space-y-6"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-2">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>AI for Uの新しいエージェントプラットフォーム</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-primary">AI</span> エージェントで<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                  業務を自動化
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                目標を入力するだけで、AIがタスクを分解し、最適なエージェントを自動生成。
                複雑な業務プロセスを効率化し、チームの生産性を向上させます。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/console">
                  <Button size="lg" className="w-full sm:w-auto">
                    エージェントコンソールを開く
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    アカウント作成
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center pt-4 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 mr-2" />
                <span>エンタープライズグレードのセキュリティと信頼性</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="Agent Dashboard Preview" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AIエージェントの<span className="text-primary">革新的な機能</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              目標からタスクを自動生成し、最適なAIエージェントを構築。
              複雑な業務プロセスを効率化するための先進機能を搭載。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">簡単</span>3ステップで業務を自動化
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              複雑な設定は不要。目標を入力するだけで、AIが最適なエージェントを自動生成します。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 pt-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <img 
                    src="/placeholder.svg" 
                    alt={step.title}
                    className="w-full h-auto rounded-lg border border-border/50"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">様々な業務</span>に対応
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              データ分析からカスタマーサポート、マーケティングまで、
              あらゆる業務プロセスを効率化するAIエージェントを構築できます。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-2 bg-gradient-to-br from-primary/20 to-blue-500/20 p-6 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                      {useCase.icon}
                    </div>
                  </div>
                  <div className="md:col-span-3 p-6">
                    <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-muted-foreground mb-4">{useCase.description}</p>
                    <ul className="space-y-2">
                      {useCase.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Zap className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 z-0"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                AIエージェントで<span className="text-primary">業務を革新</span>する準備はできましたか？
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                今すぐアカウントを作成して、AIエージェントの力を体験してください。
                複雑な業務プロセスを効率化し、チームの生産性を向上させましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/console">
                  <Button size="lg" className="w-full sm:w-auto">
                    エージェントコンソールを開く
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    アカウント作成
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Features data
const features = [
  {
    title: "目標からタスクを自動生成",
    description: "目標を入力するだけで、AIが最適なタスクに分解し、実行計画を自動生成します。",
    icon: <Layers className="h-6 w-6 text-primary" />
  },
  {
    title: "動的エージェント生成",
    description: "タスクの内容に応じて、最適なスキルとツールを持つAIエージェントを自動生成します。",
    icon: <Bot className="h-6 w-6 text-primary" />
  },
  {
    title: "リバース思考プロセス",
    description: "目標から逆算して最適な解決策を導き出す、革新的な思考プロセスを実装しています。",
    icon: <Sparkles className="h-6 w-6 text-primary" />
  },
  {
    title: "エレメントチェーン処理",
    description: "複雑なタスクを要素ごとに分解し、順序立てて効率的に処理します。",
    icon: <Code className="h-6 w-6 text-primary" />
  },
  {
    title: "高度なパフォーマンス分析",
    description: "エージェントのパフォーマンスをリアルタイムで分析し、継続的に最適化します。",
    icon: <BarChart className="h-6 w-6 text-primary" />
  },
  {
    title: "チーム連携機能",
    description: "複数のエージェントが連携して複雑なプロジェクトを効率的に処理します。",
    icon: <Users className="h-6 w-6 text-primary" />
  }
];

// How it works steps
const steps = [
  {
    title: "目標を入力",
    description: "達成したい目標や解決したい課題を自然言語で入力するだけ。",
    image: "/step1-goal-input.png"
  },
  {
    title: "AIがタスクを分解",
    description: "AIが目標を分析し、最適なタスクに分解して実行計画を作成します。",
    image: "/step2-task-breakdown.png"
  },
  {
    title: "エージェントが実行",
    description: "専用AIエージェントが各タスクを自動実行し、結果をレポートします。",
    image: "/step3-agent-execution.png"
  }
];

// Use cases
const useCases = [
  {
    title: "データ分析と可視化",
    description: "複雑なデータセットを分析し、インサイトを抽出して可視化するエージェント。",
    icon: <BarChart className="h-8 w-8 text-primary" />,
    benefits: [
      "大量データの高速処理と分析",
      "カスタマイズ可能な可視化レポート",
      "定期的なデータ更新と傾向分析"
    ]
  },
  {
    title: "カスタマーサポート自動化",
    description: "顧客からの問い合わせに24時間対応し、適切な解決策を提供するエージェント。",
    icon: <Users className="h-8 w-8 text-primary" />,
    benefits: [
      "自然な対話でのサポート提供",
      "複雑な問題の自動エスカレーション",
      "顧客満足度の継続的な向上"
    ]
  },
  {
    title: "マーケティングキャンペーン最適化",
    description: "マーケティングデータを分析し、キャンペーンを最適化するエージェント。",
    icon: <Zap className="h-8 w-8 text-primary" />,
    benefits: [
      "ターゲットオーディエンスの自動分析",
      "A/Bテストの実施と結果分析",
      "ROIを最大化するための戦略提案"
    ]
  },
  {
    title: "ソフトウェア開発支援",
    description: "コード生成、バグ検出、最適化を支援するエージェント。",
    icon: <Code className="h-8 w-8 text-primary" />,
    benefits: [
      "高品質なコードの自動生成",
      "バグの早期発見と修正提案",
      "コードの最適化と性能向上"
    ]
  }
];

export default LandingPage;
