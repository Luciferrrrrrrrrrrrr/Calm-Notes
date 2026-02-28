import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type NoteInput, type NoteUpdateInput, type GenerateNoteInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// GET /api/notes
export function useNotes() {
  return useQuery({
    queryKey: [api.notes.list.path],
    queryFn: async () => {
      const res = await fetch(api.notes.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch notes");
      // Use the safeParse if you want strict validation, or just cast for speed if types are tight
      return api.notes.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/notes/:id
export function useNote(id: number) {
  return useQuery({
    queryKey: [api.notes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.notes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch note");
      return api.notes.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

// POST /api/notes
export function useCreateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: NoteInput) => {
      const validated = api.notes.create.input.parse(data);
      const res = await fetch(api.notes.create.path, {
        method: api.notes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 400) {
          const error = api.notes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create note");
      }
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      toast({ title: "Note Created", description: "Your clinical note has been saved securely." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// PUT /api/notes/:id
export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & NoteUpdateInput) => {
      const validated = api.notes.update.input.parse(updates);
      const url = buildUrl(api.notes.update.path, { id });
      const res = await fetch(url, {
        method: api.notes.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 404) throw new Error("Note not found");
        if (res.status === 400) {
          const error = api.notes.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update note");
      }
      return api.notes.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.notes.get.path, data.id] });
      toast({ title: "Note Updated", description: "Changes saved successfully." });
    },
    onError: (err) => {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    },
  });
}

// DELETE /api/notes/:id
export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.notes.delete.path, { id });
      const res = await fetch(url, { 
        method: api.notes.delete.method, 
        credentials: "include" 
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 404) throw new Error("Note not found");
        throw new Error("Failed to delete note");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      toast({ title: "Note Deleted", description: "The note has been removed from your records." });
    },
    onError: (err) => {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    },
  });
}

// POST /api/notes/generate (AI Generation)
export function useGenerateNote() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateNoteInput) => {
      const validated = api.notes.generate.input.parse(data);
      const res = await fetch(api.notes.generate.path, {
        method: api.notes.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 400) {
          const error = api.notes.generate.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to generate note");
      }
      return api.notes.generate.responses[200].parse(await res.json());
    },
    onError: (err) => {
      toast({ title: "Generation Failed", description: err.message, variant: "destructive" });
    },
  });
}
