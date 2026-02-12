import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import auth models - REQUIRED for Replit Auth
export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Links to auth.users.id
  clientName: text("client_name"),
  sessionDate: timestamp("session_date").defaultNow(),
  sessionType: text("session_type"), // e.g., "Individual", "Couples", "Family"
  riskFlags: text("risk_flags"), // Comma-separated or JSON? Let's use text for simplicity in MVP
  rawNotes: text("raw_notes"),
  transcript: text("transcript"),
  
  // Generated content
  structuredOutput: jsonb("structured_output"), // Stores { soap: "...", dap: "...", birp: "..." }
  selectedFormat: text("selected_format").default("SOAP"), // "SOAP" | "DAP" | "BIRP"
  
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === RELATIONS ===
// (None strictly needed for MVP if we just store userId as text, 
// but we could add a relation to users if we imported the users table object here)

// === BASE SCHEMAS ===
export const insertNoteSchema = createInsertSchema(notes).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

// Request types
export type CreateNoteRequest = InsertNote;
export type UpdateNoteRequest = Partial<InsertNote>;

// Response types
export type NoteResponse = Note;
export type NotesListResponse = Note[];

// AI Generation Request
export interface GenerateNoteRequest {
  rawNotes?: string;
  transcript?: string;
  format: "SOAP" | "DAP" | "BIRP";
  clientName?: string;
  sessionType?: string;
  riskFlags?: string;
}

export interface GenerateNoteResponse {
  content: string;
  format: "SOAP" | "DAP" | "BIRP";
}
