import { motion, useReducedMotion } from 'framer-motion';
import { Bot, BrainCircuit, CheckCircle2, FileText, ShieldCheck, Sparkles } from 'lucide-react';

type FlowStep = {
  title: string;
  description: string;
  icon: typeof FileText;
  status: string;
};

const flowSteps: FlowStep[] = [
  {
    title: 'Documento recibido',
    description: 'Ingreso documental desde correo, portal o carga masiva.',
    icon: FileText,
    status: 'Entrada activa',
  },
  {
    title: 'IA valida',
    description: 'Clasificación, extracción y revisión de consistencia.',
    icon: BrainCircuit,
    status: 'Validación en curso',
  },
  {
    title: 'Regla decide',
    description: 'Motor de reglas aplica criterios de negocio y excepciones.',
    icon: Sparkles,
    status: 'Decisión automática',
  },
  {
    title: 'Ejecutivo controla',
    description: 'Trazabilidad, alertas y visibilidad operacional en dashboard.',
    icon: ShieldCheck,
    status: 'Control ejecutivo',
  },
];

const demoMetrics = [
  { label: 'Documentos validados', value: '1.284', accent: 'text-cyan-100' },
  { label: 'Decisiones automatizadas', value: '18.240', accent: 'text-emerald-200' },
  { label: 'Confianza de IA', value: '97,4%', accent: 'text-sky-200' },
  { label: 'Ahorro referencial', value: '$18,6M', accent: 'text-cyan-50' },
];

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3.5 backdrop-blur-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className={`mt-2 text-lg font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

export default function AIOperatingSystem() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-[760px]"
    >
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_70%_25%,rgba(34,211,238,0.16),transparent_42%)] blur-3xl" />

      <div className="relative overflow-hidden rounded-[2.2rem] border border-cyan-300/22 bg-[linear-gradient(145deg,rgba(7,57,111,0.92),rgba(4,26,54,0.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-55" />

        <div className="relative flex flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-[1.7rem] border border-white/10 bg-slate-950/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200/70">ArkoData Flow</p>
              <p className="mt-1 text-base font-semibold text-white">Orquestación operacional con IA</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/22 bg-cyan-300/10 px-3 py-1.5 text-[11px] font-medium text-cyan-100">
              <span className="rounded-full bg-cyan-300/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-50">Demo operacional</span>
              <div className="flex items-center gap-2">
                <motion.span
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-2 w-2 rounded-full bg-emerald-300"
                />
                Flujo activo
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {demoMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="rounded-[1.8rem] border border-cyan-300/16 bg-[#041a36]/70 p-4 sm:p-5">
              <div className="grid gap-3">
                {flowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="relative">
                      <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : index * 0.08 }}
                        className="group rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4 transition-all hover:border-cyan-300/40 hover:bg-cyan-300/[0.08]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-300/28 bg-cyan-300/10 text-cyan-100">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <h3 className="text-base font-semibold text-white">{step.title}</h3>
                              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100">
                                {step.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-200">{step.description}</p>
                          </div>
                        </div>
                      </motion.div>

                      {index < flowSteps.length - 1 && (
                        <div className="flex justify-center py-2">
                          <div className="relative h-8 w-px bg-gradient-to-b from-cyan-300/70 to-cyan-300/10">
                            <motion.span
                              animate={prefersReducedMotion ? undefined : { y: [0, 20, 0], opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                              className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.6)]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/38 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200/70">Control ejecutivo</p>
                  <p className="mt-1 text-base font-semibold text-white">Vista operacional</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/28 bg-cyan-300/10">
                  <Bot className="h-5 w-5 text-cyan-100" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { label: 'Documentos recibidos', value: 'Entrada masiva detectada', width: '84%' },
                  { label: 'Validación de IA', value: 'Extracción y consistencia', width: '71%' },
                  { label: 'Regla de negocio', value: 'Aprobación automática', width: '93%' },
                  { label: 'Control ejecutivo', value: 'Dashboard y excepciones', width: '68%' },
                ].map((item, index) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-100">{item.label}</span>
                      <span className="text-xs text-cyan-100">{item.value}</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={prefersReducedMotion ? false : { width: 0 }}
                        animate={prefersReducedMotion ? undefined : { width: item.width }}
                        transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.12 * index }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400"
                        style={prefersReducedMotion ? { width: item.width } : undefined}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-6 text-slate-300">
                Flujo demostrativo de cómo ArkoData convierte una entrada documental en una operación trazable, automatizada y medible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
