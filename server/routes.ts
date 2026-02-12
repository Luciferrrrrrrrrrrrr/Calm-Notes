import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Protected Notes Routes
  app.get(api.notes.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const notes = await storage.getNotes(userId);
    res.json(notes);
  });

  app.get(api.notes.get.path, isAuthenticated, async (req, res) => {
    const noteId = Number(req.params.id);
    const note = await storage.getNote(noteId);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    // Ensure the note belongs to the authenticated user
    const userId = (req.user as any).claims.sub;
    if (note.userId !== userId) {
       return res.status(401).json({ message: "Unauthorized access to note" });
    }

    res.json(note);
  });

  app.post(api.notes.create.path, isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      // Force userId to match authenticated user
      const noteData = { ...req.body, userId };
      
      const input = api.notes.create.input.parse(noteData);
      const note = await storage.createNote(input);
      res.status(201).json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.notes.update.path, isAuthenticated, async (req, res) => {
    try {
      const noteId = Number(req.params.id);
      const note = await storage.getNote(noteId);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const userId = (req.user as any).claims.sub;
      if (note.userId !== userId) {
        return res.status(401).json({ message: "Unauthorized access to note" });
      }

      const input = api.notes.update.input.parse(req.body);
      const updatedNote = await storage.updateNote(noteId, input);
      res.json(updatedNote);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.notes.delete.path, isAuthenticated, async (req, res) => {
      const noteId = Number(req.params.id);
      const note = await storage.getNote(noteId);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const userId = (req.user as any).claims.sub;
      if (note.userId !== userId) {
        return res.status(401).json({ message: "Unauthorized access to note" });
      }

      await storage.deleteNote(noteId);
      res.status(204).send();
  });

  // Generate Note using AI
  app.post(api.notes.generate.path, isAuthenticated, async (req, res) => {
    try {
      const { rawNotes, transcript, format, clientName, sessionType, riskFlags } = req.body;

      if (!rawNotes && !transcript) {
        return res.status(400).json({ message: "Either raw notes or transcript is required." });
      }

      const systemPrompt = `You are a clinical documentation assistant. 
      Your task is to generate a professional, clinically sound session note in ${format} format.
      
      Format Definitions:
      - SOAP: Subjective, Objective, Assessment, Plan
      - DAP: Data, Assessment, Plan
      - BIRP: Behavior, Intervention, Response, Plan

      Guidelines:
      - Use professional, objective, clinical language.
      - Maintain patient privacy (do not hallucinate identifying details if not provided).
      - Highlight any provided risk factors clearly.
      - If risk flags are provided: ${riskFlags || "None"}, ensure they are addressed in the assessment/intervention.
      - Session Type: ${sessionType || "Not specified"}.
      - Client Name: ${clientName || "Client"}.

      Input Data:
      ${rawNotes ? `Raw Notes: ${rawNotes}` : ""}
      ${transcript ? `Transcript: ${transcript}` : ""}
      
      Output the note structure clearly. Do not include conversational filler. Just the note content.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the note." }
        ],
        max_completion_tokens: 1500, // Reasonable limit for a note
        temperature: 0.7,
      });

      const generatedContent = response.choices[0].message.content || "Failed to generate note.";

      res.json({
        content: generatedContent,
        format: format,
      });

    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ message: "Failed to generate note: " + error.message });
    }
  });

  return httpServer;
}
