
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface PlanningSheetProps {
  projectId: string;
}

// Default planning questions by category
const defaultQuestions = [
  { category: "Project Goals", question: "What are the main objectives of this project?" },
  { category: "Project Goals", question: "What specific outcomes do you expect from this project?" },
  { category: "Timeline", question: "What is the desired completion date?" },
  { category: "Timeline", question: "Are there any critical milestones we should be aware of?" },
  { category: "Stakeholders", question: "Who are the key stakeholders in this project?" },
  { category: "Stakeholders", question: "Who will be the main point of contact for approvals?" },
  { category: "Requirements", question: "What are the essential features or deliverables?" },
  { category: "Requirements", question: "Are there any specific technical requirements?" },
  { category: "Budget", question: "What is the overall budget for this project?" },
  { category: "Budget", question: "Are there any budgetary constraints we should be aware of?" }
];

const PlanningSheet: React.FC<PlanningSheetProps> = ({ projectId }) => {
  const [newQuestion, setNewQuestion] = useState({ category: "", question: "" });
  const queryClient = useQueryClient();

  // Fetch existing planning questions
  const { data: planningQuestions, isLoading } = useQuery({
    queryKey: ["planning-questions", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planning_questions')
        .select('*')
        .eq('project_id', projectId)
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Check if default questions need to be added
  useEffect(() => {
    if (planningQuestions && planningQuestions.length === 0) {
      // Add default questions if none exist
      const addDefaultQuestions = async () => {
        const questionsToAdd = defaultQuestions.map(q => ({
          ...q,
          project_id: projectId,
          importance: 1
        }));
        
        const { error } = await supabase
          .from('planning_questions')
          .insert(questionsToAdd);
        
        if (error) {
          console.error("Error adding default questions:", error);
          toast.error("Failed to add default planning questions");
        } else {
          queryClient.invalidateQueries({ queryKey: ["planning-questions", projectId] });
          toast.success("Default planning questions added");
        }
      };
      
      addDefaultQuestions();
    }
  }, [planningQuestions, projectId, queryClient]);

  // Add new question mutation
  const addQuestion = useMutation({
    mutationFn: async (questionData: typeof newQuestion & { project_id: string }) => {
      const { data, error } = await supabase
        .from('planning_questions')
        .insert([questionData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planning-questions", projectId] });
      setNewQuestion({ category: "", question: "" });
      toast.success("Planning question added successfully");
    },
    onError: (error) => {
      console.error("Error adding question:", error);
      toast.error("Failed to add planning question");
    }
  });

  // Update question answer mutation
  const updateAnswer = useMutation({
    mutationFn: async ({ id, answer }: { id: string, answer: string }) => {
      const { data, error } = await supabase
        .from('planning_questions')
        .update({ answer })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planning-questions", projectId] });
      toast.success("Answer updated");
    },
    onError: (error) => {
      console.error("Error updating answer:", error);
      toast.error("Failed to update answer");
    }
  });

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.category || !newQuestion.question) {
      toast.error("Both category and question are required");
      return;
    }
    addQuestion.mutate({
      ...newQuestion,
      project_id: projectId
    });
  };

  const handleAnswerChange = (id: string, answer: string) => {
    updateAnswer.mutate({ id, answer });
  };

  // Group questions by category
  const groupedQuestions = React.useMemo(() => {
    if (!planningQuestions) return {};
    
    return planningQuestions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {} as Record<string, typeof planningQuestions>);
  }, [planningQuestions]);

  if (isLoading) {
    return <div className="text-center p-4">Loading planning sheet...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Planning Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <Input
                id="category"
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                placeholder="e.g., Timeline, Budget, Requirements"
              />
            </div>
            <div>
              <label htmlFor="question" className="block text-sm font-medium mb-1">
                Question
              </label>
              <Input
                id="question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                placeholder="Enter your planning question"
              />
            </div>
            <Button type="submit" disabled={addQuestion.isPending}>
              {addQuestion.isPending ? "Adding..." : "Add Question"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Project Planning Sheet</h3>
        
        {Object.keys(groupedQuestions).length > 0 ? (
          Object.entries(groupedQuestions).map(([category, questions]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <label className="font-medium">{question.question}</label>
                    <Textarea
                      value={question.answer || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Enter your answer..."
                      className="min-h-[100px]"
                      onBlur={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-muted-foreground">No planning questions found.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlanningSheet;
