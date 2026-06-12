type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest?: string;
  source?: string;
};

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '');
}

async function sendEmail(params: { to: string; toName?: string; subject: string; htmlContent: string }) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY no configurada en Netlify');
    return false;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'ArkoData', email: 'contacto@arkodata.cl' },
      to: [{ email: params.to, name: params.toName || '' }],
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: stripHtml(params.htmlContent),
    }),
  });

  if (!response.ok) {
    console.error('Brevo error:', response.status, await response.text());
    return false;
  }

  return true;
}

function confirmationEmail(name: string, company: string) {
  return {
    subject: 'Gracias por contactar a ArkoData',
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;background:#f8fafc;color:#0f172a">
        <div style="background:linear-gradient(135deg,#041a36,#0a5cab);color:white;padding:28px;border-radius:18px 18px 0 0">
          <h1 style="margin:0">ArkoData</h1>
          <p style="margin:8px 0 0">IA aplicada a procesos empresariales criticos</p>
        </div>
        <div style="padding:28px;background:white;border:1px solid #e2e8f0;border-top:0">
          <h2 style="color:#041a36;margin-top:0">Hola ${name}</h2>
          <p>Recibimos tu solicitud de diagnostico${company ? ` para <strong>${company}</strong>` : ''}.</p>
          <p>Vamos a revisar tu operacion y te contactaremos para identificar oportunidades de automatizacion, IA e integracion.</p>
          <p style="margin-bottom:0">Equipo ArkoData</p>
        </div>
      </div>
    `,
  };
}

function notificationEmail(lead: Required<LeadPayload>) {
  return {
    subject: `Nuevo diagnostico solicitado - ${lead.name}`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto">
        <h2>Nuevo contacto en ArkoData</h2>
        <p><strong>Nombre:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Telefono:</strong> ${lead.phone}</p>
        <p><strong>Empresa:</strong> ${lead.company}</p>
        <p><strong>Mensaje:</strong><br>${lead.interest}</p>
        <p><strong>Fuente:</strong> ${lead.source}</p>
      </div>
    `,
  };
}

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return json(405, { message: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}') as LeadPayload;
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const interest = String(body.interest || '').trim();

    if (!name || !email || !interest) {
      return json(400, { message: 'Nombre, email y mensaje son requeridos' });
    }

    const lead = {
      id: Date.now(),
      name,
      email,
      phone: String(body.phone || 'No proporcionado').trim(),
      company: String(body.company || 'No especificada').trim(),
      interest,
      source: String(body.source || 'Formulario web').trim(),
      createdAt: new Date().toISOString(),
    };

    const confirmation = confirmationEmail(lead.name, lead.company);
    const notification = notificationEmail(lead);

    const confirmationSent = await sendEmail({
      to: lead.email,
      toName: lead.name,
      subject: confirmation.subject,
      htmlContent: confirmation.htmlContent,
    });

    const notificationSent = await sendEmail({
      to: 'contacto@arkodata.cl',
      toName: 'Equipo ArkoData',
      subject: notification.subject,
      htmlContent: notification.htmlContent,
    });

    return json(200, { ...lead, emailStatus: { confirmationSent, notificationSent } });
  } catch (error) {
    console.error('Error en leads function:', error);
    return json(500, { message: 'Internal server error' });
  }
}
