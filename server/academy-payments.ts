const academyCatalog = [
  { slug: 'inteligencia-artificial', title: 'Inteligencia Artificial aplicada al negocio', priceKey: 'ACADEMY_PRICE_IA_CLP' },
  { slug: 'automatizacion-workflows', title: 'Automatización de procesos y workflows', priceKey: 'ACADEMY_PRICE_AUTOMATIZACION_CLP' },
  { slug: 'business-intelligence', title: 'Business Intelligence y dashboards', priceKey: 'ACADEMY_PRICE_BI_CLP' },
  { slug: 'bases-datos-sql', title: 'Bases de datos y SQL', priceKey: 'ACADEMY_PRICE_BASES_DATOS_CLP' },
  { slug: 'desarrollo-web-apis', title: 'Desarrollo web, APIs e integración', priceKey: 'ACADEMY_PRICE_DESARROLLO_WEB_CLP' },
  { slug: 'cloud-devops', title: 'Cloud y DevOps', priceKey: 'ACADEMY_PRICE_CLOUD_DEVOPS_CLP' },
  { slug: 'gestion-documental', title: 'Gestión documental inteligente', priceKey: 'ACADEMY_PRICE_GESTION_DOCUMENTAL_CLP' },
  { slug: 'tecnologia-salud', title: 'Tecnología aplicada a salud y operaciones', priceKey: 'ACADEMY_PRICE_SALUD_CLP' },
];

const paidLessons: Record<string, Array<{ title: string; content: string; exercise: string }>> = {
  'inteligencia-artificial': [
    { title: 'Diseño de casos de uso con IA', content: 'Prioriza oportunidades según valor esperado, frecuencia, disponibilidad de datos y costo de error. Un caso inicial debe tener un alcance acotado, una persona responsable y una métrica que permita comparar el antes y el después.', exercise: 'Escribe una tarea repetitiva de tu equipo y define cuánto demora hoy, cuántas veces ocurre y qué resultado debería mejorar.' },
    { title: 'Prototipos, evaluación y despliegue', content: 'Construye un prototipo sobre ejemplos representativos, define criterios de calidad y deriva a una persona los casos que no alcancen el umbral esperado. La revisión continua es parte del diseño, no una etapa opcional.', exercise: 'Define tres ejemplos correctos, tres excepciones y una condición para escalar la respuesta a una persona.' },
  ],
  'automatizacion-workflows': [
    { title: 'Mapeo de un proceso automatizable', content: 'Describe el inicio, los participantes, las decisiones, los traspasos y el resultado de cada paso. Marca esperas, doble digitación, reprocesos y excepciones antes de decidir qué automatizar.', exercise: 'Dibuja cinco pasos de un proceso y señala dónde se acumula una espera o se repite trabajo.' },
    { title: 'Reglas, excepciones y monitoreo', content: 'Un workflow confiable modela estados claros, responsables, tiempos esperados y rutas para resolver excepciones. Los indicadores de ciclo, cumplimiento y retrabajo muestran si la automatización está generando valor.', exercise: 'Define un estado inicial, uno final, una regla de aprobación y una alerta de atraso para tu proceso.' },
  ],
  'business-intelligence': [
    { title: 'Modelado de métricas de negocio', content: 'Parte por la decisión que se necesita tomar. Define cada indicador con nombre, propósito, fórmula, unidad, periodicidad y fuente. Asegura que todas las personas interpreten la métrica de la misma manera.', exercise: 'Elige una decisión recurrente y redacta el nombre, la fórmula y la frecuencia de revisión de su indicador principal.' },
    { title: 'Dashboards orientados a decisiones', content: 'Organiza el tablero desde el resumen hasta el detalle: tendencia, comparación con meta y segmentos que expliquen el resultado. Evita mostrar métricas sin una acción posible asociada.', exercise: 'Boceta una vista con una métrica principal, una tendencia temporal y un filtro útil para el equipo.' },
  ],
  'bases-datos-sql': [
    { title: 'Consultas SQL para análisis', content: 'SELECT define las columnas que necesitas y FROM la tabla de origen. WHERE limita los registros; GROUP BY permite resumirlos por categoría. Mantén las consultas enfocadas en una pregunta concreta y revisa los resultados con ejemplos conocidos.', exercise: 'Escribe en palabras una consulta que cuente operaciones por estado y filtre las creadas durante el último mes.' },
    { title: 'Relaciones, integridad y calidad', content: 'Las claves relacionan entidades sin duplicar información. Antes de combinar tablas, identifica la cardinalidad y comprueba que el resultado conserva el número de filas esperado. Las restricciones ayudan a evitar registros incompletos o incoherentes.', exercise: 'Identifica dos entidades de un proceso y describe qué campo las relaciona y qué datos deberían ser únicos.' },
  ],
  'desarrollo-web-apis': [
    { title: 'Cómo se integra una API', content: 'Una API expone operaciones con contratos definidos: método, ruta, datos de entrada y respuesta. Una integración robusta valida la entrada, controla errores y protege credenciales en el servidor.', exercise: 'Describe qué datos enviarías para consultar el estado de una orden y qué respuesta necesita mostrar el usuario.' },
    { title: 'Diseño de una aplicación conectada', content: 'Separa la experiencia de usuario, la lógica de negocio y la persistencia. Define estados de carga, éxito y error, y registra las operaciones relevantes para poder dar soporte y mejorar el producto.', exercise: 'Dibuja el recorrido de una acción desde el botón en pantalla hasta el dato guardado y su confirmación.' },
  ],
  'cloud-devops': [
    { title: 'Fundamentos para desplegar en la nube', content: 'Elige servicios según disponibilidad, seguridad, costo y necesidades operacionales. Configura secretos fuera del código, separa ambientes y define cómo recuperar el servicio ante una falla.', exercise: 'Haz una lista de tres datos sensibles que nunca deberían quedar escritos en el repositorio.' },
    { title: 'Despliegue y monitoreo', content: 'Un despliegue repetible automatiza construcción y publicación. Registra métricas, errores y disponibilidad; usa alertas accionables y prepara un procedimiento de reversión para cambios fallidos.', exercise: 'Define una señal que indique que tu aplicación está sana y una condición que debería activar una alerta.' },
  ],
  'gestion-documental': [
    { title: 'Diseño de un flujo documental', content: 'Modela el ciclo de vida del documento: recepción, extracción de datos, validación, resolución de excepciones, aprobación y archivo. Cada etapa necesita criterios claros y trazabilidad.', exercise: 'Toma un documento frecuente y enumera los datos que se revisan y las causas habituales de rechazo.' },
    { title: 'Validación y gestión de excepciones', content: 'La extracción automática debe contrastarse con reglas de negocio y niveles de confianza. Los casos dudosos se derivan a revisión, y las correcciones alimentan métricas para mejorar el proceso.', exercise: 'Define una regla de validación automática y un caso que deba revisarse por una persona.' },
  ],
  'tecnologia-salud': [
    { title: 'Mapeo de procesos de salud', content: 'Los procesos del sector suelen involucrar múltiples actores, datos sensibles, reglas y puntos de control. Identifica responsables, traspasos y decisiones sin perder de vista la privacidad y la continuidad de atención.', exercise: 'Dibuja el recorrido de una solicitud y marca qué actor la recibe, quién la valida y dónde queda registrada.' },
    { title: 'Control operacional y trazabilidad', content: 'Un buen sistema permite conocer estado, responsable, fecha y evidencia de cada etapa. Las alertas deben apoyar la gestión y las reglas deben poder revisarse cuando cambian los requerimientos.', exercise: 'Define tres estados de seguimiento y qué evidencia demuestra que cada uno fue completado.' },
  ],
};

export class AcademyPaymentError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
    this.name = 'AcademyPaymentError';
  }
}

function getPrice(course: typeof academyCatalog[number]) {
  const price = Number(process.env[course.priceKey]);
  return Number.isSafeInteger(price) && price > 0 ? price : null;
}

function getSiteUrl() {
  const configuredUrl = process.env.ACADEMY_PUBLIC_URL || process.env.PUBLIC_SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:5000';
  throw new AcademyPaymentError('La URL pública de Academia no está configurada.', 503);
}

function getAccessToken() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new AcademyPaymentError('El medio de pago aún no está configurado.', 503);
  return accessToken;
}

export function getAcademyCatalog() {
  return academyCatalog.map(({ slug, title, priceKey }) => ({
    slug,
    title,
    priceCLP: getPrice({ slug, title, priceKey }),
  }));
}

export async function createAcademyCheckout(courseSlug: string, buyerEmail: string) {
  const course = academyCatalog.find((item) => item.slug === courseSlug);
  if (!course) throw new AcademyPaymentError('El curso solicitado no existe.', 404);
  const email = buyerEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AcademyPaymentError('Ingresa un correo electrónico válido.', 400);
  const price = getPrice(course);
  if (!price) throw new AcademyPaymentError('El precio de este curso aún no está configurado.', 503);

  const siteUrl = getSiteUrl();
  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ id: course.slug, title: course.title, quantity: 1, currency_id: 'CLP', unit_price: price }],
      payer: { email },
      external_reference: `academy:${course.slug}:${email}`,
      metadata: { academy_course: course.slug, academy_email: email },
      back_urls: {
        success: `${siteUrl}/academia/aula/${course.slug}`,
        failure: `${siteUrl}/academia/aula/${course.slug}`,
        pending: `${siteUrl}/academia/aula/${course.slug}`,
      },
      auto_return: 'approved',
    }),
  });

  if (!response.ok) {
    console.error('Mercado Pago preference error:', response.status, await response.text());
    throw new AcademyPaymentError('No se pudo iniciar el pago. Inténtalo nuevamente.', 502);
  }

  const preference = await response.json() as { init_point?: string; sandbox_init_point?: string };
  const checkoutUrl = preference.init_point || preference.sandbox_init_point;
  if (!checkoutUrl) throw new AcademyPaymentError('Mercado Pago no devolvió el enlace de pago.', 502);
  return { checkoutUrl, priceCLP: price };
}

export async function getPaidAcademyContent(courseSlug: string, paymentId: string) {
  const course = academyCatalog.find((item) => item.slug === courseSlug);
  if (!course) throw new AcademyPaymentError('El curso solicitado no existe.', 404);
  if (!/^\d{6,30}$/.test(paymentId)) throw new AcademyPaymentError('Identificador de pago inválido.', 400);
  const price = getPrice(course);
  if (!price) throw new AcademyPaymentError('El precio de este curso aún no está configurado.', 503);

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!response.ok) {
    console.error('Mercado Pago payment lookup error:', response.status, await response.text());
    throw new AcademyPaymentError('No se pudo verificar el pago todavía.', 502);
  }

  const payment = await response.json() as {
    status?: string;
    transaction_amount?: number;
    currency_id?: string;
    metadata?: { academy_course?: string; academy_email?: string };
    external_reference?: string;
  };
  if (
    payment.status !== 'approved' ||
    payment.transaction_amount !== price ||
    payment.currency_id !== 'CLP' ||
    payment.metadata?.academy_course !== course.slug ||
    !payment.metadata.academy_email ||
    payment.external_reference !== `academy:${course.slug}:${payment.metadata.academy_email}`
  ) {
    throw new AcademyPaymentError('El pago aún no está aprobado para este curso.', 403);
  }

  const lessons = paidLessons[course.slug];
  if (!lessons) throw new AcademyPaymentError('El contenido del curso no está disponible.', 404);
  return { course: course.slug, lessons };
}
