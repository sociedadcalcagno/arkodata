import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertChatSessionSchema } from "@shared/schema";
import { ARKO_HELP_DOCS } from "@shared/arko-help";
import { z } from "zod";
import OpenAI from 'openai';
import { sendEmail, generateConfirmationEmail, generateNotificationEmail } from './email';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

function normalizeHelpText(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenizeHelpText(value: unknown) {
  return normalizeHelpText(value).split(' ').filter(Boolean);
}

function searchHelpDocs(question: string) {
  const questionTokens = new Set(tokenizeHelpText(question));
  const hits: Array<{ title: string; heading: string; snippet: string; score: number }> = [];

  for (const doc of ARKO_HELP_DOCS) {
    for (const section of doc.sections) {
      const content = `${doc.title} ${doc.summary} ${section.heading} ${section.body}`;
      const sectionTokens = tokenizeHelpText(content);
      let score = 0;
      for (const token of sectionTokens) {
        if (questionTokens.has(token)) score += 1;
      }
      if (score > 0) {
        hits.push({
          title: doc.title,
          heading: section.heading,
          snippet: section.body,
          score,
        });
      }
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, 3);
}

function buildBaseHelpContext() {
  return ARKO_HELP_DOCS
    .map((doc) => `# ${doc.title}\n${doc.summary}\n${doc.sections.map((section) => `- ${section.heading}: ${section.body}`).join('\n')}`)
    .join('\n\n');
}

function buildMockAnswer(question: string, hits: ReturnType<typeof searchHelpDocs>) {
  const normalized = normalizeHelpText(question);

  if (/^(hola|buenos dias|buen dia|buenas tardes|buenas noches)\b/.test(normalized)) {
    return 'Hola. Soy ArkoAsistente. Puedo ayudarte a entender los servicios de ArkoData, aterrizar una necesidad tecnica o comercial y orientarte hacia una propuesta concreta. Cuéntame que quieres resolver.';
  }

  if (hits.length === 0) {
    return [
      'Te ayudo a enfocar tu requerimiento.',
      '',
      'Puedo orientarte en:',
      '- desarrollo web y aplicaciones a medida',
      '- inteligencia artificial y chatbots',
      '- automatizacion de procesos',
      '- ciberseguridad e infraestructura',
      '- consultoria tecnologica',
      '',
      'Si quieres una respuesta mas precisa, dime tu rubro, el problema actual y lo que esperas lograr.'
    ].join('\n');
  }

  return [
    'Te guio con base en los servicios actuales de ArkoData:',
    '',
    ...hits.map((hit) => `- ${hit.title} > ${hit.heading}:\n${hit.snippet}`),
    '',
    'Si quieres, dame mas contexto de tu empresa o proyecto y te sugiero una siguiente accion concreta.'
  ].join('\n');
}

async function buildAiAnswer(question: string, history: ChatMsg[], context: string) {
  if (!openai) return null;

  const historyText = history
    .slice(-10)
    .map((message) => `${message.role === 'user' ? 'Usuario' : 'Asistente'}: ${message.content}`)
    .join('\n');

  const prompt = [
    'Eres ArkoAsistente, asistente comercial y tecnico de ArkoData.',
    'Respondes solo en espanol chileno.',
    'Prioriza el contexto entregado sobre servicios y forma de trabajo.',
    'No inventes servicios, precios cerrados, integraciones o capacidades no confirmadas.',
    'Si falta contexto, haz una sola pregunta concreta para avanzar.',
    'Busca orientar al usuario hacia una propuesta clara o al contacto con el equipo.',
    '',
    `Contexto:\n${context}`,
    historyText ? `Conversacion previa:\n${historyText}` : '',
    `Pregunta: ${question}`,
    'Respuesta:'
  ].filter(Boolean).join('\n\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.5,
  });

  return completion.choices[0]?.message?.content?.trim() || null;
}

function buildFallbackResponse(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (/(hola|buenas|buenos dias|buen día|buenas tardes|buenas noches)/i.test(normalizedMessage)) {
    return `Hola, soy ArkoAsistente. Puedo orientarte sobre los servicios de ArkoData y ayudarte a encontrar la mejor alternativa para tu empresa.

Hoy te puedo apoyar con:
- Desarrollo web y plataformas a medida
- Automatización de procesos
- Inteligencia artificial y chatbots
- Ciberseguridad e infraestructura
- Consultoría tecnológica

Cuéntame qué necesitas y te ayudo a enfocarlo.`;
  }

  if (/(ia|inteligencia artificial|chatbot|bot|asistente)/i.test(normalizedMessage)) {
    return `En ArkoData implementamos soluciones de inteligencia artificial orientadas a negocio, como asistentes virtuales, automatización de atención, captura de leads y apoyo operativo.

Si quieres, puedo ayudarte a definir una solución según tu caso:
- atención a clientes
- ventas y captación de prospectos
- soporte interno
- automatización de tareas repetitivas

Si me cuentas tu rubro o necesidad, te propongo una opción concreta.`;
  }

  if (/(web|pagina|página|sitio|landing|app|aplicacion|aplicación|software)/i.test(normalizedMessage)) {
    return `ArkoData desarrolla sitios web, landing pages, plataformas internas y aplicaciones a medida.

Podemos ayudarte con:
- sitios corporativos y comerciales
- formularios y captación de leads
- dashboards y sistemas internos
- integraciones con terceros
- mejoras de rendimiento y experiencia móvil

Si quieres, dime qué estás buscando construir y te indico un camino recomendado.`;
  }

  if (/(ciber|seguridad|seguro|infraestructura|servidor|nube|cloud|docker)/i.test(normalizedMessage)) {
    return `También apoyamos en infraestructura y ciberseguridad para que tus sistemas sean más confiables, escalables y seguros.

Podemos revisar:
- despliegue en nube o contenedores
- hardening y buenas prácticas
- continuidad operacional
- monitoreo y estabilidad
- arquitectura para crecimiento

Si me indicas tu entorno actual, te sugiero por dónde partir.`;
  }

  if (/(precio|precios|valor|costo|cotiza|cotizacion|cotización|presupuesto)/i.test(normalizedMessage)) {
    return `En ArkoData las propuestas se ajustan al alcance, complejidad y etapa del proyecto.

Para orientarte mejor, normalmente definimos:
- objetivo del proyecto
- funcionalidades necesarias
- plazos esperados
- si necesitas soporte, IA, integraciones o infraestructura

Si quieres, descríbeme lo que necesitas y te ayudo a ordenarlo para una cotización.`;
  }

  if (/(contacto|whatsapp|correo|email|llamar|reunion|reunión|agendar)/i.test(normalizedMessage)) {
    return `Claro. Puedes contactar al equipo de ArkoData por estos canales:

- Email: contacto@arkodata.cl
- WhatsApp: +56 9 3355 3024
- Horario: lunes a viernes de 9:00 a 18:00, sábado de 10:00 a 14:00

Si prefieres, también puedes dejar tu nombre, correo y lo que necesitas, y te orientamos desde aquí.`;
  }

  return `Puedo ayudarte con los principales servicios de ArkoData:

- desarrollo web y aplicaciones a medida
- inteligencia artificial y chatbots
- automatización de procesos
- ciberseguridad e infraestructura
- consultoría tecnológica

Cuéntame qué quieres resolver en tu empresa y te respondo con una orientación más concreta.`;
}

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

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
        to: 'contacto@arkodata.cl',
        toName: 'Equipo ArkoData',
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
      const historyIn = Array.isArray(req.body?.history) ? req.body.history : [];
      
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

      const history: ChatMsg[] = historyIn
        .map((entry: any) => ({
          role: entry?.role === 'assistant' ? 'assistant' : 'user',
          content: String(entry?.content || '').trim(),
        }))
        .filter((entry: ChatMsg) => entry.content)
        .slice(-20);

      const hits = searchHelpDocs(message);
      const context = [buildBaseHelpContext(), ...hits.map((hit) => `# ${hit.title} > ${hit.heading}\n${hit.snippet}`)].join('\n\n');

      let response = await buildAiAnswer(message, history, context);
      if (!response) {
        response = hits.length > 0 ? buildMockAnswer(message, hits) : buildFallbackResponse(message);
      }

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
      
      res.json({ response, hits: hits.map((hit) => ({ title: hit.title, heading: hit.heading })) });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      res.json({ 
        response: buildFallbackResponse(req.body?.message || '')
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
