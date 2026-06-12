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
    return 'Hola, soy ArkoAsistente. Puedo ayudarte a identificar procesos automatizables, oportunidades de IA, integraciones y mejoras operacionales. Cuentame que proceso quieres optimizar.';
  }

  if (/(precio|costo|ahorro|roi|rentabil|economia)/i.test(normalized)) {
    return 'Podemos estimar impacto revisando volumen mensual, tiempo por caso, costo hora del equipo y nivel de automatizacion posible. Si me das esos datos, te ayudo a ordenar una estimacion inicial.';
  }

  if (/(contacto|diagnostico|reunion|correo|whatsapp)/i.test(normalized)) {
    return 'Puedes solicitar un diagnostico en el formulario o escribir a contacto@arkodata.cl. Tambien podemos orientar desde aqui si me cuentas tu empresa, proceso y principal dolor operacional.';
  }

  return 'ArkoData ayuda a convertir procesos criticos en operaciones inteligentes con IA, automatizacion, OCR, integraciones, dashboards y agentes inteligentes. Cuentame que proceso quieres mejorar y te propongo un camino concreto.';
}

async function askOpenAI(message: string, history: ChatMsg[]) {
  if (!process.env.OPENAI_API_KEY) return null;

  const historyText = history
    .slice(-10)
    .map((entry) => `${entry.role === 'assistant' ? 'Asistente' : 'Usuario'}: ${entry.content}`)
    .join('\n');

  const prompt = [
    'Eres ArkoAsistente, asistente comercial y tecnico de ArkoData.',
    'Respondes en espanol chileno, claro, ejecutivo y orientado a negocio.',
    'No inventes precios cerrados ni capacidades no confirmadas.',
    'Tu objetivo es ayudar a detectar procesos automatizables y orientar hacia un diagnostico.',
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
