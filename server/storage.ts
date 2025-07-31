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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private chatSessions: Map<number, ChatSession>;
  private currentUserId: number;
  private currentLeadId: number;
  private currentChatId: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.chatSessions = new Map();
    this.currentUserId = 1;
    this.currentLeadId = 1;
    this.currentChatId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentLeadId++;
    const lead: Lead = { 
      ...insertLead,
      phone: insertLead.phone ?? null,
      company: insertLead.company ?? null,
      id, 
      createdAt: new Date() 
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  // Chat session methods
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentChatId++;
    const session: ChatSession = { 
      ...insertSession,
      userName: insertSession.userName ?? null,
      userEmail: insertSession.userEmail ?? null,
      userCompany: insertSession.userCompany ?? null,
      conversationSummary: insertSession.conversationSummary ?? null,
      id, 
      createdAt: new Date() 
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }
}

export const storage = new MemStorage();
