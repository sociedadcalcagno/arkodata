import { ARKO_HELP_DOCS } from '../../shared/arko-help';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

type OperationalFacts = {
  process?: string;
  volume?: number;
  minutes?: number;
  hourlyCost?: number;
  people?: number;
};

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

function parseNumber(value: string) {
  const cleaned = value.replace(/\./g, '').replace(/,/g, '.');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function extractFacts(text: string): OperationalFacts {
  const normalized = normalize(text);
  const facts: OperationalFacts = {};

  if (/(contabilidad|contable|factura|facturas|conciliacion|conciliación|pago|pagos|cartola|cartolas|honorario|honorarios|finanza|finanzas)/i.test(normalized)) {
    facts.process = 'contabilidad y finanzas';
  } else if (/(documento|documental|ocr|validacion|validaciones|contrato|contratos)/i.test(normalized)) {
    facts.process = 'gestion documental';
  } else if (/(venta|ventas|lead|leads|comercial|cliente|clientes|seguimiento)/i.test(normalized)) {
    facts.process = 'ventas y seguimiento comercial';
  } else if (/(soporte|atencion|mesa de ayuda|preguntas|consultas)/i.test(normalized)) {
    facts.process = 'atencion interna o soporte';
  }

  const volumePatterns = [
    /(?:procesamos|revisamos|tenemos|son|manejam(?:os)?|volumen(?: de)?|casos(?: al mes)?|documentos(?: al mes)?|facturas(?: al mes)?)\D{0,24}(\d[\d.,]*)/i,
    /(\d[\d.,]*)\s*(?:casos|documentos|facturas|movimientos|pagos|cartolas)(?:\s+al\s+mes|\s+mensuales)?/i,
  ];
  for (const pattern of volumePatterns) {
    const match = text.match(pattern);
    const value = match?.[1] ? parseNumber(match[1]) : undefined;
    if (value) {
      facts.volume = value;
      break;
    }
  }

  const minutePatterns = [
    /(\d[\d.,]*)\s*(?:min|mins|minutos)(?:\s+por\s+(?:caso|documento|factura|movimiento))?/i,
    /(?:toma|demora|tardan|demoran|tiempo)\D{0,24}(\d[\d.,]*)\s*(?:min|mins|minutos)/i,
  ];
  for (const pattern of minutePatterns) {
    const match = text.match(pattern);
    const value = match?.[1] ? parseNumber(match[1]) : undefined;
    if (value) {
      facts.minutes = value;
      break;
    }
  }

  const costPatterns = [
    /(?:costo hora|hora cuesta|valor hora|costo por hora)\D{0,20}\$?\s*(\d[\d.,]*)/i,
    /\$\s*(\d[\d.,]*)\s*(?:por hora|\/h|hora)/i,
  ];
  for (const pattern of costPatterns) {
    const match = text.match(pattern);
    const value = match?.[1] ? parseNumber(match[1]) : undefined;
    if (value) {
      facts.hourlyCost = value;
      break;
    }
  }

  const peopleMatch = text.match(/(\d[\d.,]*)\s*(?:personas|analistas|ejecutivos|trabajadores|usuarios)/i);
  const people = peopleMatch?.[1] ? parseNumber(peopleMatch[1]) : undefined;
  if (people) facts.people = people;

  return facts;
}

function mergeFacts(...items: OperationalFacts[]) {
  return items.reduce<OperationalFacts>((acc, item) => ({ ...acc, ...Object.fromEntries(Object.entries(item).filter(([, value]) => value !== undefined)) }), {});
}

function formatCurrency(value: number) {
  return `$${new Intl.NumberFormat('es-CL').format(Math.round(value))}`;
}

function buildOperationalAnswer(facts: OperationalFacts) {
  if (!facts.process) return null;

  const automationRate = facts.process.includes('contabilidad') ? 0.62 : facts.process.includes('documental') ? 0.7 : 0.55;
  const lines = [
    `Perfecto. Si hablamos de ${facts.process}, esto ya es un caso bien aterrizable para ArkoData.`,
    '',
    'Oportunidad detectada:',
  ];

  if (facts.process.includes('contabilidad')) {
    lines.push(
      '- lectura y clasificacion de facturas, respaldos, cartolas y pagos',
      '- conciliacion contra reglas contables o financieras',
      '- deteccion de inconsistencias, pendientes y excepciones',
      '- trazabilidad para saber quien aprobo, que falta y donde esta el cuello de botella',
      '',
      'Que implementaria ArkoData:',
      '- OCR/document intelligence para extraer datos de documentos',
      '- motor de reglas para validar montos, proveedores, fechas y estados',
      '- flujo de aprobacion y excepciones',
      '- dashboard financiero para control ejecutivo'
    );
  } else {
    lines.push(
      '- automatizar tareas repetitivas',
      '- reducir errores manuales',
      '- conectar datos, documentos y responsables',
      '- dejar trazabilidad completa del proceso',
      '',
      'Que implementaria ArkoData:',
      '- agente IA o automatizacion de workflow',
      '- reglas de negocio',
      '- integraciones con sistemas existentes',
      '- dashboard operacional'
    );
  }

  if (facts.volume && facts.minutes) {
    const hourlyCost = facts.hourlyCost || 9500;
    const monthlyHours = (facts.volume * facts.minutes) / 60;
    const recoveredHours = monthlyHours * automationRate;
    const monthlySavings = recoveredHours * hourlyCost;
    lines.push(
      '',
      'Estimacion referencial con los datos entregados:',
      `- Volumen mensual: ${new Intl.NumberFormat('es-CL').format(facts.volume)} casos/documentos`,
      `- Tiempo actual: ${facts.minutes} min por caso`,
      `- Horas operativas actuales: ${Math.round(monthlyHours)} h/mes`,
      `- Potencial automatizable estimado: ${Math.round(automationRate * 100)}%`,
      `- Horas recuperables: ${Math.round(recoveredHours)} h/mes`,
      `- Ahorro mensual referencial: ${formatCurrency(monthlySavings)}${facts.hourlyCost ? '' : ' usando costo hora referencial de $9.500'}`,
      `- Ahorro anual referencial: ${formatCurrency(monthlySavings * 12)}`,
      '',
      'Siguiente paso recomendado:',
      'Tomar una muestra de 20 a 50 casos reales, clasificar tipos de documento/excepcion y armar un piloto medible de 2 a 4 semanas.'
    );
  } else {
    const missing = [];
    if (!facts.volume) missing.push('cuantos casos/documentos procesan al mes');
    if (!facts.minutes) missing.push('cuantos minutos toma cada caso');
    if (!facts.hourlyCost) missing.push('costo hora aproximado del equipo, si lo tienes');

    lines.push(
      '',
      'Para convertir esto en ROI, no necesito mas teoria. Solo faltan estos datos:',
      ...missing.map((item) => `- ${item}`),
      '',
      'Con eso te devuelvo una estimacion mensual/anual y una propuesta de piloto.'
    );
  }

  return lines.join('\n');
}

function fallback(message: string, facts: OperationalFacts = {}) {
  const operationalAnswer = buildOperationalAnswer(facts);
  if (operationalAnswer) return operationalAnswer;

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

  if (/(contabilidad|contable|factura|facturas|conciliacion|conciliación|pago|pagos|cartola|cartolas|honorario|honorarios|finanza|finanzas)/i.test(normalized)) {
    return [
      'Buen caso. En contabilidad normalmente hay varias oportunidades de automatizacion con IA y reglas de negocio.',
      '',
      'Oportunidad detectada:',
      '- lectura y clasificacion de facturas, boletas, respaldos y cartolas',
      '- conciliacion de pagos y documentos',
      '- validacion de montos, fechas, proveedores y estados',
      '- alertas por inconsistencias o documentos faltantes',
      '',
      'Que automatizaria ArkoData:',
      '- OCR/document intelligence',
      '- motor de reglas contables',
      '- flujo de aprobacion y excepciones',
      '- dashboard de trazabilidad financiera',
      '',
      'Para estimar ahorro dime 3 datos:',
      '1. Cuantos documentos o movimientos revisan al mes.',
      '2. Cuantos minutos toma revisar cada uno.',
      '3. Cuantas personas participan en el proceso.'
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

async function askOpenAI(message: string, history: ChatMsg[], facts: OperationalFacts) {
  if (!process.env.OPENAI_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  const historyText = history
    .slice(-10)
    .map((entry) => `${entry.role === 'assistant' ? 'Asistente' : 'Usuario'}: ${entry.content}`)
    .join('\n');

  const factsText = [
    facts.process ? `Proceso detectado: ${facts.process}` : '',
    facts.volume ? `Volumen mensual detectado: ${facts.volume}` : '',
    facts.minutes ? `Minutos por caso detectados: ${facts.minutes}` : '',
    facts.hourlyCost ? `Costo hora detectado: ${facts.hourlyCost}` : '',
    facts.people ? `Personas involucradas detectadas: ${facts.people}` : '',
  ].filter(Boolean).join('\n');

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
    'Nunca vuelvas a pedir un dato que ya aparece en los datos detectados o en la conversacion previa.',
    'Si ya tienes proceso + volumen + minutos, calcula horas actuales, horas recuperables y ahorro referencial. Si falta costo hora, usa $9.500 CLP como referencia y dilo.',
    `Contexto:\n${buildContext()}`,
    factsText ? `Datos operacionales detectados:\n${factsText}` : '',
    historyText ? `Conversacion previa:\n${historyText}` : '',
    `Pregunta:\n${message}`,
  ].filter(Boolean).join('\n\n');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
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
  } catch (error) {
    console.error('OpenAI request failed or timed out:', error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
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

    const historyText = history.map((entry) => entry.content).join('\n');
    const facts = mergeFacts(extractFacts(historyText), extractFacts(message));
    const deterministicAnswer = buildOperationalAnswer(facts);
    const response = deterministicAnswer || (await askOpenAI(message, history, facts)) || fallback(message, facts);
    return json(200, { response });
  } catch (error) {
    console.error('Error en chat function:', error);
    return json(200, { response: fallback('') });
  }
}
