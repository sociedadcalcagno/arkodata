export const aiAppliedCourse = {
  slug: 'inteligencia-artificial',
  title: 'Inteligencia Artificial aplicada al negocio',
  description: 'Aprende a seleccionar una tarea real, diseñar una solución asistida por IA y evaluarla con ejemplos, controles humanos y medidas observables.',
  category: 'IA y automatización',
  level: 'beginner',
  estimatedMinutes: 240,
  modules: [
    {
      title: 'Clase abierta — Detectar una oportunidad real',
      description: 'Muestra gratuita con actividad y evaluación automática.',
      isRequired: false,
      lessons: [
        {
          title: 'Encuentra una tarea donde la IA pueda ayudar de verdad',
          description: 'Una guía práctica para convertir una molestia operativa en una oportunidad acotada y comprobable.',
          isFreePreview: true,
          content: `## Objetivo

Al terminar podrás describir una tarea concreta, identificar qué parte podría asistir una IA y señalar qué debe revisar una persona.

## 1. Empieza por el trabajo, no por la herramienta

Cuando una organización explora inteligencia artificial, es fácil comenzar preguntando qué herramienta comprar. Para diseñar algo útil, parte por otra pregunta: **¿qué tarea de una persona queremos mejorar y qué resultado debería cambiar?**

La IA no ordena por sí sola un proceso confuso. Primero observa qué inicia el trabajo, quién participa, qué información se consulta, qué decisión se toma y quién recibe el resultado. Busca tareas repetidas que impliquen leer, clasificar, resumir, comparar o redactar.

Un sistema generativo puede entregar una propuesta útil, pero una respuesta convincente no es necesariamente un hecho verificado. Delimita su papel: puede preparar una categoría o resumen; el proceso define cómo validar, corregir o escalar esa salida.

## 2. Evalúa una oportunidad con cuatro preguntas

1. **¿La tarea está clara?** Puedes explicar su inicio, pasos y resultado.
2. **¿Se repite?** Mejorar una tarea frecuente puede ayudar muchas veces.
3. **¿Hay información suficiente y autorizada?** Debes poder probar la solución con ejemplos permitidos.
4. **¿Qué pasa si se equivoca?** Identifica excepciones y quién debe revisarlas.

Estas preguntas sirven para descubrir qué falta antes de probar; no son un puntaje automático de aprobación.

## 3. Escribe la oportunidad

Completa este enunciado:

> Queremos ayudar a **[persona o equipo]** a **[tarea]**, usando **[información autorizada]**, para mejorar **[resultado observable]**. La IA preparará **[propuesta]** y una persona revisará **[decisión o excepción]**.

### Ejemplo didáctico

Imagina un equipo que recibe solicitudes internas por correo. Una IA podría sugerir una categoría y preparar un resumen; una persona confirma la derivación. Este ejemplo es ficticio y no representa un resultado de ArkoData.

## Actividad — Tarjeta de oportunidad

Anota: tarea, usuario, pasos repetidos, datos permitidos, propuesta de IA, excepción humana y una medida que observarías en un piloto. No incluyas datos personales, clientes ni información confidencial.

## Evaluación

**1. ¿Qué conviene definir primero?** A) La herramienta. B) La tarea, sus usuarios y el resultado esperado. C) Automatizar todas las decisiones. **Correcta: B.**

**2. Una sugerencia de IA afecta una decisión sensible. ¿Qué diseño corresponde?** A) Aplicarla sin revisión. B) Validarla y escalar excepciones a una persona. C) Ocultar su origen. **Correcta: B.**

**3. ¿Qué ayuda a evaluar un piloto?** A) Una medida acordada antes de comenzar. B) La cantidad de prompts. C) Que el modelo responda con seguridad. **Correcta: A.**

Se aprueba esta muestra con **2 de 3** respuestas correctas.`,
        },
      ],
      assessment: {
        title: 'Comprobación — Clase abierta',
        passingPercent: 67,
        questions: [
          { prompt: '¿Qué conviene definir primero?', options: ['La herramienta', 'La tarea, sus usuarios y el resultado esperado', 'Automatizar todas las decisiones'], correctOption: 1, explanation: 'La oportunidad se define desde el trabajo que se quiere mejorar.' },
          { prompt: '¿Qué hacer si una sugerencia afecta una decisión sensible?', options: ['Aplicarla sin revisión', 'Validarla y escalar excepciones a una persona', 'Ocultar su origen'], correctOption: 1, explanation: 'El flujo debe indicar quién valida y cómo se gestionan excepciones.' },
          { prompt: '¿Qué permite evaluar el piloto?', options: ['Una medida acordada antes de comenzar', 'La cantidad de prompts', 'El tono seguro del modelo'], correctOption: 0, explanation: 'La medida debe definirse antes de observar resultados.' },
        ],
      },
    },
    {
      title: 'Módulo 1 — Fundamentos y selección del caso',
      description: 'Comprende las capacidades, límites y condiciones de un buen caso de uso.',
      isRequired: true,
      lessons: [
        {
          title: 'IA generativa: propuestas, evidencia y límites',
          description: 'Distingue generación de contenido de verificación de hechos.',
          isFreePreview: false,
          content: `Un modelo generativo produce una salida a partir de patrones y del contexto que recibe. Puede ser útil para transformar, resumir o clasificar información, pero la fluidez de una respuesta no prueba que sea correcta.

Separa tres momentos del proceso: **preparar** una propuesta, **comprobarla** contra fuentes y reglas autorizadas, y **decidir** si se acepta o se escala. La supervisión necesaria depende de las consecuencias del error, de la evidencia disponible y del uso previsto.

Una regla exacta y estable suele ser mejor como lógica convencional que como instrucción a un modelo. Reserva la IA para tareas donde interpretar lenguaje o producir una propuesta aporte valor, y conserva controles para los casos ambiguos.

**Práctica:** toma una salida posible de tu caso de uso. Escribe qué dato la confirma, qué error sería relevante y quién puede corregirla.`,
        },
        {
          title: 'Del problema amplio al caso acotado',
          description: 'Delimita usuarios, entradas, salida, impacto y revisión humana.',
          isFreePreview: false,
          content: `“Usar IA en atención” no define un proyecto. Un caso acotado identifica a la persona usuaria, la tarea, las entradas permitidas, la salida esperada, los límites y la decisión que mantiene una persona.

Usa esta plantilla:

> Para **[usuario]**, queremos asistir **[tarea]** mediante **[entrada autorizada]** y entregar **[salida verificable]**. El sistema no debe **[límite]**. **[rol humano]** revisa **[excepciones]**. Evaluaremos **[medida]**.

Antes de probar, reúne ejemplos representativos y define qué respuesta sería aceptable. Incluye casos comunes, incompletos y excepcionales. Si el equipo no puede acordar la respuesta esperada, primero aclara la regla de negocio.

**Práctica:** redacta una ficha y pide a otra persona que identifique los límites del sistema sin pedirte aclaraciones.`,
        },
      ],
      assessment: null,
    },
    {
      title: 'Módulo 2 — Instrucciones y resultados verificables',
      description: 'Diseña instrucciones claras, ejemplos y salidas consistentes.',
      isRequired: true,
      lessons: [
        {
          title: 'Estructura una instrucción de trabajo',
          description: 'Define propósito, tarea, contexto, límites, formato y revisión.',
          isFreePreview: false,
          content: `Una instrucción eficaz reduce decisiones implícitas. Incluye: propósito, acción delimitada, contexto permitido, límites, formato requerido y regla de revisión.

**Ejemplo de instrucción**

- Propósito: apoyar la clasificación de una solicitud.
- Tarea: elegir una categoría del catálogo proporcionado.
- Contexto: utilizar solo el texto recibido y las definiciones autorizadas.
- Límites: no inferir datos que no estén presentes.
- Salida: categoría y una frase que cite evidencia del mensaje.
- Escalamiento: si no hay evidencia suficiente, indicar “revisión humana”.

Prueba la instrucción con ejemplos distintos. Si dos personas discrepan sobre la respuesta correcta, corrige la definición o crea una ruta de excepción antes de ajustar el prompt.

**Práctica:** escribe una instrucción para el caso de tu proyecto y añade un ejemplo que deba escalarse.`,
        },
        {
          title: 'Ejemplos, formatos y validación',
          description: 'Usa ejemplos variados y valida la salida antes de integrarla.',
          isFreePreview: false,
          content: `Los ejemplos ilustran el patrón esperado. Incluye al menos un caso normal, uno ambiguo y uno fuera del alcance. No uses información personal real sin autorización; utiliza datos sintéticos o debidamente anonimizados.

Define un contrato de salida: campos, tipos, categorías válidas y comportamiento ante ausencia de evidencia. Después valida la respuesta en el software que la recibe. Que un modelo emita texto con apariencia de JSON no significa que cumpla el esquema.

**Práctica:** arma una tabla con entrada, salida esperada, salida real y corrección necesaria. Cambia una sola parte de la instrucción por vez para entender qué mejora o empeora.`,
        },
      ],
      assessment: null,
    },
    {
      title: 'Módulo 3 — Evaluación, datos y control humano',
      description: 'Mide calidad y define protecciones acordes al proceso.',
      isRequired: true,
      lessons: [
        {
          title: 'Evalúa con un conjunto de pruebas',
          description: 'Compara respuestas esperadas y observadas con medidas adecuadas.',
          isFreePreview: false,
          content: `Antes de probar, define una muestra de entradas y la respuesta aceptable para cada una. Elige medidas vinculadas a la tarea: correcciones requeridas, categorías correctas, casos escalados o tiempo de revisión.

Revisa también los errores por tipo. Un promedio puede ocultar una categoría que falla sistemáticamente. Vuelve a ejecutar los mismos casos después de cambiar una instrucción o configuración; así puedes comparar sin atribuir el cambio a factores distintos.

No existe una tasa universal de aprobación para todos los casos. Define umbrales con las personas responsables del proceso y detén el piloto si supera el nivel de riesgo aceptado.

**Práctica:** construye una muestra de casos ficticios o autorizados, registra errores y propón una condición de pausa.`,
        },
        {
          title: 'Privacidad, seguridad y revisión humana',
          description: 'Limita datos y diseña responsabilidades antes de integrar IA.',
          isFreePreview: false,
          content: `Envía solo la información necesaria y permitida para el propósito. Revisa políticas internas, configuración del proveedor, permisos, retención y obligaciones aplicables antes de usar datos personales, sensibles o confidenciales. Quitar un nombre no siempre anonimiza un registro.

Define qué rol puede acceder a la información, quién valida las excepciones y cómo corregir una respuesta errónea. Un control humano útil debe contar con contexto, tiempo y autoridad para aceptar, corregir o rechazar la propuesta.

NIST AI 600-1 recomienda considerar la gestión de riesgos durante el ciclo de vida de sistemas generativos. Es una guía voluntaria, no una certificación ni una garantía de seguridad.

**Práctica:** clasifica los datos de tu caso como permitidos, sujetos a autorización o excluidos; documenta qué ocurre si llega un dato excluido.`,
        },
      ],
      assessment: null,
    },
    {
      title: 'Módulo 4 — Piloto y aplicación',
      description: 'Planea una prueba acotada, comunica resultados y decide el siguiente paso.',
      isRequired: true,
      lessons: [
        {
          title: 'Diseña un piloto que se pueda detener',
          description: 'Establece alcance, responsables, medidas y controles.',
          isFreePreview: false,
          content: `Un piloto debe responder una pregunta concreta y poder pausarse con seguridad. Define alcance, responsables, participantes, entradas autorizadas, línea base, medidas, excepciones y canal de soporte.

Comunica qué hace el sistema y qué no hace. Compara el nuevo flujo con el actual en condiciones parecidas. Observa tanto la mejora deseada como posibles errores, retrabajo y carga de revisión. Un menor tiempo no es una mejora si el proceso genera más errores relevantes.

**Práctica:** completa un plan de una página con una medida inicial, una meta acordada por el equipo, una persona responsable y una condición de detención.`,
        },
        {
          title: 'Desafío final: presenta tu piloto',
          description: 'Integra caso, instrucción, pruebas, riesgos y evaluación.',
          isFreePreview: false,
          content: `Entrega una propuesta con: problema y usuario, tarea acotada, entradas permitidas, instrucción inicial, ejemplos de prueba, salida esperada, validación humana, medida inicial, riesgos y condición para pausar.

Evalúa tu entrega con esta rúbrica (0–2 puntos cada criterio):

1. El caso identifica usuario y tarea concretos.
2. La salida y los límites están especificados.
3. Hay ejemplos comunes y excepcionales.
4. La revisión humana corresponde al riesgo.
5. La evaluación tiene medidas observables y criterio de pausa.

Interpreta el resultado según los requisitos del curso: una puntuación baja indica qué sección debes reforzar, no que el caso esté listo para producción.`,
        },
      ],
      assessment: null,
    },
  ],
};
