
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import MeetingTranscriptForm from "./MeetingTranscriptForm";
import PlanningSheet from "./PlanningSheet";
import CheckpointsList from "./CheckpointsList";

const ProjectManagement = () => {
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    client_name: ""
  });
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async (projectData: typeof newProject) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setNewProject({ title: "", description: "", client_name: "" });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  });

  useEffect(() => {
    // Set the first project as active when data loads
    if (projects && projects.length > 0 && !activeProject) {
      setActiveProject(projects[0].id);
    }
  }, [projects, activeProject]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) {
      toast.error("Project title is required");
      return;
    }
    createProject.mutate(newProject);
  };

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>
            Create and manage projects, capture meeting notes, and track checkpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Project Title
              </label>
              <Input
                id="title"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                placeholder="Enter project title"
              />
            </div>
            <div>
              <label htmlFor="client" className="block text-sm font-medium mb-1">
                Client Name
              </label>
              <Input
                id="client"
                value={newProject.client_name}
                onChange={(e) => setNewProject({...newProject, client_name: e.target.value})}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                id="description"
                value={newProject.description || ""}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Enter project description"
              />
            </div>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? "Creating..." : "Create New Project"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {projects && projects.length > 0 ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {projects.map((project) => (
              <Button
                key={project.id}
                variant={activeProject === project.id ? "default" : "outline"}
                onClick={() => setActiveProject(project.id)}
                className="mb-2"
              >
                {project.title}
              </Button>
            ))}
          </div>

          {activeProject && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {projects.find(p => p.id === activeProject)?.title}
                </CardTitle>
                <CardDescription>
                  Client: {projects.find(p => p.id === activeProject)?.client_name || "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transcripts">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="transcripts">Meeting Transcripts</TabsTrigger>
                    <TabsTrigger value="planning">Planning Sheet</TabsTrigger>
                    <TabsTrigger value="checkpoints">Checkpoints</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="transcripts">
                    <MeetingTranscriptForm projectId={activeProject} />
                  </TabsContent>
                  
                  <TabsContent value="planning">
                    <PlanningSheet projectId={activeProject} />
                  </TabsContent>
                  
                  <TabsContent value="checkpoints">
                    <CheckpointsList projectId={activeProject} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <p className="text-muted-foreground">No projects found. Create your first project above.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectManagement;
