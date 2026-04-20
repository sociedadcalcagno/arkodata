export type ArkoHelpDoc = {
  id: string;
  title: string;
  summary: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
};

export const ARKO_HELP_DOCS: ArkoHelpDoc[] = [
  {
    id: 'servicios-principales',
    title: 'Servicios Principales de ArkoData',
    summary: 'Resumen comercial de las lineas principales de servicio.',
    sections: [
      {
        heading: 'Desarrollo web y aplicaciones a medida',
        body: 'ArkoData desarrolla sitios corporativos, landing pages, plataformas internas, dashboards y aplicaciones a medida. El foco esta en resolver procesos reales del negocio, mejorar la experiencia de usuario y dejar una base escalable.',
      },
      {
        heading: 'Inteligencia artificial y chatbots',
        body: 'ArkoData implementa asistentes virtuales, chatbots comerciales, automatizacion de respuestas, captura de leads y apoyo operativo con IA. El objetivo es mejorar la atencion, responder mas rapido y convertir mas oportunidades.',
      },
      {
        heading: 'Automatizacion de procesos',
        body: 'ArkoData automatiza tareas repetitivas, formularios, integraciones y flujos internos para reducir tiempos manuales y errores. Esto incluye procesos comerciales, operativos y administrativos.',
      },
      {
        heading: 'Ciberseguridad e infraestructura',
        body: 'ArkoData apoya en despliegues, contenedores, continuidad operacional, hardening, arquitectura y buenas practicas para que los sistemas sean mas seguros, estables y mantenibles.',
      },
      {
        heading: 'Consultoria tecnologica',
        body: 'ArkoData ayuda a diagnosticar necesidades, priorizar mejoras, ordenar iniciativas y proponer una ruta tecnologica realista de acuerdo con el negocio, el equipo y el presupuesto.',
      },
    ],
  },
  {
    id: 'forma-trabajo',
    title: 'Forma de trabajo y propuestas',
    summary: 'Como ArkoData orienta proyectos y cotizaciones.',
    sections: [
      {
        heading: 'Levantamiento y definicion',
        body: 'Para preparar una propuesta, normalmente se revisa el objetivo del proyecto, el problema actual, las funcionalidades esperadas, las integraciones necesarias y los plazos. Con eso se ordena una recomendacion concreta.',
      },
      {
        heading: 'Cotizacion y siguiente paso',
        body: 'Las cotizaciones se ajustan al alcance, complejidad y etapa del proyecto. Cuando el requerimiento aun esta abierto, ArkoData primero ayuda a aterrizarlo antes de proponer una solucion y una estimacion.',
      },
    ],
  },
  {
    id: 'contacto',
    title: 'Contacto comercial',
    summary: 'Canales de contacto de ArkoData.',
    sections: [
      {
        heading: 'Canales disponibles',
        body: 'Email: contacto@arkodata.cl. WhatsApp: +56 9 3355 3024. Horario de atencion: lunes a viernes de 9:00 a 18:00 y sabados de 10:00 a 14:00.',
      },
    ],
  },
];
