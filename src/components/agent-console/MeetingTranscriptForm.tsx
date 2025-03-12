
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface MeetingTranscriptFormProps {
  projectId: string;
}

const MeetingTranscriptForm: React.FC<MeetingTranscriptFormProps> = ({ projectId }) => {
  const [transcriptContent, setTranscriptContent] = useState("");
  const queryClient = useQueryClient();

  // Fetch existing transcripts
  const { data: transcripts, isLoading } = useQuery({
    queryKey: ["transcripts", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_transcripts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Save transcript mutation
  const saveTranscript = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('meeting_transcripts')
        .insert([{
          project_id: projectId,
          content,
          meeting_date: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transcripts", projectId] });
      setTranscriptContent("");
      toast.success("Meeting transcript saved successfully");
    },
    onError: (error) => {
      console.error("Error saving transcript:", error);
      toast.error("Failed to save meeting transcript");
    }
  });

  const handleSaveTranscript = () => {
    if (!transcriptContent.trim()) {
      toast.error("Please enter meeting transcript content");
      return;
    }
    saveTranscript.mutate(transcriptContent);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meeting Transcript</CardTitle>
          <CardDescription>
            Add transcripts from project meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste or type meeting transcript here..."
            value={transcriptContent}
            onChange={(e) => setTranscriptContent(e.target.value)}
            className="min-h-[200px]"
          />
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveTranscript} 
            disabled={saveTranscript.isPending}
          >
            {saveTranscript.isPending ? "Saving..." : "Save Transcript"}
          </Button>
        </CardFooter>
      </Card>

      {isLoading ? (
        <div className="text-center p-4">Loading transcripts...</div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Previous Transcripts</h3>
          {transcripts && transcripts.length > 0 ? (
            transcripts.map((transcript) => (
              <Card key={transcript.id}>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Meeting on {new Date(transcript.meeting_date).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                    {transcript.content}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No transcripts available for this project
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingTranscriptForm;
