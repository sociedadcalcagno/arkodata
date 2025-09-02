import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertChatSessionSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from 'openai';
import { sendEmail, generateConfirmationEmail, generateNotificationEmail } from './email';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead routes
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // Enviar email de confirmación al cliente
      const confirmationEmail = generateConfirmationEmail(leadData.name, leadData.company || 'No especificada');
      await sendEmail({
        to: leadData.email,
        toName: leadData.name,
        subject: confirmationEmail.subject,
        htmlContent: confirmationEmail.htmlContent
      });
      
      // Enviar notificación al administrador 
      const notificationEmail = generateNotificationEmail(leadData);
      await sendEmail({
        to: 'gmo.calcagno@gmail.com',
        toName: 'Guillermo Calcagno - ArkoData',
        subject: notificationEmail.subject,
        htmlContent: notificationEmail.htmlContent
      });
      
      console.log(`Emails enviados para lead: ${leadData.name} (${leadData.email})`);
      res.json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error('Error creando lead:', error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat session routes
  app.post("/api/chat-sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/chat-sessions", async (req, res) => {
    try {
      const sessions = await storage.getChatSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Chat endpoint with lead capture
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message || typeof message !== 'string') {
        res.status(400).json({ message: "Message is required" });
        return;
      }

      // Detectar información de contacto en el mensaje
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const phoneRegex = /(?:\+?56)?[\s\-]?[0-9][\s\-]?[0-9]{4}[\s\-]?[0-9]{4}|\+56[0-9]{9}|[0-9]{8,9}/g;
      const nameRegex = /(?:me llamo|soy|mi nombre es|nombre:)\s+([A-Za-zÀ-ÿ\s]{2,})/gi;

      const emails = message.match(emailRegex) || [];
      const phones = message.match(phoneRegex) || [];
      const names: string[] = [];
      let nameMatch;
      while ((nameMatch = nameRegex.exec(message)) !== null) {
        names.push(nameMatch[1].trim());
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Eres ArkoAsistente, el asistente virtual inteligente de ArkoData, una empresa chilena de soluciones tecnológicas especializada en:

• Desarrollo web y aplicaciones móviles
• Inteligencia artificial y chatbots
• Ciberseguridad empresarial
• Consultoría tecnológica
• Automatización de procesos

INSTRUCCIONES IMPORTANTES:
- Responde SIEMPRE en español chileno
- Sé profesional pero amigable y cercano
- Usa información específica sobre ArkoData cuando sea relevante
- Ayuda a generar leads preguntando por contacto cuando sea apropiado
- Si detectas información de contacto (email, teléfono, nombre), confirma educadamente que la registrarás
- Si no sabes algo específico, ofrece conectar con el equipo
- Usa emojis moderadamente para hacer más amigable la conversación

INFORMACIÓN DE CONTACTO:
- WhatsApp: +56 9 3355 3024
- Email: contacto@arkodata.cl
- Horarios: Lunes a Viernes 9:00-18:00, Sábados 10:00-14:00

Tu objetivo es ayudar, informar y generar interés en los servicios de ArkoData.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || "Disculpa, no pude procesar tu consulta. ¿Podrías intentar de nuevo?";

      // Si se detectó información de contacto, crear lead automáticamente
      if (emails.length > 0 || phones.length > 0 || names.length > 0) {
        try {
          const leadData = {
            name: names.length > 0 ? names[0] : 'Lead desde Chat',
            email: emails.length > 0 ? emails[0]! : `chat-${Date.now()}@temp.lead`,
            phone: phones.length > 0 ? phones[0] : null,
            message: `Contacto capturado desde ArkoAsistente: ${message}`,
            interest: 'Consulta vía Chat IA',
            source: 'ArkoAsistente'
          };

          await storage.createLead(leadData);
          console.log(`Lead capturado automáticamente: ${leadData.email}`);
        } catch (leadError) {
          console.error('Error creando lead automático:', leadError);
        }
      }

      // Guardar sesión de chat si se proporciona sessionId
      if (sessionId) {
        try {
          await storage.createChatSession({
            userMessage: message,
            assistantResponse: response,
            userName: names.length > 0 ? names[0] : null,
            userEmail: emails.length > 0 ? emails[0] : null,
            userCompany: null,
            conversationSummary: null
          });
        } catch (sessionError) {
          console.error('Error guardando sesión de chat:', sessionError);
        }
      }
      
      res.json({ response });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      res.status(500).json({ 
        message: "Lo siento, tuve un problema técnico. ¿Podrías intentar de nuevo o contactar directamente a nuestro equipo?"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
