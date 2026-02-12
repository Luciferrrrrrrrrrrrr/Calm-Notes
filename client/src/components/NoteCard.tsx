import { type Note } from "@shared/schema";
import { format } from "date-fns";
import { Calendar, User, FileText, ArrowRight, Flag } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NoteCardProps {
  note: Note;
  compact?: boolean;
}

export function NoteCard({ note, compact = false }: NoteCardProps) {
  return (
    <Link href={`/notes/${note.id}`}>
      <div className={cn(
        "group bg-card hover:bg-card/80 border border-border/50 hover:border-primary/30 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden",
        compact ? "p-4" : "p-6 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
      )}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              {note.selectedFormat || "SOAP"}
            </Badge>
            {note.riskFlags && (
              <Badge variant="destructive" className="flex items-center gap-1 px-2">
                <Flag className="w-3 h-3" /> Risk Flag
              </Badge>
            )}
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
            {note.sessionType || "Session"}
          </span>
        </div>

        <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {note.clientName || "Unnamed Client"}
        </h3>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {note.sessionDate ? format(new Date(note.sessionDate), "MMM d, yyyy") : "No Date"}
          </div>
        </div>

        {!compact && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
            {
              // Try to extract content from structured JSON first, otherwise fallback
              (note.structuredOutput as any)?.content || 
              note.rawNotes || 
              "No content preview available."
            }
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
          <span className="text-xs text-muted-foreground font-medium">View Details</span>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
