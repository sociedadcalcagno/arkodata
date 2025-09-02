// Usamos fetch nativo de Node.js 18+

if (!process.env.BREVO_API_KEY) {
  console.warn('BREVO_API_KEY no configurada - emails deshabilitados');
}

interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) {
    console.warn('Email no enviado: BREVO_API_KEY no configurada');
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: 'ArkoData',
          email: 'contacto@arkodata.cl'
        },
        to: [{
          email: params.to,
          name: params.toName || ''
        }],
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent || params.htmlContent.replace(/<[^>]*>/g, '')
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error enviando email con Brevo:', response.status, errorData);
      return false;
    }

    console.log('Email enviado exitosamente via Brevo');
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
}

export function generateConfirmationEmail(name: string, company: string): { subject: string; htmlContent: string } {
  return {
    subject: '¡Gracias por contactar a ArkoData! Te responderemos pronto',
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #003366, #0077CC); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f8f9fa; }
          .footer { background: #003366; color: white; padding: 20px; text-align: center; font-size: 14px; }
          .logo { font-size: 28px; font-weight: bold; }
          .highlight { color: #0077CC; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🤖 ArkoData</div>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Soluciones Tecnológicas</p>
          </div>
          
          <div class="content">
            <h2 style="color: #003366; margin-top: 0;">¡Hola ${name}!</h2>
            
            <p>Gracias por contactar a <span class="highlight">ArkoData</span>. Hemos recibido tu mensaje y nos pondremos en contacto contigo <strong>a la brevedad</strong>.</p>
            
            ${company !== 'No especificada' ? `<p>Nos complace saber de <span class="highlight">${company}</span> y estamos emocionados de poder ayudarlos con sus necesidades tecnológicas.</p>` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0077CC; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #003366;">¿Qué sigue?</h3>
              <ul style="color: #555;">
                <li>Revisaremos tu consulta en detalle</li>
                <li>Te contactaremos en las próximas <strong>24 horas</strong></li>
                <li>Programaremos una reunión para entender mejor tus necesidades</li>
                <li>Te presentaremos una propuesta personalizada</li>
              </ul>
            </div>
            
            <p>Mientras tanto, puedes conocer más sobre nuestros servicios en nuestro sitio web o chatear con <strong>ArkoAsistente</strong>, nuestro asistente de IA.</p>
            
            <p style="margin-bottom: 0;">Saludos cordiales,<br>
            <span class="highlight">El equipo de ArkoData</span></p>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">ArkoData - Transformamos tu Negocio Digital</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Este es un email automático, por favor no respondas a esta dirección.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}

export function generateNotificationEmail(leadData: any): { subject: string; htmlContent: string } {
  return {
    subject: `🚀 Nuevo Lead - ${leadData.name} de ${leadData.company}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: #ff6b35; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8f9fa; }
          .data-row { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 3px solid #0077CC; }
          .label { font-weight: bold; color: #003366; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">¡Nuevo contacto en ArkoData! 🎉</h2>
          </div>
          
          <div class="content">
            <div class="data-row">
              <span class="label">Nombre:</span> ${leadData.name}
            </div>
            <div class="data-row">
              <span class="label">Email:</span> ${leadData.email}
            </div>
            <div class="data-row">
              <span class="label">Teléfono:</span> ${leadData.phone}
            </div>
            <div class="data-row">
              <span class="label">Empresa:</span> ${leadData.company}
            </div>
            <div class="data-row">
              <span class="label">Mensaje:</span><br>${leadData.interest}
            </div>
            <div class="data-row">
              <span class="label">Fuente:</span> ${leadData.source}
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              Accede al dashboard administrativo para ver todos los leads: <br>
              <strong>/arko-admin-secure-dashboard-2024</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
}