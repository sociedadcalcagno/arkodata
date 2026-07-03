import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, BrainCircuit, Cable, ChevronRight, Database, ChartLine as LineChart, MessageCircle, ScanSearch, ServerCog, Sparkles } from 'lucide-react';
import AIOperatingSystem from './AIOperatingSystem';

type ArkoLandingProps = {
  onOpenChat: () => void;
  onOpenContact: () => void;
};

const proofItems = ['Claro Chile', 'Entel', 'Pagos Honorarios Medicos Chile', 'Telecom', 'Salud', 'Logistica'];

const operatingInputs = ['Documentos', 'Usuarios', 'Sistemas legacy', 'Reglas internas'];
const operatingEngine = ['IA aplicada', 'OCR', 'APIs', 'Automatizacion', 'Reglas de negocio'];
const operatingOutputs = ['Decisiones', 'Dashboards', 'Trazabilidad', 'Ahorro operativo'];

const modules = [
  {
    icon: Bot,
    title: 'AI Agents',
    label: 'Interaccion inteligente',
    description: 'Asistentes conectados a datos, reglas y procesos reales para resolver consultas, ejecutar flujos y guiar usuarios.',
    impact: 'Menos dependencia de soporte manual.',
  },
  {
    icon: ScanSearch,
    title: 'Document Intelligence',
    label: 'OCR + clasificacion',
    description: 'Lectura, extraccion y validacion de informacion desde documentos masivos, contratos, respaldos y formularios.',
    impact: 'Menos digitacion y reproceso.',
  },
  {
    icon: Sparkles,
    title: 'Workflow Automation',
    label: 'Procesos ejecutables',
    description: 'Flujos automatizados con estados, reglas, alertas, aprobaciones y trazabilidad de punta a punta.',
    impact: 'Operacion mas rapida y controlada.',
  },
  {
    icon: Cable,
    title: 'Enterprise Integrations',
    label: 'Sistemas conectados',
    description: 'APIs, ERPs, CRMs, plataformas internas y sistemas externos trabajando como una sola operacion.',
    impact: 'Menos silos y doble trabajo.',
  },
  {
    icon: LineChart,
    title: 'Operational Dashboards',
    label: 'Control ejecutivo',
    description: 'Metricas vivas para entender productividad, errores, tiempos, cuellos de botella y cumplimiento operacional.',
    impact: 'Mejores decisiones en menos tiempo.',
  },
  {
    icon: ServerCog,
    title: 'Digital Growth Layer',
    label: 'Software a medida',
    description: 'Plataformas corporativas disenadas para procesos criticos, alto volumen y evolucion continua.',
    impact: 'Capacidad tecnologica propia.',
  },
];

const cases = [
  {
    sector: 'Telecomunicaciones',
    problem: 'Procesos documentales y comerciales con alto volumen, multiples validaciones y baja visibilidad operacional.',
    intervention: 'Automatizacion de flujos, integracion de sistemas y paneles de control para seguimiento ejecutivo.',
    result: 'Operacion mas trazable, menos tareas manuales y mayor velocidad de gestion.',
  },
  {
    sector: 'Salud y Honorarios Medicos',
    problem: 'Pagos, cartolas, reglas financieras y respaldos distribuidos en procesos complejos de conciliacion.',
    intervention: 'Motor operacional para reglas, calculo, documentacion, aprobaciones y visibilidad del ciclo completo.',
    result: 'Control financiero, reduccion de errores y procesos mas claros para equipos internos.',
  },
  {
    sector: 'Logistica y WMS',
    problem: 'Inventario, ubicaciones, movimientos y criterios FIFO/FEFO sin una capa inteligente de control.',
    intervention: 'Sistemas de gestion operacional con trazabilidad por ubicacion, reglas de movimiento y monitoreo.',
    result: 'Mayor orden operativo y mejor capacidad de decision sobre stock y ejecucion.',
  },
  {
    sector: 'Firma Digital y Documentos',
    problem: 'Ingreso masivo de archivos, validaciones manuales y procesos lentos para documentos criticos.',
    intervention: 'OCR, clasificacion, firma digital, validaciones automaticas y seguimiento del estado documental.',
    result: 'Menos friccion documental y tiempos de respuesta mas cortos.',
  },
];

const metrics = [
  { value: '+1M', label: 'documentos procesados', detail: 'Lectura, clasificacion y validacion documental.' },
  { value: '+100K', label: 'decisiones automatizadas', detail: 'Reglas y flujos ejecutados con trazabilidad.' },
  { value: 'x3', label: 'velocidad operacional', detail: 'Menos espera entre ingreso, revision y respuesta.' },
  { value: '-67%', label: 'error manual estimado', detail: 'Reduccion de digitacion y reprocesos repetitivos.' },
];

const methodology = ['Discovery', 'Architecture', 'Automation', 'AI Layer', 'Integration', 'Monitoring', 'Optimization'];
const techTags = ['OpenAI', 'Claude', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'APIs', 'OCR', 'RPA', 'AWS', 'Azure', 'Talend'];

const processOptions = [
  {
    id: 'documents',
    label: 'Gestion documental',
    automation: 0.72,
    errorReduction: 0.64,
    description: 'OCR, clasificacion, validacion y trazabilidad de documentos.',
    pain: 'Demasiado tiempo leyendo, ordenando y validando respaldos manualmente.',
    solution: 'Motor documental con OCR, reglas, alertas y dashboard ejecutivo.',
    outcome: 'Menos digitacion, menos reproceso y mayor trazabilidad documental.',
    deliverables: ['OCR + clasificacion', 'Validaciones automaticas', 'Repositorio trazable'],
  },
  {
    id: 'payments',
    label: 'Pagos y conciliacion',
    automation: 0.68,
    errorReduction: 0.58,
    description: 'Reglas de negocio, aprobaciones, cartolas y control financiero.',
    pain: 'Pagos, calculos y conciliaciones dependen de planillas o revision manual.',
    solution: 'Motor de reglas financieras, aprobaciones, cartolas y control de excepciones.',
    outcome: 'Ciclos de pago mas rapidos, menos errores y visibilidad financiera.',
    deliverables: ['Motor de reglas', 'Control de aprobaciones', 'Dashboard financiero'],
  },
  {
    id: 'support',
    label: 'Atencion interna',
    automation: 0.54,
    errorReduction: 0.42,
    description: 'ArkoAsistente conectado a procesos, datos y preguntas frecuentes.',
    pain: 'Equipos responden las mismas preguntas y pierden tiempo buscando informacion.',
    solution: 'Agente IA conectado a base documental, procesos internos y captura de leads.',
    outcome: 'Respuestas mas rapidas, soporte escalable y mejor experiencia de usuario.',
    deliverables: ['ArkoAsistente', 'Base de conocimiento', 'Captura de oportunidades'],
  },
  {
    id: 'operations',
    label: 'Operacion y workflow',
    automation: 0.61,
    errorReduction: 0.5,
    description: 'Estados, alertas, integraciones y seguimiento operacional.',
    pain: 'Procesos cruzan areas sin control claro de estados, responsables ni SLA.',
    solution: 'Workflow operacional con estados, integraciones, alertas y trazabilidad.',
    outcome: 'Operaciones mas visibles, responsables claros y menos cuellos de botella.',
    deliverables: ['Flujos automatizados', 'Integraciones API', 'Monitoreo operacional'],
  },
];

const implementationPlans = [
  {
    name: 'Diagnostico IA',
    description: 'Mapeamos procesos, estimamos ahorro y definimos una ruta ejecutiva.',
    items: ['Levantamiento operativo', 'Mapa de fricciones', 'Estimacion de impacto', 'Roadmap de automatizacion'],
  },
  {
    name: 'Piloto Inteligente',
    description: 'Implementamos un caso acotado para medir impacto real rapido.',
    items: ['Un proceso priorizado', 'Agente IA o automatizacion', 'Dashboard inicial', 'Medicion de ahorro'],
  },
  {
    name: 'Implementacion Enterprise',
    description: 'Escalamos la solucion con integraciones, control y mejora continua.',
    items: ['Integraciones corporativas', 'Motor de reglas', 'Trazabilidad completa', 'Soporte evolutivo'],
  },
];

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto mb-12 max-w-4xl">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-cyan-300/90">{eyebrow}</p>
      <h2 className="text-3xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function MiniNode({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ duration: 0.18 }}
      className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${active ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.14)]' : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-50'}`}
    >
      {label}
    </motion.div>
  );
}


export default function ArkoLanding({ onOpenChat, onOpenContact }: ArkoLandingProps) {
  const [selectedProcess, setSelectedProcess] = useState(processOptions[0]);
  const [monthlyVolume, setMonthlyVolume] = useState(4200);
  const [minutesPerCase, setMinutesPerCase] = useState(8);
  const [costPerHour, setCostPerHour] = useState(9500);

  const monthlyHours = Math.round((monthlyVolume * minutesPerCase) / 60);
  const recoveredHours = Math.round(monthlyHours * selectedProcess.automation);
  const monthlySavings = Math.round(recoveredHours * costPerHour);
  const annualSavings = monthlySavings * 12;
  const errorImpact = Math.round(selectedProcess.errorReduction * 100);
  const automationImpact = Math.round(selectedProcess.automation * 100);
  const formatCurrency = (value: number) => `$${new Intl.NumberFormat('es-CL').format(value)}`;

  return (
    <div className="min-h-screen overflow-hidden bg-[#041a36] text-white">
      <header className="sticky top-0 z-40 border-b border-cyan-300/20 bg-[#041a36]/84 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#hero" className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img src="/ArkoData.png" alt="ArkoData" className="h-12 w-12" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">ArkoData</p>
              <p className="hidden text-xs text-slate-500 sm:block">Intelligence Control Layer</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-slate-400 lg:flex">
            <a href="#procesos" className="transition-colors hover:text-white">Procesos</a>
            <a href="#modelo" className="transition-colors hover:text-white">Modelo</a>
            <a href="#modulos" className="transition-colors hover:text-white">Modulos</a>
            <a href="#impacto" className="transition-colors hover:text-white">Impacto</a>
            <a href="#planes" className="transition-colors hover:text-white">Planes</a>
            <a href="#contacto" className="transition-colors hover:text-white">Contacto</a>
          </nav>

          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.16)] transition-all hover:border-cyan-200/70 hover:bg-cyan-300/20"
          >
            Diagnostico
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main>
        <section id="hero" className="relative px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,195,255,0.28),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(0,102,255,0.28),transparent_30%),radial-gradient(circle_at_55%_78%,rgba(45,212,191,0.14),transparent_34%),linear-gradient(180deg,#041a36_0%,#06315f_48%,#084b86_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.055)_1px,transparent_1px)] bg-[size:72px_72px] opacity-50" />
          <div className="relative mx-auto max-w-7xl space-y-14">
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: 'easeOut' }}>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-200/35 bg-cyan-300/[0.14] px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-50 shadow-[0_0_34px_rgba(34,211,238,0.18)]">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
                Enterprise AI Operations
              </div>
              <h1 className="max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
                Automatiza procesos, reduce costos y convierte tu operacion en una plataforma inteligente.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Implementamos IA, agentes inteligentes, automatizacion documental, integraciones y dashboards para que empresas operen con menos friccion, menos error y mayor control.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={onOpenContact}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_22px_75px_rgba(34,211,238,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(34,211,238,0.48)]"
                >
                  Calcular ahorro operativo
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onOpenChat}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-cyan-200/30 bg-cyan-300/[0.09] px-7 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:border-cyan-200/60 hover:bg-cyan-300/18"
                >
                  <MessageCircle className="h-5 w-5 text-cyan-200" />
                  Hablar con ArkoAsistente
                </button>
              </div>
              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {['Ahorro medible', 'IA aplicada', 'Control operacional'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <AIOperatingSystem />
          </div>
        </section>

        <section className="group border-y border-cyan-300/20 bg-[#05305d] px-4 py-6 transition-all duration-300 hover:border-cyan-200/45 hover:bg-[#07477f] hover:shadow-[inset_0_0_50px_rgba(34,211,238,0.09)] sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-cyan-100/45 transition-colors duration-300 group-hover:text-cyan-100">Experiencia aplicada en operaciones reales</p>
            <div className="flex flex-wrap gap-3">
              {proofItems.map((item) => (
                <motion.span
                  key={item}
                  whileHover={{ y: -4, scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="cursor-default rounded-full border border-cyan-300/25 bg-cyan-300/[0.08] px-4 py-2 text-sm font-semibold text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all duration-200 hover:border-cyan-100/80 hover:bg-cyan-200/20 hover:text-white hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        <section id="procesos" className="relative bg-[#041a36] px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.12),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Elige Tu Proceso"
              title="Muestra al cliente donde puede ganar tiempo, plata y control con IA."
              description="Cada empresa tiene fricciones distintas. ArkoData parte identificando el proceso correcto, estimando impacto y transformandolo en una automatizacion medible."
            />
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
              <div className="grid gap-3">
                {processOptions.map((process) => (
                  <button
                    key={process.id}
                    onClick={() => setSelectedProcess(process)}
                    className={`group rounded-[1.4rem] border p-5 text-left transition-all hover:-translate-y-1 ${selectedProcess.id === process.id ? 'border-cyan-200/70 bg-cyan-300/16 shadow-[0_0_34px_rgba(34,211,238,0.2)]' : 'border-cyan-300/14 bg-white/[0.045] hover:border-cyan-300/40 hover:bg-cyan-300/10'}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{process.label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{process.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 flex-shrink-0 text-cyan-200 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>

              <motion.div
                key={selectedProcess.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="overflow-hidden rounded-[2rem] border border-cyan-300/24 bg-[linear-gradient(145deg,#05284f,#07396f_52%,#0a5cab)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)]"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_0.78fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Proceso seleccionado</p>
                    <h3 className="mt-3 text-3xl font-semibold text-white">{selectedProcess.label}</h3>
                    <div className="mt-6 grid gap-4">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Dolor operativo</p>
                        <p className="mt-2 text-sm leading-7 text-slate-200">{selectedProcess.pain}</p>
                      </div>
                      <div className="rounded-2xl border border-cyan-300/22 bg-cyan-300/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Como lo resolvemos</p>
                        <p className="mt-2 text-sm leading-7 text-cyan-50">{selectedProcess.solution}</p>
                      </div>
                      <div className="rounded-2xl border border-emerald-300/22 bg-emerald-300/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Resultado esperado</p>
                        <p className="mt-2 text-sm leading-7 text-emerald-50">{selectedProcess.outcome}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/45 p-5">
                    <p className="text-sm font-semibold text-white">Impacto estimado</p>
                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="mb-2 flex justify-between text-sm text-slate-300"><span>Automatizable</span><span>{Math.round(selectedProcess.automation * 100)}%</span></div>
                        <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" style={{ width: `${Math.round(selectedProcess.automation * 100)}%` }} /></div>
                      </div>
                      <div>
                        <div className="mb-2 flex justify-between text-sm text-slate-300"><span>Reduccion de error</span><span>-{Math.round(selectedProcess.errorReduction * 100)}%</span></div>
                        <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" style={{ width: `${Math.round(selectedProcess.errorReduction * 100)}%` }} /></div>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3">
                      {selectedProcess.deliverables.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-medium text-slate-100">
                          {item}
                        </div>
                      ))}
                    </div>
                    <a href="#contacto" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-cyan-100">
                      Simular ahorro
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="modelo" className="relative bg-[#041a36] px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.055),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Operating Model"
              title="No construimos software aislado. Disenamos sistemas operacionales inteligentes."
              description="ArkoData funciona como una capa de orquestacion sobre procesos existentes: captura entradas, ejecuta reglas, conecta sistemas y entrega decisiones visibles."
            />
            <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr_1fr] lg:items-stretch">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Entradas</p>
                <div className="space-y-3">{operatingInputs.map((item) => <MiniNode key={item} label={item} />)}</div>
              </div>
              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[linear-gradient(145deg,rgba(34,211,238,0.11),rgba(255,255,255,0.035),rgba(139,92,246,0.08))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_48%)]" />
                <div className="relative">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 ring-1 ring-cyan-300/25">
                      <BrainCircuit className="h-6 w-6 text-cyan-200" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Motor ArkoData</p>
                      <p className="text-xl font-semibold text-white">IA + reglas + integracion</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {operatingEngine.map((item, index) => <MiniNode key={item} label={item} active={index === 0 || index === 3} />)}
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Salidas</p>
                <div className="space-y-3">{operatingOutputs.map((item) => <MiniNode key={item} label={item} />)}</div>
              </div>
            </div>
          </div>
        </section>

        <section id="modulos" className="bg-[#06315f] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Intelligence Modules"
              title="Servicios presentados como modulos de plataforma."
              description="Cada capacidad existe para resolver una friccion operacional concreta: interaccion, documentos, flujos, integraciones, visibilidad y crecimiento digital."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    className="group rounded-[1.75rem] border border-cyan-300/18 bg-[#07396f] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.16)] transition-all hover:-translate-y-1 hover:border-cyan-200/55 hover:bg-[#0a4f92] hover:shadow-[0_24px_75px_rgba(34,211,238,0.18)]"
                  >
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                        <Icon className="h-6 w-6 text-cyan-200" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{module.label}</span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-white">{module.title}</h3>
                    <p className="mt-4 min-h-[96px] text-sm leading-7 text-slate-300">{module.description}</p>
                    <div className="mt-6 border-t border-white/10 pt-4 text-sm font-semibold text-cyan-100">{module.impact}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="impacto" className="bg-[#041a36] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Impact Cases"
              title="Experiencia donde escala, trazabilidad y velocidad no admiten improvisacion."
              description="La propuesta no es IA como adorno. Es tecnologia aplicada a operaciones con volumen, reglas, usuarios, documentos e integraciones reales."
            />
            <div className="grid gap-5 lg:grid-cols-2">
              {cases.map((item, index) => (
                <motion.article
                  key={item.sector}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="group rounded-[2rem] border border-cyan-300/18 bg-[linear-gradient(145deg,#07396f,#05284f)] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-1 hover:border-cyan-200/45 hover:shadow-[0_25px_80px_rgba(34,211,238,0.16)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/85 transition-colors group-hover:text-cyan-100">{item.sector}</p>
                  <div className="mt-6 grid gap-4">
                    <motion.div
                      whileHover={{ x: 6, scale: 1.015 }}
                      transition={{ duration: 0.16 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-all group-hover:border-cyan-300/28 group-hover:bg-cyan-300/[0.07] hover:border-cyan-200/55 hover:bg-cyan-300/12 hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]"
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 transition-colors group-hover:text-cyan-200">Problema</p>
                      <p className="text-sm leading-7 text-slate-300 transition-colors group-hover:text-slate-100">{item.problem}</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 6, scale: 1.015 }}
                      transition={{ duration: 0.16 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-all group-hover:border-sky-300/28 group-hover:bg-sky-300/[0.07] hover:border-sky-200/55 hover:bg-sky-300/12 hover:shadow-[0_0_28px_rgba(56,189,248,0.16)]"
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 transition-colors group-hover:text-sky-200">Intervencion ArkoData</p>
                      <p className="text-sm leading-7 text-slate-300 transition-colors group-hover:text-slate-100">{item.intervention}</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 6, scale: 1.015 }}
                      transition={{ duration: 0.16 }}
                      className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 transition-all group-hover:border-emerald-300/35 group-hover:bg-emerald-300/12 hover:border-emerald-200/60 hover:bg-emerald-300/18 hover:shadow-[0_0_30px_rgba(110,231,183,0.18)]"
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200 transition-colors group-hover:text-emerald-200">Resultado</p>
                      <p className="text-sm leading-7 text-cyan-50">{item.result}</p>
                    </motion.div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#06315f] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-300/22 bg-[#07396f] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.2)] sm:p-8">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.36em] text-cyan-300/90">Metrics Layer</p>
                <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.025em] text-white sm:text-4xl">Impacto medible visto como dashboard operacional.</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-400">Los numeros deben contar control, no decoracion: volumen procesado, decisiones automatizadas, velocidad y reduccion de error.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-[1.5rem] border border-cyan-300/18 bg-[#05284f] p-5 transition-all hover:-translate-y-1 hover:border-cyan-200/45 hover:bg-[#084b86]">
                  <p className="text-5xl font-bold tracking-tight text-white">{metric.value}</p>
                  <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">{metric.label}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tecnologia" className="bg-[#041a36] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Technology Mesh"
              title="Arquitectura tecnica pensada para integrarse, escalar y evolucionar."
              description="El stack se selecciona por capacidad real de integracion, rendimiento, trazabilidad, seguridad y mantenimiento en escenarios empresariales."
            />
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="rounded-[2rem] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(7,57,111,0.72),rgba(4,26,54,0.85))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition-all duration-300 hover:border-cyan-200/45 hover:shadow-[0_28px_90px_rgba(34,211,238,0.12)]">
                <div className="space-y-3">
                  {methodology.map((step, index) => (
                    <motion.div
                      key={step}
                      whileHover={{ x: 8, scale: 1.02 }}
                      transition={{ duration: 0.16 }}
                      className="group flex items-center gap-4 rounded-2xl border border-cyan-300/12 bg-slate-950/60 p-4 transition-all hover:border-cyan-200/45 hover:bg-cyan-300/12 hover:shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-sm font-semibold text-slate-950 shadow-[0_0_18px_rgba(255,255,255,0.12)] transition-all group-hover:bg-cyan-200 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.32)]">{index + 1}</span>
                      <span className="font-semibold text-slate-100 transition-colors group-hover:text-white">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="group relative min-h-[420px] overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-[linear-gradient(145deg,#05284f,#07396f_55%,#0a5cab)] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.22),0_0_60px_rgba(34,211,238,0.12)] transition-all duration-300 hover:border-cyan-200/55 hover:shadow-[0_34px_110px_rgba(34,211,238,0.2)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2),transparent_38%),linear-gradient(rgba(125,211,252,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.035)_1px,transparent_1px)] bg-[size:auto,44px_44px,44px_44px]" />
                <motion.div animate={{ x: ['-25%', '125%'], opacity: [0, 0.7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-0 h-full w-28 rotate-12 bg-gradient-to-r from-transparent via-cyan-100/14 to-transparent" />
                <div className="relative flex min-h-[370px] items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute flex h-28 w-28 items-center justify-center rounded-full border border-cyan-200/45 bg-cyan-300/16 shadow-[0_0_45px_rgba(34,211,238,0.28)]">
                    <Database className="h-9 w-9 text-cyan-200" />
                  </motion.div>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }} className="absolute h-64 w-64 rounded-full border border-cyan-200/16" />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 48, repeat: Infinity, ease: 'linear' }} className="absolute h-[22rem] w-[22rem] rounded-full border border-cyan-200/10" />
                  {[0, 1, 2, 3].map((line) => (
                    <motion.div
                      key={line}
                      animate={{ opacity: [0.2, 0.85, 0.2] }}
                      transition={{ duration: 2.4 + line * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute h-px w-[82%] bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent"
                      style={{ transform: `rotate(${line * 45}deg)` }}
                    />
                  ))}
                  {techTags.map((tag, index) => {
                    const angle = (index / techTags.length) * Math.PI * 2;
                    const radius = index % 2 === 0 ? 142 : 184;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.12, y: y - 8, zIndex: 20 }}
                        animate={{ x, y: [y, y + (index % 2 ? 7 : -7), y] }}
                        transition={{ duration: 4 + index * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute rounded-full border border-cyan-200/25 bg-slate-950/82 px-4 py-2 text-sm font-semibold text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-md transition-colors hover:border-cyan-100/75 hover:bg-cyan-300/18 hover:shadow-[0_0_34px_rgba(34,211,238,0.34)]"
                      >
                        {tag}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="planes" className="bg-[#06315f] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Ruta De Trabajo"
              title="Tres formas concretas de empezar a trabajar con ArkoData."
              description="El cliente no siempre sabe por donde partir. Le damos una ruta clara: diagnosticar, pilotear y escalar con medicion real de impacto."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {implementationPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="group rounded-[2rem] border border-cyan-300/18 bg-[linear-gradient(145deg,#07396f,#05284f)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-1 hover:border-cyan-200/55 hover:bg-[#084b86] hover:shadow-[0_28px_95px_rgba(34,211,238,0.18)]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">0{index + 1}</span>
                    <Sparkles className="h-5 w-5 text-cyan-200 transition-transform group-hover:rotate-12" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-4 min-h-[72px] text-sm leading-7 text-slate-300">{plan.description}</p>
                  <div className="mt-6 space-y-3">
                    {plan.items.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/42 px-4 py-3 text-sm text-slate-100 transition-all group-hover:border-cyan-300/22 group-hover:bg-cyan-300/8">
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="bg-[#06315f] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.2rem] border border-cyan-200/30 bg-[linear-gradient(135deg,#05284f,#07396f_55%,#0a5cab)] shadow-[0_35px_120px_rgba(34,211,238,0.18)] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-cyan-300/90">Next Step</p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-5xl">Calcula cuanto podria recuperar tu operacion al optimizar un proceso.</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">Elige un proceso, ajusta volumen, tiempo y costo operativo. El simulador estima en linea horas recuperadas, ahorro mensual y potencial de automatizacion con ArkoData.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={onOpenContact}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_20px_70px_rgba(34,211,238,0.32)] transition-all hover:-translate-y-0.5"
                >
                  Solicitar diagnostico
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onOpenChat}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.045] px-7 py-4 text-base font-bold text-white transition-all hover:border-cyan-300/30 hover:bg-cyan-300/10"
                >
                  <MessageCircle className="h-5 w-5 text-cyan-200" />
                  Hablar con ArkoAsistente
                </button>
              </div>
            </div>
            <div className="border-t border-white/10 bg-slate-950/45 p-6 lg:border-l lg:border-t-0 sm:p-8">
              <div className="rounded-[1.9rem] border border-cyan-200/18 bg-white/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-md">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Simulador ROI</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Economia operacional estimada</h3>
                  </div>
                  <LineChart className="h-6 w-6 text-cyan-200" />
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {processOptions.map((process) => (
                    <button
                      key={process.id}
                      onClick={() => setSelectedProcess(process)}
                      className={`rounded-2xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5 ${selectedProcess.id === process.id ? 'border-cyan-200/70 bg-cyan-300/18 shadow-[0_0_28px_rgba(34,211,238,0.18)]' : 'border-white/10 bg-slate-950/45 hover:border-cyan-300/35 hover:bg-cyan-300/10'}`}
                    >
                      <p className="text-sm font-semibold text-white">{process.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">{process.description}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                  <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/48 p-4">
                    {[
                      { label: 'Casos al mes', value: monthlyVolume, min: 500, max: 20000, step: 100, setter: setMonthlyVolume, suffix: '' },
                      { label: 'Minutos por caso', value: minutesPerCase, min: 2, max: 45, step: 1, setter: setMinutesPerCase, suffix: ' min' },
                      { label: 'Costo hora equipo', value: costPerHour, min: 4000, max: 35000, step: 500, setter: setCostPerHour, suffix: '/h' },
                    ].map((control) => (
                      <div key={control.label}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium text-slate-300">{control.label}</span>
                          <span className="font-semibold text-cyan-100">{control.label === 'Costo hora equipo' ? formatCurrency(control.value) : new Intl.NumberFormat('es-CL').format(control.value)}{control.suffix}</span>
                        </div>
                        <input
                          type="range"
                          min={control.min}
                          max={control.max}
                          step={control.step}
                          value={control.value}
                          onChange={(event) => control.setter(Number(event.target.value))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-cyan-950 accent-cyan-300"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[1.5rem] border border-cyan-200/18 bg-[linear-gradient(180deg,rgba(34,211,238,0.13),rgba(2,8,23,0.48))] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">Resultado en linea</p>
                    <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{formatCurrency(monthlySavings)}</p>
                    <p className="mt-1 text-sm text-slate-300">ahorro mensual estimado</p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                        <p className="text-xs text-slate-400">Horas recuperadas</p>
                        <p className="mt-1 text-xl font-semibold text-white">{new Intl.NumberFormat('es-CL').format(recoveredHours)}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                        <p className="text-xs text-slate-400">Ahorro anual</p>
                        <p className="mt-1 text-xl font-semibold text-white">{formatCurrency(annualSavings)}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                        <p className="text-xs text-slate-400">Automatizable</p>
                        <p className="mt-1 text-xl font-semibold text-cyan-100">{automationImpact}%</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                        <p className="text-xs text-slate-400">Menos error</p>
                        <p className="mt-1 text-xl font-semibold text-emerald-200">-{errorImpact}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-cyan-300/20 bg-[#041a36] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-950 p-1.5 ring-1 ring-white/10">
              <img src="/ArkoData.png" alt="ArkoData" className="h-11 w-11 rounded-full object-cover" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">ArkoData</p>
              <p className="text-sm text-slate-500">IA aplicada a procesos empresariales criticos</p>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-2 lg:text-right">
            <a href="mailto:contacto@arkodata.cl" className="transition-colors hover:text-white">contacto@arkodata.cl</a>
            <a href="https://wa.me/56933553024" className="transition-colors hover:text-white">+56 9 3355 3024</a>
            <a href="#hero" className="transition-colors hover:text-white">Inicio</a>
            <a href="#contacto" className="transition-colors hover:text-white">Solicitar diagnostico</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
