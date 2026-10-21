import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BarChart3, BrainCircuit, BriefcaseBusiness, CheckCircle2, CirclePause, CirclePlay, ClipboardCheck, Database, FileSearch, Mail, Maximize2, Mic2, Minimize2, ShieldCheck, UserRound, Volume2, VolumeX, Workflow } from 'lucide-react';

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
  const CoreIcon = artwork.nodes[1].icon;

  return (
    <div className="relative mb-5 overflow-hidden rounded-[1.5rem] border border-cyan-100/15 bg-[#03142b]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_24px_80px_rgba(0,0,0,.25)] sm:mb-6 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_36%,rgba(34,211,238,.16),transparent_35%),linear-gradient(145deg,rgba(7,57,111,.25),transparent_65%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(148,220,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,220,255,.2)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold tracking-[0.18em] text-cyan-200 sm:text-xs">{artwork.eyebrow}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/15 bg-emerald-200/[0.06] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-100"><motion.span animate={reduceMotion ? { opacity: 1 } : { opacity: [0.55, 1, 0.55], scale: [0.85, 1.15, 0.85] }} transition={reduceMotion ? { duration: 0 } : { duration: 1.8, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" /> En sistema</span>
      </div>

      <div className="relative mx-auto mt-3 h-[260px] max-w-[520px] sm:h-[300px]">
        <svg aria-hidden="true" viewBox="0 0 440 280" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id={`flow-${slideIndex}`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#22d3ee" stopOpacity="0" /><stop offset=".5" stopColor="#67e8f9" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0" /></linearGradient>
            <filter id={`glow-${slideIndex}`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <motion.path d="M220 125 C155 120 132 173 74 205 M220 125 C285 120 308 173 366 205" fill="none" stroke={`url(#flow-${slideIndex})`} strokeWidth="2" strokeDasharray="5 8" animate={reduceMotion ? { opacity: 0.45 } : { strokeDashoffset: [0, -52], opacity: [0.25, 0.85, 0.25] }} transition={reduceMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: 'linear' }} />
          {!reduceMotion && <motion.circle r="4" fill="#a5f3fc" filter={`url(#glow-${slideIndex})`} animate={{ offsetDistance: ['0%', '100%'] }} style={{ offsetPath: 'path("M 75 205 C 155 120 285 120 365 205")' }} transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }} />}
          <circle cx="220" cy="125" r="82" fill="none" stroke="rgba(103,232,249,.12)" strokeDasharray="2 8" />
        </svg>

        <motion.div aria-hidden="true" className="absolute left-1/2 top-[16px] h-[156px] w-[156px] -translate-x-1/2 rounded-full border border-cyan-100/15" animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }} transition={reduceMotion ? { duration: 0 } : { duration: 24, repeat: Infinity, ease: 'linear' }}>
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-100 shadow-[0_0_16px_5px_rgba(103,232,249,.6)]" />
        </motion.div>
        <motion.div aria-hidden="true" className="absolute left-1/2 top-[30px] h-[128px] w-[128px] -translate-x-1/2 rounded-full border border-blue-200/15" animate={reduceMotion ? { rotate: 0 } : { rotate: -360 }} transition={reduceMotion ? { duration: 0 } : { duration: 32, repeat: Infinity, ease: 'linear' }}>
          <span className="absolute right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-200 shadow-[0_0_14px_4px_rgba(96,165,250,.6)]" />
        </motion.div>

        <motion.div animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.055, 1], boxShadow: ['0 0 30px rgba(34,211,238,.12)', '0 0 65px rgba(34,211,238,.32)', '0 0 30px rgba(34,211,238,.12)'] }} transition={reduceMotion ? { duration: 0 } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-1/2 top-[48px] z-[2] flex h-[88px] w-[88px] -translate-x-1/2 items-center justify-center rounded-[1.65rem] border border-cyan-100/35 bg-[linear-gradient(145deg,rgba(34,211,238,.22),rgba(30,64,175,.28))] text-cyan-50 backdrop-blur-xl">
          <CoreIcon className="h-10 w-10" strokeWidth={1.5} />
          <span className="absolute -bottom-6 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.24em] text-cyan-100/80">IA aplicada</span>
        </motion.div>

        <div className="absolute inset-x-0 bottom-3 z-[3] grid grid-cols-3 gap-2 sm:gap-4">
          {artwork.nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <motion.div key={`${slideIndex}-${node.label}`} initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.12 * index, duration: reduceMotion ? 0 : 0.35 }} whileHover={reduceMotion ? undefined : { y: -6, scale: 1.04 }} className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-[#061b37]/90 px-1.5 py-2 text-center shadow-[0_16px_40px_rgba(0,0,0,.3)] backdrop-blur-lg sm:min-h-[80px] sm:gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${index === 1 ? 'border-cyan-100/30 bg-cyan-200/15 text-cyan-50' : 'border-white/10 bg-white/[0.04] text-slate-300'}`}><Icon className="h-4 w-4" /></span>
                <span className="text-[9px] font-medium leading-tight text-slate-200 sm:text-[10px]">{node.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3">
        <motion.p key={artwork.outcome} initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }} className="text-xs font-semibold text-cyan-50">{artwork.outcome}</motion.p>
        <div className="flex h-5 items-end gap-0.5" aria-hidden="true">{[30, 48, 38, 68, 52, 88, 64, 100, 72, 84, 58, 92].map((height, index) => <motion.span key={`${slideIndex}-bar-${index}`} className="w-1 rounded-full bg-gradient-to-t from-blue-500/45 to-cyan-200/90" animate={reduceMotion ? { height: 4 + height * 0.1, opacity: 0.65 } : { height: [3 + height * 0.08, 4 + height * 0.17, 3 + height * 0.08], opacity: [0.3, 0.95, 0.3] }} transition={reduceMotion ? { duration: 0 } : { duration: 1.1, delay: index * 0.05, repeat: Infinity, ease: 'easeInOut' }} />)}</div>
      </div>
    </div>
  );
}

export default function WebinarPage() {
  const prefersReducedMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const presentationRef = useRef<HTMLElement | null>(null);
  const slide = slides[activeSlide];

  useEffect(() => {
    setVoiceAvailable(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', updateFullscreen);
    return () => document.removeEventListener('fullscreenchange', updateFullscreen);
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

  const toggleFullscreen = async () => {
    if (!presentationRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await presentationRef.current.requestFullscreen();
  };

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea, summary')) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        selectSlide(activeSlide + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        selectSlide(activeSlide - 1);
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [activeSlide]);

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
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex"><Mic2 className="h-4 w-4 text-cyan-200" />{isNarrating ? <><span className="text-cyan-100">Narrando</span><span className="flex h-4 items-center gap-0.5" aria-hidden="true">{[0, 1, 2, 3, 4].map((bar) => <motion.span key={bar} className="w-0.5 rounded-full bg-cyan-200" animate={prefersReducedMotion ? { height: 5 } : { height: [4, 13, 6, 11, 4] }} transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.7, repeat: Infinity, delay: bar * 0.08 }} />)}</span></> : 'Presentación narrada'}</div>
            <button type="button" onClick={toggleFullscreen} className="inline-flex items-center gap-2 rounded-xl border border-cyan-100/20 bg-cyan-100/[0.06] px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:border-cyan-100/45 hover:bg-cyan-100/10 sm:px-4 sm:py-2.5 sm:text-sm" aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Abrir presentación a pantalla completa'}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}{isFullscreen ? 'Salir' : 'Presentar'}
            </button>
          </div>
        </div>

        <section ref={presentationRef} aria-live="polite" style={isFullscreen ? { width: '100vw', height: '100vh' } : undefined} className={`relative flex flex-col overflow-hidden border border-cyan-100/20 bg-[linear-gradient(135deg,rgba(7,57,111,.88),rgba(4,26,54,.97))] shadow-[0_30px_100px_rgba(0,0,0,.35)] ${isFullscreen ? 'min-h-screen rounded-none p-3 sm:p-5' : 'rounded-[1.75rem]'}`}>
          <div className="absolute inset-x-0 top-0 h-1 bg-white/10"><div className="h-full bg-gradient-to-r from-cyan-300 to-blue-400 transition-all duration-500" style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }} /></div>
          <div className="relative z-20 flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-3 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">ARKODATA / WEBINAR</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
              <span className="truncate text-xs text-slate-300">{slide.label}</span>
            </div>
            <span className="shrink-0 font-mono text-[10px] tracking-widest text-slate-400">{String(activeSlide + 1).padStart(2, '0')} <span className="text-cyan-300/50">/</span> {String(slides.length).padStart(2, '0')}</span>
          </div>
          {!prefersReducedMotion && <motion.div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.8, 0.45] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSlide}
              className={`relative grid min-h-[440px] flex-1 lg:grid-cols-[0.88fr_1.12fr] ${isFullscreen ? 'mx-auto w-full max-w-[1480px] items-center' : ''}`}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 28, y: prefersReducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14 xl:p-20">
                <motion.p initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.08 }} className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{slide.label}</motion.p>
                <motion.h2 initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.13 }} className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">{slide.title}</motion.h2>
                <motion.p initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.19 }} className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{slide.subtitle}</motion.p>
                <ul className="mt-8 space-y-3">
                  {slide.points.map((point, index) => <motion.li key={point} initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.24 + index * 0.07, duration: prefersReducedMotion ? 0 : 0.28 }} className="flex items-start gap-3 text-sm leading-6 text-slate-100 sm:text-base"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" />{point}</motion.li>)}
                </ul>
              </div>
              <aside className="flex flex-col justify-center border-t border-white/10 bg-slate-950/25 p-4 sm:p-8 lg:border-l lg:border-t-0 lg:p-8 xl:p-12">
                <div>
                  <WebinarIllustration slideIndex={activeSlide} reduceMotion={Boolean(prefersReducedMotion)} />
                  <details className="group rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-cyan-100 marker:hidden"><span className="inline-flex items-center gap-2"><Volume2 className="h-4 w-4" /> Ver guion del relator</span><ArrowRight className="h-4 w-4 transition-transform group-open:rotate-90" /></summary>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: prefersReducedMotion ? 0 : 0.25 }} className="mt-3 text-sm leading-6 text-slate-300">{slide.narration}</motion.p>
                  </details>
                </div>
                <p className="mt-2 text-[10px] leading-5 text-slate-500">Narración en español · generada en el navegador</p>
              </aside>
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 flex flex-col gap-4 border-t border-white/10 bg-[#03142b]/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={toggleNarration} disabled={!voiceAvailable} aria-label={isNarrating ? 'Pausar narración' : 'Reproducir narración'} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50">
                {isNarrating ? <><CirclePause className="h-5 w-5" /> Pausar narración</> : <><CirclePlay className="h-5 w-5" /> Narrar diapositivas</>}
              </button>
              {!voiceAvailable && <span className="inline-flex items-center gap-1 text-xs text-slate-400"><VolumeX className="h-4 w-4" /> Narración no disponible en este navegador</span>}
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="hidden text-[10px] uppercase tracking-wider text-slate-500 md:inline">← → navegar</span>
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
