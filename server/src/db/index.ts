import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Ensure data directory exists
const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(dataDir, "chat.db");
const db: DatabaseType = new Database(dbPath);

// Enable WAL mode for better concurrent performance
db.pragma("journal_mode = WAL");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    content TEXT NOT NULL,
    platform TEXT DEFAULT 'web' CHECK (platform IN ('web', 'whatsapp', 'instagram', 'facebook')),
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  );

  CREATE INDEX IF NOT EXISTS idx_messages_conversation 
    ON messages(conversation_id);
`);

export interface Message {
  id: number;
  conversation_id: string;
  sender: "user" | "ai";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  created_at: string;
}

// Create a new conversation and return its ID
export function createConversation(): string {
  const id = uuidv4();
  const stmt = db.prepare("INSERT INTO conversations (id) VALUES (?)");
  stmt.run(id);
  return id;
}

// Check if a conversation exists
export function conversationExists(sessionId: string): boolean {
  const stmt = db.prepare("SELECT id FROM conversations WHERE id = ?");
  const result = stmt.get(sessionId);
  return !!result;
}

// Save a message to the database
export function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  content: string
): Message {
  const stmt = db.prepare(`
    INSERT INTO messages (conversation_id, sender, content)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(conversationId, sender, content);

  return {
    id: result.lastInsertRowid as number,
    conversation_id: conversationId,
    sender,
    content,
    created_at: new Date().toISOString(),
  };
}

// Get the last N messages for a conversation (for context)
export function getConversationHistory(
  conversationId: string,
  limit: number = 10
): Message[] {
  const stmt = db.prepare(`
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);
  const messages = stmt.all(conversationId, limit) as Message[];
  // Reverse to get chronological order
  return messages.reverse();
}

// Get all messages for a conversation (for fetching full history)
export function getAllMessages(conversationId: string): Message[] {
  const stmt = db.prepare(`
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `);
  return stmt.all(conversationId) as Message[];
}

export default db;
