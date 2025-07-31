// Servicio de emails para ArkoData
// Configuración segura sin afectar funcionalidad existente

interface EmailData {
  userEmail: string;
  userName: string;
  userCompany?: string;
  conversationSummary: string;
  timestamp: string;
}

interface LeadData {
  email: string;
  name: string;
  company?: string;
  phone?: string;
  interest: string;
  source: string;
}

class EmailService {
  private serviceId = 'service_arkodata';
  private templateId = 'template_lead_capture';
  private publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // Reemplazar con tu key real
  private isInitialized = false;

  async initialize() {
    try {
      // Solo inicializar si EmailJS está disponible
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        (window as any).emailjs.init(this.publicKey);
        this.isInitialized = true;
        console.log('✅ EmailJS inicializado correctamente');
      }
    } catch (error) {
      console.log('⚠️ EmailJS no disponible, continuando sin emails');
    }
  }

  async sendWelcomeEmail(data: EmailData): Promise<boolean> {
    if (!this.isInitialized) {
      console.log('📧 Email no enviado - servicio no inicializado');
      return false;
    }

    try {
      const templateParams = {
        to_email: data.userEmail,
        to_name: data.userName,
        company: data.userCompany || 'No especificada',
        conversation: data.conversationSummary,
        timestamp: data.timestamp,
        from_name: 'Equipo ArkoData',
        reply_to: 'contacto@arkodata.cl'
      };

      await (window as any).emailjs.send(
        this.serviceId,
        'template_welcome',
        templateParams
      );

      console.log('✅ Email de bienvenida enviado a:', data.userEmail);
      return true;
    } catch (error) {
      console.log('⚠️ Error enviando email de bienvenida:', error);
      return false;
    }
  }

  async notifyTeam(data: LeadData): Promise<boolean> {
    if (!this.isInitialized) {
      console.log('📧 Notificación no enviada - servicio no inicializado');
      return false;
    }

    try {
      const templateParams = {
        lead_email: data.email,
        lead_name: data.name,
        lead_company: data.company || 'No especificada',
        lead_phone: data.phone || 'No proporcionado',
        lead_interest: data.interest,
        lead_source: data.source,
        timestamp: new Date().toLocaleString('es-CL'),
        to_email: 'comercial@arkodata.cl' // Email del equipo
      };

      await (window as any).emailjs.send(
        this.serviceId,
        'template_team_notification',
        templateParams
      );

      console.log('✅ Equipo notificado sobre nuevo lead:', data.email);
      return true;
    } catch (error) {
      console.log('⚠️ Error notificando al equipo:', error);
      return false;
    }
  }

  // Almacenar leads localmente como backup
  saveLeadLocally(data: LeadData) {
    try {
      const leads = JSON.parse(localStorage.getItem('arkodata_leads') || '[]');
      leads.push({
        ...data,
        capturedAt: new Date().toISOString(),
        id: Date.now().toString()
      });
      localStorage.setItem('arkodata_leads', JSON.stringify(leads));
      console.log('✅ Lead guardado localmente');
    } catch (error) {
      console.log('⚠️ Error guardando lead localmente:', error);
    }
  }

  // Obtener leads guardados
  getStoredLeads(): LeadData[] {
    try {
      return JSON.parse(localStorage.getItem('arkodata_leads') || '[]');
    } catch {
      return [];
    }
  }
}

export const emailService = new EmailService();
export type { EmailData, LeadData };