import { useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, BrainCircuit, CheckCircle2, ChevronDown, Clock3, Cloud, Code2, Database, FileText, GraduationCap, Layers3, Search, Users, Workflow, X } from 'lucide-react';
import academyImage from '../../../img/Academia ArkoData_ Tecnología e IA.png';
import { useCreateLead } from '../lib/api';

const categories = ['Todos', 'IA y automatización', 'Datos y desarrollo', 'Negocio y operaciones'];

export const academyCourses = [
  {
    slug: 'inteligencia-artificial',
    title: 'Inteligencia Artificial aplicada al negocio',
    category: 'IA y automatización',
    icon: BrainCircuit,
    format: 'Clase abierta + curso especializado',
    duration: 'Clases en vivo y grabadas',
    description: 'Comprende dónde aporta valor la IA, cómo elegir un caso de uso y cómo llevarlo desde una idea a un piloto medible.',
    freeClass: 'Cómo identificar una oportunidad real de IA en tu organización',
    topics: ['Casos de uso y límites de la IA', 'Diseño de un piloto con objetivos medibles', 'Datos, seguridad y adopción del equipo'],
  },
  {
    slug: 'automatizacion-workflows',
    title: 'Automatización de procesos y workflows',
    category: 'IA y automatización',
    icon: Workflow,
    format: 'Clase abierta + curso especializado',
    duration: 'Clases en vivo y grabadas',
    description: 'Mapea tareas, traspasos y reglas para automatizar el flujo completo sin perder control ni trazabilidad.',
    freeClass: 'Mapa rápido: encuentra tareas repetitivas y cuellos de botella',
    topics: ['Mapeo de procesos y puntos de fricción', 'Reglas, alertas, excepciones y aprobaciones', 'Medición de tiempos, errores e impacto'],
  },
  {
    slug: 'business-intelligence',
    title: 'Business Intelligence y dashboards',
    category: 'Negocio y operaciones',
    icon: Layers3,
    format: 'Clase abierta + curso especializado',
    duration: 'Clases en vivo y grabadas',
    description: 'Convierte datos operacionales en indicadores claros para monitorear desempeño y tomar mejores decisiones.',
    freeClass: 'De una pregunta de negocio a un indicador que sí sirve',
    topics: ['Definición de métricas y KPI', 'Preparación y modelado de datos', 'Diseño de dashboards orientados a decisiones'],
  },
  {
    slug: 'bases-datos-sql',
    title: 'Bases de datos y SQL',
    category: 'Datos y desarrollo',
    icon: Database,
    format: 'Curso específico',
    duration: 'Clases prácticas',
    description: 'Aprende a consultar, organizar y comprender datos relacionales con ejercicios conectados a situaciones reales.',
    freeClass: 'Primeros pasos para consultar datos con SQL',
    topics: ['Consultas, filtros y agregaciones', 'Relaciones entre tablas', 'Buenas prácticas para datos confiables'],
  },
  {
    slug: 'desarrollo-web-apis',
    title: 'Desarrollo web, APIs e integración',
    category: 'Datos y desarrollo',
    icon: Code2,
    format: 'Curso específico',
    duration: 'Clases prácticas',
    description: 'Conoce cómo se conectan aplicaciones, servicios y sistemas para construir soluciones digitales útiles.',
    freeClass: 'Cómo se comunican una aplicación y una API',
    topics: ['Fundamentos de aplicaciones web', 'Consumo y diseño de APIs', 'Integración con plataformas y servicios'],
  },
  {
    slug: 'cloud-devops',
    title: 'Cloud y DevOps',
    category: 'Datos y desarrollo',
    icon: Cloud,
    format: 'Curso específico',
    duration: 'Clases prácticas',
    description: 'Explora fundamentos de nube, despliegue y operación para publicar soluciones con mejores prácticas.',
    freeClass: 'Qué considerar antes de llevar una aplicación a la nube',
    topics: ['Conceptos de infraestructura cloud', 'Contenedores y despliegues', 'Monitoreo, continuidad y buenas prácticas'],
  },
  {
    slug: 'gestion-documental',
    title: 'Gestión documental inteligente',
    category: 'Negocio y operaciones',
    icon: FileText,
    format: 'Clase abierta + curso especializado',
    duration: 'Clases en vivo y grabadas',
    description: 'Diseña procesos documentales más eficientes combinando captura de información, validaciones y flujos de trabajo.',
    freeClass: 'Cómo rediseñar un flujo documental de principio a fin',
    topics: ['Captura y extracción de información', 'Validación y gestión de excepciones', 'Trazabilidad e integración con procesos'],
  },
  {
    slug: 'tecnologia-salud',
    title: 'Tecnología aplicada a salud y operaciones',
    category: 'Negocio y operaciones',
    icon: Users,
    format: 'Programa personalizado',
    duration: 'Individual o para equipos',
    description: 'Revisa oportunidades de mejora en flujos de atención, coordinación, liquidaciones y operación del sector salud.',
    freeClass: 'Principios para mapear un proceso de salud con múltiples actores',
    topics: ['Procesos con múltiples participantes', 'Reglas, cálculos y puntos de control', 'Diseño de una ruta de mejora tecnológica'],
  },
];

type AcademyCourse = typeof academyCourses[number];

const academyImageLinks = [
  { label: 'Bases de Datos', courseTitle: 'Bases de datos y SQL', left: '1.8%', width: '11.2%' },
  { label: 'Desarrollo', courseTitle: 'Desarrollo web, APIs e integración', left: '13.1%', width: '11.4%' },
  { label: 'Cloud y DevOps', courseTitle: 'Cloud y DevOps', left: '24.8%', width: '11.7%' },
  { label: 'Business Intelligence', courseTitle: 'Business Intelligence y dashboards', left: '37%', width: '11.8%' },
  { label: 'Inteligencia Artificial', courseTitle: 'Inteligencia Artificial aplicada al negocio', left: '49.4%', width: '11.7%' },
  { label: 'Automatización', courseTitle: 'Automatización de procesos y workflows', left: '61.8%', width: '11.8%' },
  { label: 'Gestión Documental', courseTitle: 'Gestión documental inteligente', left: '74.2%', width: '11.8%' },
  { label: 'Salud', courseTitle: 'Tecnología aplicada a salud y operaciones', left: '86.5%', width: '11.7%' },
];

export default function AcademyPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const createLead = useCreateLead();

  const visibleCourses = useMemo(() => academyCourses.filter((course) => {
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    const query = searchTerm.trim().toLocaleLowerCase('es');
    const matchesSearch = !query || `${course.title} ${course.description} ${course.category}`.toLocaleLowerCase('es').includes(query);
    return matchesCategory && matchesSearch;
  }), [activeCategory, searchTerm]);

  const openCourse = (course: AcademyCourse) => {
    setSelectedCourse(course);
    setShowInterestForm(false);
    setRequestSent(false);
    setRequestError('');
  };

  const exploreCourses = () => {
    document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitInterest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCourse) return;
    setRequestError('');
    try {
      await createLead.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        company: null,
        phone: null,
        interest: `Academia ArkoData — ${selectedCourse.title}`,
        source: 'Academia ArkoData',
      });
      window.localStorage.setItem(`academy-enrollment:${selectedCourse.slug}`, JSON.stringify({ name: name.trim(), email: email.trim() }));
      setRequestSent(true);
    } catch {
      setRequestError('No pudimos enviar tu solicitud. Inténtalo nuevamente en unos minutos.');
    }
  };

  return (
    <main className="min-h-screen bg-[#041a36] text-white">
      <header className="sticky top-0 z-40 border-b border-cyan-300/20 bg-[#041a36]/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="inline-flex items-center gap-3" aria-label="Volver al sitio de ArkoData">
            <img src="/ArkoData.png" alt="" className="h-11 w-11" />
            <span>
              <span className="block text-base font-semibold text-white">Academia ArkoData</span>
              <span className="hidden text-xs text-slate-400 sm:block">Aprende · Aplica · Transforma</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex" aria-label="Navegación de la academia">
            <a className="transition-colors hover:text-cyan-200" href="#cursos">Explorar cursos</a>
            <a className="transition-colors hover:text-cyan-200" href="#experiencia">Cómo funciona</a>
            <a className="transition-colors hover:text-cyan-200" href="/#academia">ArkoData</a>
          </nav>
          <a href="#cursos" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
            Ver cursos <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top_right,rgba(14,116,220,0.33),transparent_50%),linear-gradient(135deg,#041a36,#07396f_65%,#05284f)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative z-10">
            <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-100 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Volver a ArkoData
            </a>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">Conocimiento para llevar a la práctica</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl lg:text-6xl">Aprende tecnología. Transforma cómo trabajas.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">Explora clases y cursos de IA, datos, desarrollo y automatización. Empieza con una clase abierta y profundiza con formación práctica para ti o tu equipo.</p>
            <a href="#cursos" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-400 px-6 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5">
              Explorar temas y cursos <ArrowRight className="h-5 w-5" />
            </a>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-cyan-50/80">
              <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-cyan-200" /> Clases abiertas y cursos</span>
              <span className="inline-flex items-center gap-2"><GraduationCap className="h-4 w-4 text-cyan-200" /> Formación para equipos</span>
            </div>
          </div>
          <div className="group/image relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <img src={academyImage} alt="Explora los cursos de Academia ArkoData: bases de datos, desarrollo, cloud, inteligencia artificial, automatización, gestión documental y salud." className="block h-auto w-full" fetchPriority="high" />
            {academyImageLinks.map((item) => {
              const course = academyCourses.find((candidate) => candidate.title === item.courseTitle);
              if (!course) return null;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => openCourse(course)}
                  aria-label={`Explorar curso: ${item.label}`}
                  title={`Explorar ${item.label}`}
                  style={{ left: item.left, width: item.width, top: '55.8%', height: '19.3%' }}
                  className="group/hotspot absolute z-10 rounded-xl border border-transparent transition duration-200 hover:border-cyan-200/90 hover:bg-cyan-300/20 hover:shadow-[0_0_28px_rgba(34,211,238,0.5)] focus:border-cyan-100 focus:bg-cyan-300/20 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                >
                  <span className="pointer-events-none absolute inset-x-1 bottom-2 translate-y-1 rounded-lg bg-[#041a36]/95 px-1 py-1.5 text-center text-[clamp(0.48rem,0.9vw,0.8rem)] font-semibold leading-tight text-white opacity-0 shadow-lg transition duration-200 group-hover/hotspot:translate-y-0 group-hover/hotspot:opacity-100 group-focus/hotspot:translate-y-0 group-focus/hotspot:opacity-100">Explorar {item.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={exploreCourses}
              aria-label="Ver todos los cursos de la Academia ArkoData"
              title="Ver todos los cursos"
              style={{ left: '80.2%', width: '18.4%', top: '77.5%', height: '9.7%' }}
              className="absolute z-10 rounded-full border border-transparent transition duration-200 hover:border-blue-500 hover:bg-cyan-300/25 hover:shadow-[0_0_30px_rgba(34,211,238,0.55)] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      <section id="cursos" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">Catálogo de aprendizaje</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Explora por dónde quieres avanzar.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">Cada tema comienza con una clase introductoria y puede continuar con cursos específicos o programas prácticos.</p>
            </div>
            <label className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-slate-300 lg:max-w-sm">
              <Search className="h-5 w-5 shrink-0 text-cyan-200" />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar un tema o curso" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
            </label>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar cursos por tema">
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${activeCategory === category ? 'border-cyan-200 bg-cyan-300 text-slate-950' : 'border-white/12 bg-white/[0.04] text-slate-300 hover:border-cyan-200/50 hover:text-white'}`}>
                {category}
              </button>
            ))}
          </div>

          {visibleCourses.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleCourses.map((course) => {
                const Icon = course.icon;
                return (
                  <article key={course.title} className="group flex h-full flex-col rounded-[1.6rem] border border-cyan-200/15 bg-[linear-gradient(150deg,rgba(7,57,111,0.88),rgba(4,26,54,0.94))] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-cyan-200/45 hover:shadow-[0_24px_65px_rgba(14,165,233,0.13)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><Icon className="h-6 w-6" /></div>
                      <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-slate-300">{course.category}</span>
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">{course.format}</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug text-white">{course.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">{course.description}</p>
                    <div className="mt-5 flex items-center gap-2 text-xs text-slate-400"><Clock3 className="h-4 w-4 text-cyan-200" />{course.duration}</div>
                    <button onClick={() => openCourse(course)} className="mt-6 inline-flex w-full items-center justify-between rounded-xl border border-cyan-200/20 bg-cyan-200/[0.06] px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/55 hover:bg-cyan-200/10">
                      Explorar este tema <ChevronDown className="h-4 w-4 -rotate-90" />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-300">No encontramos cursos con esa búsqueda. Prueba con otro tema.</div>
          )}
        </div>
      </section>

      <section id="experiencia" className="scroll-mt-24 border-y border-white/10 bg-[#07315d] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">Tu ruta de aprendizaje</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Del primer concepto a una aplicación real.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { number: '01', title: 'Descubre', description: 'Entra por una clase abierta y conoce un tema con ejemplos claros y aplicables.' },
              { number: '02', title: 'Profundiza', description: 'Avanza con cursos específicos, ejercicios y contenidos guiados.' },
              { number: '03', title: 'Aplica', description: 'Lleva el aprendizaje a un desafío de tu trabajo, tu organización o tu equipo.' },
            ].map((step) => (
              <article key={step.number} className="rounded-2xl border border-white/10 bg-[#041a36]/60 p-6">
                <span className="text-sm font-semibold tracking-[0.2em] text-cyan-200">{step.number}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-5 rounded-[1.75rem] border border-cyan-200/20 bg-[linear-gradient(105deg,rgba(34,211,238,0.12),rgba(37,99,235,0.12))] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="text-xl font-semibold text-white">¿Buscas formación para tu organización?</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">Diseñamos sesiones y programas personalizados según los procesos, el nivel y los objetivos de cada equipo.</p>
            </div>
            <a href="/#contacto" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#05284f] transition hover:bg-cyan-50">Conocer ArkoData <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <footer className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Academia ArkoData · Aprende · Aplica · Transforma</span>
          <a href="/" className="inline-flex items-center gap-2 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Sitio principal de ArkoData</a>
        </div>
      </footer>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm" onClick={() => setSelectedCourse(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="course-dialog-title" className="my-auto w-full max-w-2xl rounded-[1.75rem] border border-cyan-200/20 bg-[#071d3b] p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">{selectedCourse.category} · {selectedCourse.format}</p>
                <h2 id="course-dialog-title" className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">{selectedCourse.title}</h2>
              </div>
              <button onClick={() => setSelectedCourse(null)} aria-label="Cerrar detalle del curso" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {!showInterestForm ? (
              <>
                <p className="mt-5 leading-7 text-slate-300">{selectedCourse.description}</p>
                <div className="mt-6 rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.06] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Empieza con esta clase abierta</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{selectedCourse.freeClass}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Una introducción para llevarte ideas concretas y descubrir cómo seguir profundizando en el tema.</p>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold text-white">En el curso podrás profundizar en</h3>
                  <ul className="mt-3 space-y-3">
                    {selectedCourse.topics.map((topic) => <li key={topic} className="flex items-start gap-3 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />{topic}</li>)}
                  </ul>
                </div>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button onClick={() => setSelectedCourse(null)} className="rounded-xl border border-white/12 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]">Seguir explorando</button>
                  <button onClick={() => setShowInterestForm(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">Me interesa este curso <ArrowRight className="h-4 w-4" /></button>
                </div>
              </>
            ) : requestSent ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
                <h3 className="mt-4 text-2xl font-semibold text-white">¡Listo, recibimos tu interés!</h3>
                <p className="mx-auto mt-3 max-w-md leading-7 text-slate-300">Te contactaremos con información sobre {selectedCourse.title}.</p>
                <a href={`/academia/aula/${selectedCourse.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200">Visitar el aula virtual <ArrowRight className="h-4 w-4" /></a>
              </div>
            ) : (
              <form onSubmit={submitInterest} className="mt-6 space-y-4">
                <p className="leading-7 text-slate-300">Déjanos tus datos y te enviaremos información sobre clases y próximas fechas. Sigues dentro de la Academia ArkoData.</p>
                <label className="block text-sm font-medium text-slate-200">Nombre
                  <input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-200/60" />
                </label>
                <label className="block text-sm font-medium text-slate-200">Correo electrónico
                  <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-200/60" />
                </label>
                {requestError && <p role="alert" className="rounded-xl border border-red-300/25 bg-red-400/10 p-3 text-sm text-red-200">{requestError}</p>}
                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setShowInterestForm(false)} className="rounded-xl border border-white/12 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]">Volver al curso</button>
                  <button type="submit" disabled={createLead.isPending} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60">{createLead.isPending ? 'Enviando…' : 'Recibir información'}</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
