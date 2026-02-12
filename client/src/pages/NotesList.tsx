import { useNotes } from "@/hooks/use-notes";
import { Layout } from "@/components/Layout";
import { NoteCard } from "@/components/NoteCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function NotesList() {
  const { data: notes, isLoading } = useNotes();
  const [search, setSearch] = useState("");

  const filteredNotes = notes?.filter(note => 
    note.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    note.rawNotes?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold">All Notes</h1>
        <Link href="/new">
          <Button className="bg-primary shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> New Note
          </Button>
        </Link>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search all notes..." 
          className="pl-9 bg-white border-border rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-500">
          {filteredNotes?.map(note => (
            <NoteCard key={note.id} note={note} compact />
          ))}
          {filteredNotes?.length === 0 && (
            <p className="text-center text-muted-foreground py-10">No notes found matching your search.</p>
          )}
        </div>
      )}
    </Layout>
  );
}
