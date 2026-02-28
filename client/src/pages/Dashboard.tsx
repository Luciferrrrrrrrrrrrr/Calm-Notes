import { useNotes } from "@/hooks/use-notes";
import { Layout } from "@/components/Layout";
import { NoteCard } from "@/components/NoteCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Filter, FileText } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Dashboard() {
  const { data: notes, isLoading } = useNotes();
  const [search, setSearch] = useState("");

  const filteredNotes = notes?.filter(note => 
    note.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    note.rawNotes?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your sessions and documentation.</p>
        </div>
        <Link href="/new">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl gap-2">
            <Plus className="w-5 h-5" />
            New Session Note
          </Button>
        </Link>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search clients or notes..." 
            className="pl-10 h-12 rounded-xl border-border bg-white shadow-sm focus:border-primary focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl gap-2 text-muted-foreground border-border bg-white shadow-sm">
          <Filter className="w-5 h-5" />
          Filters
        </Button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl border border-border/50 bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotes && filteredNotes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading mb-2">No notes found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Get started by creating your first clinical session note.
          </p>
          <Link href="/new">
            <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5">
              Create Note
            </Button>
          </Link>
        </div>
      )}
    </Layout>
  );
}
