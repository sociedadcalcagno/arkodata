import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BarChart3, BrainCircuit, BriefcaseBusiness, CheckCircle2, CirclePause, CirclePlay, ClipboardCheck, Database, FileSearch, Mail, Mic2, ShieldCheck, UserRound, Volume2, VolumeX, Workflow } from 'lucide-react';

const slides = [
  {
    label: 'INTRODUCCIÓN',
    title: 'La oportunidad no empieza con una herramienta',
    subtitle: 'Empieza con un problema real. En 3 minutos, conviértelo en un piloto medible.',
    points: ['3 minutos · a tu ritmo', 'Incluye una ficha de oportunidad'],
    narration: 'Bienvenido al webinar de ArkoData. En pocos minutos veremos cómo reconocer una oportunidad concreta para aplicar IA, estimar su valor y diseñar un primer piloto con controles claros. No necesitas conocimientos técnicos.',
  },
  {
    label: '01 · OBSERVA',
    title: 'Mira el trabajo, no la tecnología',
    subtitle: 'Una oportunidad aparece donde el proceso se repite, se demora o falla.',
    points: ['¿Quién realiza la tarea?', '¿Dónde se pierde tiempo o calidad?'],
    narration: 'Es tentador empezar eligiendo una herramienta. Mejor observa el trabajo: quién lo hace, qué pasos sigue y qué resultado entrega. Busca esperas, doble digitación, búsquedas manuales y errores repetidos.',
  },
  {
    label: '02 · IDENTIFICA',
    title: 'La IA prepara. El equipo decide.',
    subtitle: 'Prioriza tareas repetitivas donde leer, resumir o clasificar consume tiempo.',
    points: ['Leer y ordenar información', 'Preparar una respuesta para revisión'],
    narration: 'La IA puede ayudar a leer, resumir, clasificar o preparar borradores. Su aporte es proponer; el equipo conserva las reglas, valida la información y decide los casos importantes.',
  },
  {
    label: '03 · PRIORIZA',
    title: 'Cuatro señales de una buena candidata',
    subtitle: 'Volumen, tiempo, datos disponibles y riesgo controlable.',
    points: ['¿Ocurre con frecuencia?', '¿Podemos medir y revisar el resultado?'],
    narration: 'Antes de construir, estima cuántas veces ocurre la tarea y cuánto demora. Confirma que puedes usar datos adecuados y define quién revisará los errores y las excepciones.',
  },
  {
    label: '04 · EJEMPLO',
    title: 'De una bandeja de entrada a un flujo claro',
    subtitle: 'La IA clasifica solicitudes; las reglas y el equipo mantienen el control.',
    points: ['Clasificar y resumir', 'Validar datos y derivar para aprobación'],
    narration: 'Imagina un equipo que recibe solicitudes por correo. La IA resume el mensaje y sugiere una categoría. Una regla revisa los datos obligatorios y una persona confirma la derivación. Los casos dudosos pasan a revisión.',
  },
  {
    label: '05 · MIDE',
    title: 'El impacto se demuestra con datos',
    subtitle: 'Compara el proceso actual con el piloto usando los mismos indicadores.',
    points: ['Tiempo por caso', 'Errores y excepciones'],
    narration: 'Registra el punto de partida antes de probar. Mide el tiempo por caso, los errores y cuántas excepciones requieren atención. Compara resultados equivalentes y acuerda qué mejora justificaría continuar.',
  },
  {
    label: '06 · PROTEGE',
    title: 'Empieza pequeño. Mantén el control.',
    subtitle: 'Un piloto seguro usa datos autorizados y tiene una persona responsable.',
    points: ['Prueba acotada y reversible', 'Revisión humana en excepciones'],
    narration: 'Empieza con pocos casos y datos autorizados. Registra sugerencias, correcciones y excepciones. Define quién supervisa el piloto y cuándo se debe detener o ajustar.',
  },
  {
    label: '07 · ACCIÓN',
    title: 'Tu próximo paso cabe en una página',
    subtitle: 'Define la tarea, el impacto esperado, los controles y quién lo medirá.',
    points: ['Elige un proceso real', 'Agenda una evaluación del piloto'],
    narration: 'Resume la oportunidad en una página: tarea, volumen, tiempo actual, datos autorizados, propuesta de IA, responsable de revisión e indicador. Con eso puedes evaluar un piloto real. Gracias por participar.',
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
    <div className="relative mb-5 overflow-hidden rounded-2xl border border-cyan-100/15 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,.18),transparent_65%),rgba(2,12,30,.55)] p-4 sm:mb-6 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.18em] text-cyan-200 sm:text-xs">{artwork.eyebrow}</p>
        <motion.span animate={reduceMotion ? { opacity: 1 } : { opacity: [0.55, 1, 0.55], scale: [0.85, 1.15, 0.85] }} transition={reduceMotion ? { duration: 0 } : { duration: 1.8, repeat: Infinity }} className="h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" />
      </div>
      <div className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <div aria-hidden="true" className="absolute left-[12%] right-[12%] top-8 h-px bg-gradient-to-r from-transparent via-cyan-100/40 to-transparent" />
        {!reduceMotion && <motion.div aria-hidden="true" className="absolute left-[12%] right-[12%] top-[calc(2rem-1px)] h-px origin-left bg-gradient-to-r from-cyan-300 via-blue-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,.8)]" animate={{ scaleX: [0.12, 0.5, 0.92, 0.12] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />}
        <motion.div aria-hidden="true" className="absolute top-[calc(2rem-3px)] z-10 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_4px_rgba(103,232,249,.85)]" animate={reduceMotion ? { left: '50%' } : { left: ['12%', '50%', '88%'] }} transition={reduceMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
        {artwork.nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <motion.div key={`${slideIndex}-${node.label}`} animate={reduceMotion ? { y: 0, scale: 1, borderColor: 'rgba(165,243,252,.15)' } : { y: [0, -6, 0], scale: [1, index === 1 ? 1.07 : 1.025, 1], borderColor: ['rgba(165,243,252,.15)', 'rgba(103,232,249,.55)', 'rgba(165,243,252,.15)'] }} transition={reduceMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, delay: index * 0.45, ease: 'easeInOut' }} className="relative z-[1] flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-xl border bg-[#061b37]/95 p-2 text-center shadow-[0_12px_30px_rgba(0,0,0,.24)] sm:min-h-[96px] sm:rounded-2xl">
              <motion.span animate={reduceMotion ? { rotate: 0 } : { rotate: [0, index === 1 ? 5 : -3, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, delay: index * 0.45 }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-100/20 bg-cyan-200/10 text-cyan-100"><Icon className="h-5 w-5" /></motion.span>
              <span className="text-[10px] font-medium leading-tight text-slate-200 sm:text-xs">{node.label}</span>
            </motion.div>
          );
        })}
      </div>
      <motion.p key={artwork.outcome} initial={{ opacity: 0, y: reduceMotion ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className="mt-4 text-center text-xs font-semibold text-cyan-50">{artwork.outcome}</motion.p>
      <div className="mt-3 flex items-end justify-center gap-1.5" aria-hidden="true">
        {[30, 48, 38, 68, 52, 88, 64, 100, 72, 84, 58, 92].map((height, index) => <motion.span key={`${slideIndex}-bar-${index}`} className="w-1.5 rounded-full bg-gradient-to-t from-blue-500/45 to-cyan-200/90 sm:w-2" animate={reduceMotion ? { height: 8 + height * 0.22, opacity: 0.65 } : { height: [8 + height * 0.16, 8 + height * 0.28, 8 + height * 0.16], opacity: [0.35, 0.9, 0.35] }} transition={reduceMotion ? { duration: 0 } : { duration: 1.25, delay: index * 0.055, repeat: Infinity, ease: 'easeInOut' }} />)}
      </div>
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
          <span className="rounded-full border border-emerald-200/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">WEBINAR · GRATIS · BAJO DEMANDA</span>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Academia ArkoData · Webinar gratuito · 3 min</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Cómo encontrar una oportunidad de IA que genere valor</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">De un problema cotidiano a un piloto claro, seguro y medible.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400"><Mic2 className="h-4 w-4 text-cyan-200" />{isNarrating ? <><span className="text-cyan-100">Narrando</span><span className="flex h-4 items-center gap-0.5" aria-hidden="true">{[0, 1, 2, 3, 4].map((bar) => <motion.span key={bar} className="w-0.5 rounded-full bg-cyan-200" animate={prefersReducedMotion ? { height: 5 } : { height: [4, 13, 6, 11, 4] }} transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, repeat: Infinity, delay: bar * 0.08 }} />)}</span></> : 'Presentación narrada'}</div>
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
                  <details className="group rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-cyan-100 marker:hidden"><span className="inline-flex items-center gap-2"><Volume2 className="h-4 w-4" /> Ver guion del relator</span><ArrowRight className="h-4 w-4 transition-transform group-open:rotate-90" /></summary>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: prefersReducedMotion ? 0 : 0.25 }} className="mt-3 text-sm leading-6 text-slate-300">{slide.narration}</motion.p>
                  </details>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">Narración en español generada por tu navegador.</p>
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
