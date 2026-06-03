import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TriangleAlert as AlertTriangle, ArrowUpRight, Bot, Brain, CircleCheck as CheckCircle, ChevronRight, Circle, Clock, Cpu, FileCheck, FileText, FlameKindling, GitBranch, Globe, Hash, Layers, LayoutDashboard, ChartLine as LineChart, MessageSquare, Network, ShieldCheck, Sparkles, Terminal, TrendingUp, Zap } from 'lucide-react';

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0, duration = 1800 }: {
  target: number; prefix?: string; suffix?: string; decimals?: number; duration?: number;
}) {
  const [current, setCurrent] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCurrent(parseFloat((target * ease).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString('es-CL')}{suffix}
    </span>
  );
}

// ─── Live Pulse ──────────────────────────────────────────────────────────────
function LivePulse({ color = 'bg-emerald-400', size = 'w-2 h-2' }: { color?: string; size?: string }) {
  return (
    <span className="relative flex items-center justify-center">
      <motion.span
        animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute rounded-full ${size} ${color} opacity-60`}
      />
      <span className={`rounded-full ${size} ${color} shadow-[0_0_8px_currentColor]`} />
    </span>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#22d3ee', height = 32 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * height}`).join(' ');
  const fillPts = `0,${height} ${pts} ${w},${height}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#sg-${color.replace('#', '')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── AI Status Bar ────────────────────────────────────────────────────────────
function AIStatusBar() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, []);

  const events = [
    'Procesando 284 documentos...',
    'Decision automatizada: aprobado',
    'Riesgo detectado en flujo #A-441',
    'Conciliacion completada: $42.8M',
    'Modelo actualizado con nuevas reglas',
    'OCR: extraccion de 1.2k campos',
  ];

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-full border border-cyan-300/20 bg-slate-950/60 px-3 py-1.5 backdrop-blur-md">
      <LivePulse color="bg-cyan-400" size="w-1.5 h-1.5" />
      <AnimatePresence mode="wait">
        <motion.span
          key={tick}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32 }}
          className="truncate text-[10px] font-medium text-cyan-200/80"
        >
          {events[tick % events.length]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ─── ArkoAsistente Intelligence Panel ────────────────────────────────────────
function ArkoAsistentePanel() {
  const [activeAction, setActiveAction] = useState<number | null>(null);

  const recommendations = [
    { id: 1, priority: 'ALTA', label: 'Aprobar 14 facturas pendientes', saving: '$8.4M', icon: FileCheck, color: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/25' },
    { id: 2, priority: 'MEDIA', label: 'Revisar 3 flujos con latencia alta', saving: '2.4h/dia', icon: Clock, color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/25' },
    { id: 3, priority: 'ALTA', label: 'Validar documentos OCR batch #88', saving: '340 docs', icon: FileText, color: 'text-sky-300', bg: 'bg-sky-400/10 border-sky-400/25' },
    { id: 4, priority: 'BAJA', label: 'Optimizar regla de conciliacion', saving: '-12% error', icon: GitBranch, color: 'text-cyan-300', bg: 'bg-cyan-400/10 border-cyan-400/25' },
  ];

  const insights = [
    { label: 'Confianza IA', value: 97.4, unit: '%', color: 'bg-emerald-400' },
    { label: 'Decisiones auto', value: 18240, unit: '', color: 'bg-cyan-400' },
    { label: 'Ahorro estimado', value: 18.6, unit: 'M/mes', color: 'bg-sky-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-cyan-300/25 bg-[linear-gradient(145deg,rgba(7,57,111,0.9),rgba(4,26,54,0.95))] shadow-[0_32px_100px_rgba(0,0,0,0.4),0_0_60px_rgba(34,211,238,0.08)] backdrop-blur-xl"
    >
      {/* Glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.12),transparent_40%)]" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/12">
            <Brain className="h-4.5 w-4.5 text-cyan-200" style={{ width: 18, height: 18 }} />
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-300"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-200/60">ArkoAsistente AI</p>
            <p className="text-sm font-semibold text-white">Intelligence Panel</p>
          </div>
        </div>
        <AIStatusBar />
      </div>

      <div className="p-5 space-y-4">
        {/* Insight KPIs */}
        <div className="grid grid-cols-3 gap-2">
          {insights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/8 bg-slate-950/50 p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
              <p className="mt-1.5 text-lg font-bold text-white leading-tight">
                {item.label === 'Confianza IA'
                  ? <><AnimatedCounter target={97.4} suffix="%" decimals={1} /></>
                  : item.label === 'Decisiones auto'
                  ? <AnimatedCounter target={18240} />
                  : <AnimatedCounter target={18.6} suffix="M" decimals={1} />
                }
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: item.label === 'Confianza IA' ? '97%' : item.label === 'Decisiones auto' ? '82%' : '74%' }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recommended actions */}
        <div>
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Acciones recomendadas por IA</p>
          <div className="space-y-2">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <motion.button
                  key={rec.id}
                  whileHover={{ x: 4, scale: 1.01 }}
                  onClick={() => setActiveAction(activeAction === rec.id ? null : rec.id)}
                  className={`w-full rounded-2xl border px-3.5 py-2.5 text-left transition-all ${rec.bg} hover:shadow-[0_0_18px_rgba(34,211,238,0.1)]`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 flex-shrink-0 ${rec.color}`} />
                      <span className="text-xs font-medium text-slate-200">{rec.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${rec.color}`}>{rec.saving}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                        rec.priority === 'ALTA' ? 'bg-red-500/20 text-red-300' :
                        rec.priority === 'MEDIA' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>{rec.priority}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* AI Confidence footer */}
        <div className="flex items-center justify-between rounded-2xl border border-cyan-300/15 bg-cyan-300/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            <span className="text-xs text-cyan-200/70">ArkoAsistente monitoreando en tiempo real</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 12 + i * 3, 4] }}
                transition={{ duration: 0.8 + i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.5 rounded-full bg-cyan-400"
                style={{ height: 4 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Financial Intelligence Panel ────────────────────────────────────────────
function FinancialPanel() {
  const trend = [42, 58, 51, 72, 65, 88, 76, 94, 88, 102, 96, 118];
  const cashflow = [64, 72, 58, 80, 74, 90, 84, 96];

  const kpis = [
    { label: 'Revenue Ops', value: 128.4, suffix: 'M', color: 'text-cyan-100', trend: '+14.2%', up: true },
    { label: 'Ahorro IA/mes', value: 18.6, suffix: 'M', color: 'text-emerald-200', trend: '+8.7%', up: true },
    { label: 'Riesgo', value: 3.2, suffix: '%', color: 'text-sky-200', trend: '-1.4pp', up: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-cyan-300/20 bg-[linear-gradient(145deg,rgba(5,40,79,0.92),rgba(4,26,54,0.96))] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.1),transparent_40%)]" />

      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10">
            <LineChart className="h-4 w-4 text-sky-300" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-sky-300/60">Financial Intelligence</p>
            <p className="text-sm font-semibold text-white">Revenue Operations</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1">
          <LivePulse color="bg-emerald-400" size="w-1.5 h-1.5" />
          <span className="text-[10px] font-bold text-emerald-300">Live</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-white/8 bg-slate-950/50 p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">{k.label}</p>
              <p className={`mt-1.5 text-base font-bold leading-none ${k.color}`}>
                $<AnimatedCounter target={k.value} decimals={1} />{k.suffix}
              </p>
              <div className={`mt-1.5 flex items-center gap-1 text-[10px] font-semibold ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp className="h-3 w-3" style={{ transform: k.up ? 'none' : 'scaleY(-1)' }} />
                {k.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-300">Flujo financiero inteligente</p>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">+24.8%</span>
          </div>
          <Sparkline data={trend} color="#22d3ee" height={40} />
        </div>

        {/* Decision queue */}
        <div className="space-y-1.5">
          {[
            { label: 'Honorarios Batch #441', value: '$42.8M', status: 'OK', statusColor: 'text-emerald-300 bg-emerald-400/15' },
            { label: 'Documentos validados', value: '1.284', status: 'IA', statusColor: 'text-cyan-300 bg-cyan-400/15' },
            { label: 'Riesgo operativo', value: 'Bajo', status: 'Live', statusColor: 'text-sky-300 bg-sky-400/15' },
          ].map((row) => (
            <motion.div
              key={row.label}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between rounded-xl border border-white/8 bg-slate-950/60 px-3 py-2"
            >
              <p className="text-xs text-slate-300">{row.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white">{row.value}</p>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${row.statusColor}`}>{row.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Process Monitoring Panel ─────────────────────────────────────────────────
function ProcessMonitoringPanel() {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = ['Activos', 'Alertas', 'Aprobaciones'];

  const processes = [
    { name: 'OCR Batch #88', progress: 84, status: 'running', docs: 284, color: 'bg-cyan-400' },
    { name: 'Conciliacion Mes', progress: 97, status: 'done', docs: 1284, color: 'bg-emerald-400' },
    { name: 'Firma Digital Q3', progress: 61, status: 'running', docs: 440, color: 'bg-sky-400' },
    { name: 'Validacion Honorarios', progress: 43, status: 'pending', docs: 92, color: 'bg-amber-400' },
  ];

  const alerts = [
    { level: 'high', msg: 'Flujo #A-441: latencia > 3s detectada', time: '2m ago' },
    { level: 'medium', msg: 'Regla de negocio N-14 requiere revision', time: '18m ago' },
    { level: 'low', msg: 'API Entel: timeout esporadico registrado', time: '1h ago' },
  ];

  const approvals = [
    { label: 'Facturas Claro Chile', count: 14, value: '$8.4M', urgent: true },
    { label: 'Honorarios Medicos', count: 7, value: '$2.1M', urgent: false },
    { label: 'Contratos Logistica', count: 3, value: '$540K', urgent: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-cyan-300/20 bg-[linear-gradient(145deg,rgba(7,57,111,0.88),rgba(4,26,54,0.94))] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_10%_90%,rgba(34,211,238,0.07),transparent_35%)]" />

      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
            <Activity className="h-4 w-4 text-cyan-300" />
          </div>
          <p className="text-sm font-semibold text-white">Process Monitor</p>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(i)}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all ${
                selectedTab === i
                  ? 'bg-cyan-400/20 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {selectedTab === 0 && (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2.5">
              {processes.map((p) => (
                <div key={p.name} className="space-y-1.5 rounded-xl border border-white/8 bg-slate-950/50 px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <LivePulse
                        color={p.status === 'running' ? 'bg-cyan-400' : p.status === 'done' ? 'bg-emerald-400' : 'bg-amber-400'}
                        size="w-1.5 h-1.5"
                      />
                      <span className="text-xs font-medium text-slate-200">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{p.docs} docs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className={`h-full rounded-full ${p.color}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">{p.progress}%</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {selectedTab === 1 && (
            <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {alerts.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 ${
                  a.level === 'high' ? 'border-red-500/25 bg-red-500/8' :
                  a.level === 'medium' ? 'border-amber-500/25 bg-amber-500/8' :
                  'border-slate-500/25 bg-slate-500/8'
                }`}>
                  <AlertTriangle className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${
                    a.level === 'high' ? 'text-red-400' : a.level === 'medium' ? 'text-amber-400' : 'text-slate-400'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-200">{a.msg}</p>
                    <p className="text-[10px] text-slate-500">{a.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {selectedTab === 2 && (
            <motion.div key="approvals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {approvals.map((a, i) => (
                <div key={i} className={`flex items-center justify-between rounded-xl border px-3.5 py-3 ${
                  a.urgent ? 'border-cyan-400/30 bg-cyan-400/8' : 'border-white/8 bg-slate-950/50'
                }`}>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{a.label}</p>
                    <p className="text-[10px] text-slate-500">{a.count} documentos pendientes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{a.value}</span>
                    {a.urgent && <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300">URGENTE</span>}
                  </div>
                </div>
              ))}
              <div className="mt-3 rounded-xl border border-cyan-300/20 bg-cyan-300/8 px-4 py-2.5 text-center">
                <p className="text-xs font-semibold text-cyan-200">24 aprobaciones pendientes · $11.04M en cola</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Document Intelligence Panel ─────────────────────────────────────────────
function DocumentIntelligencePanel() {
  const barData = [48, 72, 54, 88, 76, 92, 68, 96, 84, 100, 90, 114];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-cyan-300/18 bg-[linear-gradient(145deg,rgba(4,26,54,0.95),rgba(7,57,111,0.85))] shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.09),transparent_38%)]" />

      <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10">
            <FileText className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="text-sm font-semibold text-white">Document Intelligence</p>
        </div>
        <span className="text-[10px] font-bold text-emerald-300">+1M docs procesados</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'OCR Precision', value: 99.1, suffix: '%', color: 'text-emerald-300' },
            { label: 'Procesados hoy', value: 4820, suffix: '', color: 'text-cyan-300' },
            { label: 'En cola', value: 284, suffix: '', color: 'text-amber-300' },
            { label: 'Validados IA', value: 97.4, suffix: '%', color: 'text-sky-300' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-slate-950/50 px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">{s.label}</p>
              <p className={`mt-1 text-base font-bold ${s.color}`}>
                <AnimatedCounter target={s.value} suffix={s.suffix} decimals={s.suffix === '%' ? 1 : 0} />
              </p>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div className="rounded-xl border border-white/8 bg-slate-950/50 p-3">
          <p className="mb-2.5 text-xs font-semibold text-slate-400">Volumen documental (12h)</p>
          <div className="flex items-end gap-1 h-10">
            {barData.map((v, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(v / 114) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.05 * i }}
                className="flex-1 rounded-sm bg-gradient-to-t from-cyan-600 to-cyan-300 opacity-80"
              />
            ))}
          </div>
        </div>

        {/* Doc type breakdown */}
        {[
          { type: 'Facturas', count: 1840, pct: 38, color: 'bg-cyan-400' },
          { type: 'Contratos', count: 920, pct: 19, color: 'bg-sky-400' },
          { type: 'Honorarios', count: 680, pct: 14, color: 'bg-emerald-400' },
        ].map((d) => (
          <div key={d.type} className="flex items-center gap-3">
            <span className="w-20 text-[10px] text-slate-400 flex-shrink-0">{d.type}</span>
            <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.pct}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className={`h-full rounded-full ${d.color}`}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-300 w-10 text-right">{d.count.toLocaleString('es-CL')}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Executive KPI Strip ──────────────────────────────────────────────────────
function ExecutiveKPIStrip() {
  const kpis = [
    { icon: TrendingUp, label: 'Revenue monitoreado', value: 2.4, prefix: '$', suffix: 'B', color: 'text-cyan-100', glow: 'shadow-[0_0_24px_rgba(34,211,238,0.18)]', border: 'border-cyan-300/25' },
    { icon: Zap, label: 'Decisiones IA / mes', value: 18240, prefix: '', suffix: '', color: 'text-emerald-200', glow: 'shadow-[0_0_24px_rgba(52,211,153,0.14)]', border: 'border-emerald-400/20' },
    { icon: ShieldCheck, label: 'Riesgo operativo', value: 3.2, prefix: '', suffix: '%', color: 'text-sky-200', glow: 'shadow-[0_0_24px_rgba(56,189,248,0.14)]', border: 'border-sky-400/20' },
    { icon: FileCheck, label: 'Docs procesados', value: 1000000, prefix: '+', suffix: '', color: 'text-amber-200', glow: 'shadow-[0_0_24px_rgba(251,191,36,0.12)]', border: 'border-amber-400/18' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`group relative overflow-hidden rounded-[1.4rem] border ${k.border} bg-[linear-gradient(145deg,rgba(7,57,111,0.85),rgba(4,26,54,0.92))] p-4 ${k.glow} backdrop-blur-xl transition-all hover:border-opacity-70`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.06),transparent_50%)] opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                <Icon className={`h-4 w-4 ${k.color}`} />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <p className={`text-2xl font-bold leading-none ${k.color}`}>
              {k.prefix}
              {k.label === 'Revenue monitoreado' ? (
                <AnimatedCounter target={2.4} decimals={1} />
              ) : k.label === 'Decisiones IA / mes' ? (
                <AnimatedCounter target={18240} />
              ) : k.label === 'Riesgo operativo' ? (
                <AnimatedCounter target={3.2} decimals={1} />
              ) : (
                '+1M'
              )}
              {k.suffix}
            </p>
            <p className="mt-1.5 text-[10px] font-medium text-slate-500">{k.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── System Status Bar ────────────────────────────────────────────────────────
function SystemStatusBar() {
  const systems = [
    { name: 'AI Engine', status: 'online', ping: 12 },
    { name: 'OCR Service', status: 'online', ping: 38 },
    { name: 'API Gateway', status: 'online', ping: 24 },
    { name: 'DB Cluster', status: 'online', ping: 8 },
    { name: 'Risk Model', status: 'degraded', ping: 142 },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-2.5 backdrop-blur-xl">
      <Terminal className="h-3.5 w-3.5 flex-shrink-0 text-slate-500 mr-1" />
      {systems.map((s, i) => (
        <div key={s.name} className="flex flex-shrink-0 items-center gap-1.5">
          {i > 0 && <span className="text-slate-700">·</span>}
          <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className="text-[10px] text-slate-400">{s.name}</span>
          <span className={`text-[10px] ${s.ping < 50 ? 'text-emerald-500' : 'text-amber-500'}`}>{s.ping}ms</span>
        </div>
      ))}
      <div className="ml-auto flex-shrink-0 flex items-center gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-wide text-cyan-500/60">ArkoOS v2.4</span>
        <LivePulse color="bg-cyan-400" size="w-1.5 h-1.5" />
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AIOperatingSystem() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-[560px] lg:max-w-none space-y-3"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-8 rounded-[4rem] bg-[radial-gradient(ellipse_at_50%_20%,rgba(34,211,238,0.14),transparent_55%)] blur-3xl" />

      {/* Header: System status */}
      <SystemStatusBar />

      {/* Executive KPIs */}
      <ExecutiveKPIStrip />

      {/* Main grid: ArkoAsistente + Financial */}
      <div className="grid gap-3 lg:grid-cols-2">
        <ArkoAsistentePanel />
        <FinancialPanel />
      </div>

      {/* Secondary grid: Process Monitor + Document Intelligence */}
      <div className="grid gap-3 lg:grid-cols-2">
        <ProcessMonitoringPanel />
        <DocumentIntelligencePanel />
      </div>
    </motion.div>
  );
}
