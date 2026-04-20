import { 
  users, 
  leads, 
  chatSessions,
  type User, 
  type InsertUser,
  type Lead,
  type InsertLead,
  type ChatSession,
  type InsertChatSession
} from "@shared/schema";
import { db, hasDatabase } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  
  // Chat session methods
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessions(): Promise<ChatSession[]>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
}

function requireDb() {
  if (!db) {
    throw new Error('Database storage requested without DATABASE_URL');
  }

  return db;
}

export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private leads: Lead[] = [];
  private chatSessions: ChatSession[] = [];
  private userId = 1;
  private leadId = 1;
  private chatSessionId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.userId++,
      ...insertUser,
    };

    this.users.push(user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const lead: Lead = {
      id: this.leadId++,
      createdAt: new Date(),
      ...insertLead,
      company: insertLead.company ?? null,
      phone: insertLead.phone ?? null,
    };

    this.leads.unshift(lead);
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return [...this.leads].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.find((lead) => lead.id === id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const session: ChatSession = {
      id: this.chatSessionId++,
      createdAt: new Date(),
      ...insertSession,
      userName: insertSession.userName ?? null,
      userEmail: insertSession.userEmail ?? null,
      userCompany: insertSession.userCompany ?? null,
      conversationSummary: insertSession.conversationSummary ?? null,
    };

    this.chatSessions.unshift(session);
    return session;
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return [...this.chatSessions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    return this.chatSessions.find((session) => session.id === id);
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await requireDb().select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await requireDb().select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await requireDb()
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await requireDb()
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return await requireDb()
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt));
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await requireDb().select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  // Chat session methods
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await requireDb()
      .insert(chatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return await requireDb()
      .select()
      .from(chatSessions)
      .orderBy(desc(chatSessions.createdAt));
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    const [session] = await requireDb().select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }
}

export const storage = hasDatabase ? new DatabaseStorage() : new MemoryStorage();
