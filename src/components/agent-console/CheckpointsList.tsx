
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CheckpointsListProps {
  projectId: string;
}

const CheckpointsList: React.FC<CheckpointsListProps> = ({ projectId }) => {
  const [newCheckpoint, setNewCheckpoint] = useState({
    name: "",
    description: "",
    parameter_name: "",
    parameter_value: ""
  });
  const queryClient = useQueryClient();

  // Fetch checkpoints
  const { data: checkpoints, isLoading } = useQuery({
    queryKey: ["checkpoints", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkpoints')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Add checkpoint mutation
  const addCheckpoint = useMutation({
    mutationFn: async (checkpointData: typeof newCheckpoint & { project_id: string }) => {
      const { data, error } = await supabase
        .from('checkpoints')
        .insert([checkpointData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkpoints", projectId] });
      setNewCheckpoint({
        name: "",
        description: "",
        parameter_name: "",
        parameter_value: ""
      });
      toast.success("Checkpoint added successfully");
    },
    onError: (error) => {
      console.error("Error adding checkpoint:", error);
      toast.error("Failed to add checkpoint");
    }
  });

  // Update checkpoint status mutation
  const updateCheckpointStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data, error } = await supabase
        .from('checkpoints')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkpoints", projectId] });
      toast.success("Checkpoint status updated");
    },
    onError: (error) => {
      console.error("Error updating checkpoint status:", error);
      toast.error("Failed to update checkpoint status");
    }
  });

  const handleAddCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckpoint.name || !newCheckpoint.parameter_name) {
      toast.error("Checkpoint name and parameter name are required");
      return;
    }
    addCheckpoint.mutate({
      ...newCheckpoint,
      project_id: projectId
    });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateCheckpointStatus.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500">Blocked</Badge>;
      default:
        return <Badge className="bg-gray-500">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Checkpoint</CardTitle>
          <CardDescription>
            Create checkpoints with consistent parameters for tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCheckpoint} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Checkpoint Name
              </label>
              <Input
                id="name"
                value={newCheckpoint.name}
                onChange={(e) => setNewCheckpoint({...newCheckpoint, name: e.target.value})}
                placeholder="Enter checkpoint name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={newCheckpoint.description || ""}
                onChange={(e) => setNewCheckpoint({...newCheckpoint, description: e.target.value})}
                placeholder="Describe this checkpoint"
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parameter_name" className="block text-sm font-medium mb-1">
                  Parameter Name
                </label>
                <Input
                  id="parameter_name"
                  value={newCheckpoint.parameter_name}
                  onChange={(e) => setNewCheckpoint({...newCheckpoint, parameter_name: e.target.value})}
                  placeholder="Enter parameter name"
                />
              </div>
              <div>
                <label htmlFor="parameter_value" className="block text-sm font-medium mb-1">
                  Parameter Value
                </label>
                <Input
                  id="parameter_value"
                  value={newCheckpoint.parameter_value || ""}
                  onChange={(e) => setNewCheckpoint({...newCheckpoint, parameter_value: e.target.value})}
                  placeholder="Enter parameter value"
                />
              </div>
            </div>
            <Button type="submit" disabled={addCheckpoint.isPending}>
              {addCheckpoint.isPending ? "Adding..." : "Add Checkpoint"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center p-4">Loading checkpoints...</div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Checkpoints</h3>
          {checkpoints && checkpoints.length > 0 ? (
            checkpoints.map((checkpoint) => (
              <Card key={checkpoint.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{checkpoint.name}</CardTitle>
                    {getStatusBadge(checkpoint.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {checkpoint.description && (
                    <p className="text-muted-foreground">{checkpoint.description}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-md">
                    <div>
                      <p className="text-sm font-medium">Parameter Name:</p>
                      <p>{checkpoint.parameter_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Parameter Value:</p>
                      <p>{checkpoint.parameter_value || "Not set"}</p>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`status-${checkpoint.id}`} className="block text-sm font-medium mb-1">
                      Status
                    </label>
                    <Select 
                      value={checkpoint.status} 
                      onValueChange={(value) => handleStatusChange(checkpoint.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-muted-foreground">No checkpoints found for this project.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckpointsList;
