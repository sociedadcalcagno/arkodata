import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BarChart3, BrainCircuit, BriefcaseBusiness, CheckCircle2, CirclePause, CirclePlay, ClipboardCheck, Database, FileSearch, Mail, Mic2, ShieldCheck, UserRound, Volume2, VolumeX, Workflow } from 'lucide-react';

const slides = [
  {
    label: 'Bienvenida',
    title: 'Encuentra una oportunidad real para aplicar IA',
    subtitle: 'Un método práctico para pasar de “queremos usar IA” a una mejora concreta, medible y segura.',
    points: ['Duración aproximada: 8 minutos', 'Sin requisitos técnicos', 'Incluye una plantilla para tu primer piloto'],
    narration: 'Bienvenida y bienvenido. En este webinar breve vamos a encontrar una oportunidad real para aplicar inteligencia artificial en una organización. No partiremos por elegir una herramienta. Partiremos por un trabajo concreto, por las personas que lo hacen y por el resultado que queremos mejorar. Al final tendrás una ficha sencilla para evaluar una idea de piloto.',
  },
  {
    label: '01 · El punto de partida',
    title: 'No empieces por la herramienta',
    subtitle: 'Empieza por una tarea que hoy consuma tiempo, genere errores o produzca esperas.',
    points: ['¿Quién hace el trabajo?', '¿Qué información recibe y consulta?', '¿Qué resultado debe entregar?', '¿Dónde se atasca o se repite?'],
    narration: 'Cuando una empresa explora IA, es tentador empezar preguntando qué herramienta comprar. Para encontrar valor, conviene empezar con el trabajo. Observa quién realiza la tarea, qué información necesita, qué pasos sigue y qué resultado entrega. Busca fricciones observables: esperas, doble digitación, búsquedas manuales, errores de clasificación o tareas repetidas.',
  },
  {
    label: '02 · Encuentra candidatas',
    title: 'Busca tareas repetitivas con información disponible',
    subtitle: 'La IA suele ayudar a preparar una propuesta; las reglas y las personas siguen siendo parte del proceso.',
    points: ['Leer y clasificar solicitudes o documentos', 'Resumir información extensa', 'Extraer datos para una revisión', 'Preparar borradores de respuesta'],
    narration: 'Algunas tareas candidatas son leer y clasificar solicitudes, resumir información extensa, extraer datos para revisión o preparar borradores. Esto no significa que la IA deba decidir por sí sola. Una arquitectura práctica separa la preparación de una sugerencia, la comprobación contra reglas o fuentes autorizadas y la decisión final cuando corresponde.',
  },
  {
    label: '03 · Evalúa la oportunidad',
    title: 'Pasa la idea por cuatro preguntas',
    subtitle: 'Si no puedes responderlas todavía, ya encontraste qué necesitas investigar antes de construir.',
    points: ['Frecuencia: ¿cuántas veces ocurre?', 'Tiempo: ¿cuánto tarda cada caso?', 'Datos: ¿tenemos ejemplos permitidos y representativos?', 'Riesgo: ¿quién revisa errores y excepciones?'],
    narration: 'Evalúa la oportunidad con cuatro preguntas. Primero, frecuencia: cuántas veces ocurre. Segundo, tiempo: cuánto demora cada caso. Tercero, datos: si existen ejemplos representativos que se puedan usar de forma autorizada. Y cuarto, riesgo: qué podría salir mal y quién revisa las excepciones. No hace falta tener todas las respuestas hoy; sí hace falta saber cuáles faltan.',
  },
  {
    label: '04 · Ejemplo práctico',
    title: 'De correos desordenados a solicitudes priorizadas',
    subtitle: 'Ejemplo ficticio: un equipo recibe consultas por correo y necesita derivarlas a la persona correcta.',
    points: ['La IA sugiere una categoría y resume el motivo', 'Una regla valida campos obligatorios', 'El equipo confirma la derivación', 'Los casos dudosos van a una bandeja de revisión'],
    narration: 'Imagina un equipo que recibe solicitudes por correo. Hoy una persona abre cada mensaje, identifica el tema, busca datos faltantes y decide a quién derivarlo. Un piloto podría resumir el mensaje y sugerir una categoría. Una regla detectaría campos obligatorios faltantes. El equipo confirmaría la derivación y revisaría los casos dudosos. Es un ejemplo didáctico: los resultados reales se deben medir en cada organización.',
  },
  {
    label: '05 · Mide antes y después',
    title: 'Define una línea base antes del piloto',
    subtitle: 'Una prueba útil compara el proceso actual con el proceso asistido, usando casos equivalentes.',
    points: ['Minutos de trabajo por solicitud', 'Porcentaje de derivaciones corregidas', 'Tiempo hasta la primera respuesta', 'Casos que requieren revisión humana'],
    narration: 'Antes de probar, registra cómo funciona el proceso actual. Puedes medir minutos por solicitud, porcentaje de derivaciones corregidas, tiempo hasta la primera respuesta y cuántos casos requieren revisión humana. Compara casos equivalentes y acuerda de antemano qué mejora sería valiosa. No declares éxito solo porque una demostración se vea convincente.',
  },
  {
    label: '06 · Diseña un piloto seguro',
    title: 'Acota el alcance y conserva el control',
    subtitle: 'Empieza pequeño, usa información autorizada y deja claro cuándo interviene una persona.',
    points: ['Prueba con un conjunto reducido de casos', 'Excluye datos sensibles que no sean necesarios', 'Registra sugerencias, correcciones y excepciones', 'Detén o ajusta el piloto si aumenta el riesgo'],
    narration: 'Diseña el piloto con límites claros. Usa un conjunto pequeño de casos y solo información autorizada. Evita incluir datos sensibles que no sean necesarios. Registra las sugerencias, las correcciones y las excepciones. Define quién puede detener la prueba y qué condiciones obligan a cambiar el diseño. La supervisión no es un detalle posterior: es parte de la solución.',
  },
  {
    label: '07 · Tu siguiente paso',
    title: 'Completa esta ficha de oportunidad',
    subtitle: 'Una buena oportunidad se puede explicar en pocas líneas y tiene una medida verificable.',
    points: ['Persona o equipo + tarea concreta', 'Volumen mensual + tiempo actual', 'Información disponible y autorizada', 'Propuesta de IA + revisión humana', 'Indicador del piloto + responsable'],
    narration: 'Para cerrar, completa esta ficha: qué persona o equipo realiza qué tarea; cuántos casos procesa y cuánto tarda hoy; qué información autorizada existe; qué propuesta podría preparar la IA y qué revisará una persona; y qué indicador usarás en el piloto, con quién será responsable. Si puedes responder eso, ya tienes una conversación concreta para evaluar el siguiente paso. Gracias por participar en este webinar de ArkoData.',
  },
];

const slideArtworks = [
  { eyebrow: 'DE LA IDEA AL RESULTADO', outcome: 'Oportunidad concreta', nodes: [{ icon: BriefcaseBusiness, label: 'Trabajo' }, { icon: BrainCircuit, label: 'IA aplicada' }, { icon: BarChart3, label: 'Impacto' }] },
  { eyebrow: 'OBSERVA EL PROCESO', outcome: 'Encuentra la fricción', nodes: [{ icon: UserRound, label: 'Persona' }, { icon: Workflow, label: 'Tarea' }, { icon: CheckCircle2, label: 'Resultado' }] },
  { eyebrow: 'TAREAS CANDIDATAS', outcome: 'IA como asistente', nodes: [{ icon: FileSearch, label: 'Leer' }, { icon: BrainCircuit, label: 'Proponer' }, { icon: UserRound, label: 'Revisar' }] },
  { eyebrow: 'FILTRO DE OPORTUNIDAD', outcome: '4 preguntas antes de construir', nodes: [{ icon: BarChart3, label: 'Volumen' }, { icon: Database, label: 'Datos' }, { icon: ShieldCheck, label: 'Riesgo' }] },
  { eyebrow: 'EJEMPLO · CORREO A DERIVACIÓN', outcome: 'Una persona confirma los casos', nodes: [{ icon: Mail, label: 'Solicitud' }, { icon: BrainCircuit, label: 'Clasificación' }, { icon: UserRound, label: 'Equipo' }] },
  { eyebrow: 'MIDE EL CAMBIO', outcome: 'Compara antes y después', nodes: [{ icon: ClipboardCheck, label: 'Línea base' }, { icon: Workflow, label: 'Piloto' }, { icon: BarChart3, label: 'Indicador' }] },
  { eyebrow: 'PILOTO RESPONSABLE', outcome: 'Control humano desde el diseño', nodes: [{ icon: Database, label: 'Datos seguros' }, { icon: BrainCircuit, label: 'Prueba acotada' }, { icon: ShieldCheck, label: 'Control' }] },
  { eyebrow: 'TU PRÓXIMO PASO', outcome: 'Ficha lista para conversar', nodes: [{ icon: ClipboardCheck, label: 'Define' }, { icon: BarChart3, label: 'Mide' }, { icon: ArrowRight, label: 'Avanza' }] },
];

function WebinarIllustration({ slideIndex, reduceMotion }: { slideIndex: number; reduceMotion: boolean }) {
  const artwork = slideArtworks[slideIndex];

  return (
    <div className="relative mb-7 overflow-hidden rounded-2xl border border-cyan-100/15 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,.12),transparent_65%),rgba(2,12,30,.48)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.18em] text-cyan-200 sm:text-xs">{artwork.eyebrow}</p>
        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" />
      </div>
      <div className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <div aria-hidden="true" className="absolute left-[16%] right-[16%] top-7 h-px bg-cyan-100/15" />
        <motion.div aria-hidden="true" className="absolute top-[calc(1.75rem-2px)] z-10 h-1 w-1 rounded-full bg-cyan-100 shadow-[0_0_10px_3px_rgba(103,232,249,.7)]" animate={reduceMotion ? { left: '50%' } : { left: ['16%', '50%', '84%'] }} transition={reduceMotion ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: 'linear' }} />
        {artwork.nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <motion.div key={`${slideIndex}-${node.label}`} animate={reduceMotion ? { y: 0 } : { y: [0, -4, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, delay: index * 0.32, ease: 'easeInOut' }} className="relative z-[1] flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-xl border border-cyan-100/15 bg-[#061b37]/90 p-2 text-center shadow-lg sm:min-h-[96px] sm:rounded-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-100/20 bg-cyan-200/10 text-cyan-100"><Icon className="h-5 w-5" /></span>
              <span className="text-[10px] font-medium leading-tight text-slate-200 sm:text-xs">{node.label}</span>
            </motion.div>
          );
        })}
      </div>
      <motion.p key={artwork.outcome} initial={{ opacity: 0, y: reduceMotion ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className="mt-4 text-center text-xs font-semibold text-cyan-50">{artwork.outcome}</motion.p>
    </div>
  );
}

export default function WebinarPage() {
  const prefersReducedMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const slide = slides[activeSlide];

  useEffect(() => {
    setVoiceAvailable(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (!isNarrating || !voiceAvailable) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(slide.narration);
    utterance.lang = 'es-CL';
    utterance.rate = 0.94;
    const spanishVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.onend = () => {
      if (activeSlide < slides.length - 1) setActiveSlide((current) => current + 1);
      else setIsNarrating(false);
    };
    utterance.onerror = () => setIsNarrating(false);
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [activeSlide, isNarrating, slide.narration, voiceAvailable]);

  const selectSlide = (index: number) => {
    setIsNarrating(false);
    window.speechSynthesis?.cancel();
    setActiveSlide(Math.max(0, Math.min(slides.length - 1, index)));
  };

  const toggleNarration = () => {
    if (!voiceAvailable) return;
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }
    setIsNarrating(true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#041a36] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(ellipse_at_10%_90%,rgba(37,99,235,0.18),transparent_40%)]" />
      <header className="relative z-10 border-b border-white/10 bg-[#041a36]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/academia" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-100 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Academia ArkoData</a>
          <span className="rounded-full border border-emerald-200/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">WEBINAR · GRATIS · GRABADO</span>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Academia ArkoData · 8 minutos</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Cómo identificar una oportunidad real de IA en tu organización</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Un webinar autoguiado para elegir un problema concreto, estimar su impacto y diseñar un piloto responsable.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400"><Mic2 className="h-4 w-4 text-cyan-200" /> Presentación narrada</div>
        </div>

        <section aria-live="polite" className="relative overflow-hidden rounded-[1.75rem] border border-cyan-100/20 bg-[linear-gradient(135deg,rgba(7,57,111,.88),rgba(4,26,54,.97))] shadow-[0_30px_100px_rgba(0,0,0,.35)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-white/10"><div className="h-full bg-gradient-to-r from-cyan-300 to-blue-400 transition-all duration-500" style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }} /></div>
          {!prefersReducedMotion && <motion.div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.8, 0.45] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSlide}
              className="relative grid min-h-[440px] lg:grid-cols-[1fr_0.72fr]"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 28, y: prefersReducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
                <motion.p initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.08 }} className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{slide.label}</motion.p>
                <motion.h2 initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.13 }} className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">{slide.title}</motion.h2>
                <motion.p initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.19 }} className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{slide.subtitle}</motion.p>
                <ul className="mt-8 space-y-3">
                  {slide.points.map((point, index) => <motion.li key={point} initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.24 + index * 0.07, duration: prefersReducedMotion ? 0 : 0.28 }} className="flex items-start gap-3 text-sm leading-6 text-slate-100 sm:text-base"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" />{point}</motion.li>)}
                </ul>
              </div>
              <aside className="flex flex-col justify-between border-t border-white/10 bg-slate-950/25 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <div>
                  <WebinarIllustration slideIndex={activeSlide} reduceMotion={Boolean(prefersReducedMotion)} />
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0 : 0.45 }}>
                  <div className="flex items-center gap-2 text-sm font-medium text-cyan-100"><Volume2 className="h-4 w-4" /> Guion del relator</div>
                  <p className="mt-5 text-sm leading-7 text-slate-300">{slide.narration}</p>
                  </motion.div>
                </div>
                <p className="mt-8 text-xs leading-5 text-slate-500">El audio se sintetiza en tu navegador al reproducir. También puedes seguir el webinar leyendo el guion.</p>
              </aside>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-4 border-t border-white/10 bg-[#03142b]/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
            <div className="flex items-center gap-3">
              <button type="button" onClick={toggleNarration} disabled={!voiceAvailable} aria-label={isNarrating ? 'Pausar narración' : 'Reproducir narración'} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">
                {isNarrating ? <><CirclePause className="h-5 w-5" /> Pausar narración</> : <><CirclePlay className="h-5 w-5" /> Narrar diapositivas</>}
              </button>
              {!voiceAvailable && <span className="inline-flex items-center gap-1 text-xs text-slate-400"><VolumeX className="h-4 w-4" /> Narración no disponible en este navegador</span>}
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-sm tabular-nums text-slate-400">{activeSlide + 1} / {slides.length}</span>
              <button type="button" onClick={() => selectSlide(activeSlide - 1)} disabled={activeSlide === 0} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> Anterior</button>
              <button type="button" onClick={() => selectSlide(activeSlide + 1)} disabled={activeSlide === slides.length - 1} className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-200/10 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:opacity-40">Siguiente <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </section>

        <nav aria-label="Diapositivas del webinar" className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {slides.map((item, index) => <button key={item.label} type="button" onClick={() => selectSlide(index)} aria-current={activeSlide === index ? 'step' : undefined} aria-label={`Ir a diapositiva ${index + 1}: ${item.label}`} className={`h-2 min-w-8 flex-1 rounded-full transition ${activeSlide === index ? 'bg-cyan-200' : index < activeSlide ? 'bg-cyan-200/45' : 'bg-white/15 hover:bg-white/30'}`} />)}
        </nav>
        <p className="mt-8 text-center text-sm text-slate-400">¿Quieres evaluar un caso en tu organización? <a href="/#contacto" className="font-medium text-cyan-200 underline decoration-cyan-200/40 underline-offset-4 hover:text-white">Conversemos con ArkoData</a></p>
      </div>
    </main>
  );
}
