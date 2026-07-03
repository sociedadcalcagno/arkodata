import { ARKO_HELP_DOCS } from '../../shared/arko-help';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function normalize(value: unknown) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function buildContext() {
  return ARKO_HELP_DOCS
    .map((doc) => `# ${doc.title}\n${doc.summary}\n${doc.sections.map((section) => `- ${section.heading}: ${section.body}`).join('\n')}`)
    .join('\n\n');
}

function fallback(message: string) {
  const normalized = normalize(message);

  if (/(hola|buenas|buenos dias|buen dia)/i.test(normalized)) {
    return [
      'Hola, soy ArkoAsistente. Te puedo ayudar a detectar oportunidades reales de automatizacion con IA.',
      '',
      'Para partir rapido, dime cual de estos procesos quieres revisar:',
      '- documentos, validaciones u OCR',
      '- pagos, conciliacion o cartolas',
      '- atencion interna o soporte',
      '- ventas, leads o seguimiento comercial',
      '- reportes, dashboards o control operacional',
      '',
      'Si me das volumen mensual, tiempo por caso y costo aproximado del equipo, puedo ayudarte a estimar ahorro.'
    ].join('\n');
  }

  if (/(precio|costo|ahorro|roi|rentabil|economia)/i.test(normalized)) {
    return [
      'Perfecto. Para estimar economia operacional necesito 3 datos:',
      '',
      '1. Cuantos casos procesan al mes.',
      '2. Cuantos minutos toma cada caso hoy.',
      '3. Costo hora aproximado del equipo que lo ejecuta.',
      '',
      'Con eso puedo proyectar horas recuperadas, ahorro mensual y que parte conviene automatizar primero.'
    ].join('\n');
  }

  if (/(contacto|diagnostico|reunion|correo|whatsapp)/i.test(normalized)) {
    return 'Puedes solicitar un diagnostico en el formulario o escribir a contacto@arkodata.cl. Tambien podemos orientar desde aqui si me cuentas tu empresa, proceso y principal dolor operacional.';
  }

  return [
    'Te puedo orientar con una mirada practica.',
    '',
    'Cuéntame brevemente:',
    '- que proceso quieres mejorar',
    '- que dolor tienen hoy',
    '- cuanto volumen manejan al mes',
    '',
    'Con eso te respondo con: oportunidad de IA, automatizacion posible, impacto esperado y siguiente paso recomendado.'
  ].join('\n');
}

async function askOpenAI(message: string, history: ChatMsg[]) {
  if (!process.env.OPENAI_API_KEY) return null;

  const historyText = history
    .slice(-10)
    .map((entry) => `${entry.role === 'assistant' ? 'Asistente' : 'Usuario'}: ${entry.content}`)
    .join('\n');

  const prompt = [
    'Eres ArkoAsistente, asistente comercial y tecnico de ArkoData.',
    'Respondes en espanol chileno neutro, claro, ejecutivo y orientado a negocio.',
    'No inventes precios cerrados ni capacidades no confirmadas.',
    'Tu objetivo es ayudar a detectar procesos automatizables, estimar impacto y orientar hacia un diagnostico.',
    'No respondas como folleto. Actua como consultor senior: pregunta, ordena, prioriza y propone siguiente accion.',
    'Si el usuario no da suficiente informacion, haz maximo 2 preguntas concretas.',
    'Si el usuario describe un proceso, responde con esta estructura breve:',
    '1. Oportunidad detectada',
    '2. Que automatizaria ArkoData',
    '3. Impacto esperado',
    '4. Datos que faltan para estimar ROI',
    '5. Siguiente paso recomendado',
    'Si el usuario da volumen, minutos o costos, usa esos datos para hacer una estimacion aproximada y declara que es referencial.',
    `Contexto:\n${buildContext()}`,
    historyText ? `Conversacion previa:\n${historyText}` : '',
    `Pregunta:\n${message}`,
  ].filter(Boolean).join('\n\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.45,
      max_tokens: 520,
    }),
  });

  if (!response.ok) {
    console.error('OpenAI error:', response.status, await response.text());
    return null;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return json(405, { message: 'Method not allowed' });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const message = String(body.message || '').trim();
    const history: ChatMsg[] = Array.isArray(body.history)
      ? body.history
          .map((entry: any) => ({ role: entry?.role === 'assistant' ? 'assistant' : 'user', content: String(entry?.content || '').trim() }))
          .filter((entry: ChatMsg) => entry.content)
      : [];

    if (!message) {
      return json(400, { message: 'Message is required' });
    }

    const response = (await askOpenAI(message, history)) || fallback(message);
    return json(200, { response });
  } catch (error) {
    console.error('Error en chat function:', error);
    return json(200, { response: fallback('') });
  }
}
