import { useEffect, useState, type FormEvent } from 'react';
import { useRoute } from 'wouter';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, CirclePlay, Clock3, CreditCard, LockKeyhole, Pause, Play, ShieldCheck } from 'lucide-react';
import { academyCourses } from './AcademyPage';
import { enrollInAcademyCourse, supabase } from '../lib/academyAuth';

type Student = { name: string; email: string };
type PaidLesson = { title: string; content: string; exercise?: string };
type CoursePrice = { slug: string; title: string; status: string; priceCLP: number | null };
type PreviewData = {
  course: { title: string; description: string; estimatedMinutes: number | null };
  lessons: Array<{ title: string; description: string; content: string; videoUrl: string | null; materials: Array<{ title: string; url: string; type: string }> }>;
  assessment: { id: number; title: string; passingPercent: number; questions: Array<{ prompt: string; options: string[] }> } | null;
};
type AssessmentResult = { scorePercent: number; passed: boolean; passingPercent: number; review: Array<{ prompt: string; correct: boolean; explanation: string }> };

function spanishAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const cooldown = message.match(/you can only request this after\s+(\d+)\s+seconds?/i);
  if (cooldown) return `Por seguridad, espera ${cooldown[1]} segundos antes de volver a solicitar el correo de confirmación.`;
  if (/error sending confirmation email/i.test(message)) return 'Supabase no pudo enviar el correo de confirmación. Revisa el SMTP de Brevo y los registros de Auth para conocer el motivo; luego vuelve a intentarlo.';
  if (/email rate limit exceeded/i.test(message)) return 'Se alcanzó el límite de correos de confirmación. Espera un momento e inténtalo nuevamente.';
  if (/user already registered/i.test(message)) return 'Ya existe una cuenta con ese correo. Inicia sesión para continuar.';
  if (/email link is invalid|otp_expired|has expired/i.test(message)) return 'Este enlace ya venció o fue utilizado. Ingresa tu correo y solicita uno nuevo.';
  if (/email not confirmed/i.test(message)) return 'Tu cuenta aún no está confirmada. Solicita que te reenviemos el enlace.';
  if (/invalid login credentials/i.test(message)) return 'El correo o la contraseña no son correctos.';
  return message || 'No pudimos completar la solicitud. Inténtalo nuevamente.';
}

const courseVisualSteps: Record<string, [string, string, string]> = {
  'inteligencia-artificial': ['Caso de uso', 'Inteligencia artificial', 'Piloto medible'],
  'automatizacion-workflows': ['Proceso', 'Reglas y flujos', 'Menos reproceso'],
  'business-intelligence': ['Datos', 'Indicadores', 'Mejor decisión'],
  'bases-datos-sql': ['Pregunta', 'Consulta SQL', 'Resultado'],
  'desarrollo-web-apis': ['Aplicación', 'API e integración', 'Sistema conectado'],
  'cloud-devops': ['Código', 'Cloud y DevOps', 'Despliegue'],
  'gestion-documental': ['Documento', 'Validación inteligente', 'Flujo trazable'],
  'tecnologia-salud': ['Necesidad', 'Flujo de salud', 'Seguimiento'],
};

function AnimatedCoursePreview({ course }: { course: typeof academyCourses[number] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const visualSteps = courseVisualSteps[course.slug] || ['Idea', 'Tecnología', 'Resultado'];
  const CourseIcon = course.icon;

  useEffect(() => {
    if (prefersReducedMotion === true) setIsPlaying(false);
    else if (prefersReducedMotion === false) setIsPlaying(true);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setActiveStep((step) => (step + 1) % visualSteps.length), 1500);
    return () => window.clearInterval(timer);
  }, [isPlaying, visualSteps.length]);

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-cyan-200/15 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.11),transparent_60%),linear-gradient(135deg,rgba(5,40,79,0.92),rgba(4,26,54,0.96))] p-4 sm:p-6" aria-label={`Recorrido visual: ${course.title}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">Un vistazo al tema</p>
          <p className="mt-1 text-xs text-slate-400">De la necesidad a una aplicación real</p>
        </div>
        <button type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-pressed={isPlaying} aria-label={isPlaying ? 'Pausar animación del curso' : 'Reproducir animación del curso'} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-200/10 text-cyan-100 transition hover:bg-cyan-200/20 focus:outline-none focus:ring-2 focus:ring-cyan-200">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
      </div>
      <div className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-4" aria-hidden="true">
        <div className="absolute left-[16%] right-[16%] top-7 h-px bg-cyan-100/15" />
        <motion.div className="absolute top-[calc(1.75rem-3px)] z-10 h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_14px_5px_rgba(34,211,238,0.4)]" animate={isPlaying ? { left: ['16%', '50%', '84%'] } : { left: `${[16, 50, 84][activeStep]}%` }} transition={isPlaying ? { duration: 4.5, ease: 'linear', repeat: Infinity } : { duration: prefersReducedMotion ? 0 : 0.35 }} />
        {visualSteps.map((step, index) => (
          <motion.div key={`${course.slug}-${step}`} animate={{ y: activeStep === index ? -3 : 0, borderColor: activeStep === index ? 'rgba(103,232,249,0.5)' : 'rgba(255,255,255,0.1)', backgroundColor: activeStep === index ? 'rgba(34,211,238,0.1)' : 'rgba(2,8,23,0.38)' }} transition={{ duration: prefersReducedMotion ? 0 : 0.35 }} className="relative z-[1] flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center sm:min-h-[100px] sm:rounded-2xl sm:px-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${activeStep === index ? 'border-cyan-100/35 bg-cyan-200/15 text-cyan-100' : 'border-white/10 bg-[#041a36] text-slate-400'}`}>
              {index === 0 ? <BookOpen className="h-4 w-4" /> : index === 1 ? <CourseIcon className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </span>
            <span className="text-[10px] font-medium leading-tight text-slate-200 sm:text-xs">{step}</span>
          </motion.div>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{isPlaying ? `Recorrido animado activo. Paso ${activeStep + 1}: ${visualSteps[activeStep]}.` : 'Recorrido visual pausado.'}</p>
    </section>
  );
}

export default function AcademyClassroomPage() {
  const [, params] = useRoute('/academia/aula/:slug');
  const course = academyCourses.find((item) => item.slug === params?.slug);
  const [student, setStudent] = useState<Student | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [confirmationPending, setConfirmationPending] = useState(false);
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [isCoursePublished, setIsCoursePublished] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [hasPriceConfig, setHasPriceConfig] = useState(false);
  const [paidLessons, setPaidLessons] = useState<PaidLesson[]>([]);
  const [activePaidLesson, setActivePaidLesson] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState('');
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);
  const [freeLessonComplete, setFreeLessonComplete] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    if (hashParams.get('error_code') === 'otp_expired') {
      setAuthMode('signin');
      setConfirmationPending(true);
      setMessage(spanishAuthError(hashParams.get('error_description') || 'otp_expired'));
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (cancelled || !session?.user.email) return;
      setAccessToken(session.access_token);
      setStudent({ name: String(session.user.user_metadata?.full_name || session.user.email.split('@')[0]), email: session.user.email });
      setStudentEmail(session.user.email);
      fetch('/api/academy/profile', { headers: { Authorization: `Bearer ${session.access_token}` } });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user.email) {
        setStudent(null);
        setAccessToken('');
        return;
      }
      setAccessToken(session.access_token);
      setStudent({ name: String(session.user.user_metadata?.full_name || session.user.email.split('@')[0]), email: session.user.email });
      setStudentEmail(session.user.email);
    });
    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!course) return;
    const paymentId = new URLSearchParams(window.location.search).get('payment_id')
      || new URLSearchParams(window.location.search).get('collection_id');
    if (!paymentId || !accessToken) return;

    let cancelled = false;
    setIsVerifying(true);
    fetch(`/api/academy/paid-content?course=${encodeURIComponent(course.slug)}&payment_id=${encodeURIComponent(paymentId)}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'No fue posible validar el pago.');
        return result as { lessons: PaidLesson[] };
      })
      .then((result) => {
        if (cancelled) return;
        setPaidLessons(result.lessons);
        window.history.replaceState({}, '', window.location.pathname);
      })
      .catch((error: unknown) => {
        if (!cancelled && new URLSearchParams(window.location.search).has('payment_id')) {
          setMessage(error instanceof Error ? error.message : 'No fue posible validar el pago.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsVerifying(false);
      });

    return () => { cancelled = true; };
  }, [course, accessToken]);

  useEffect(() => {
    if (!course) return;
    let cancelled = false;
    fetch('/api/academy/catalog')
      .then((response) => response.ok ? response.json() as Promise<CoursePrice[]> : [])
      .then((catalog) => {
        if (cancelled) return;
        const configured = catalog.find((item) => item.slug === course.slug)?.priceCLP;
        const status = catalog.find((item) => item.slug === course.slug)?.status;
        setIsCoursePublished(status === 'preview' || status === 'published');
        setHasPriceConfig(typeof configured === 'number' && configured > 0);
        setPrice(typeof configured === 'number' ? configured : null);
      })
      .catch(() => {
        if (!cancelled) setHasPriceConfig(false);
      });
    return () => { cancelled = true; };
  }, [course]);

  useEffect(() => {
    if (!course || !isCoursePublished || !accessToken || !enrollmentComplete) return;
    let cancelled = false;
    setIsLoadingPreview(true);
    fetch(`/api/academy/preview?course=${encodeURIComponent(course.slug)}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'La clase de muestra aún no está disponible.');
        return result as PreviewData;
      })
      .then((result) => { if (!cancelled) setPreviewData(result); })
      .catch((error: unknown) => { if (!cancelled) setPreviewError(error instanceof Error ? error.message : 'La clase de muestra aún no está disponible.'); })
      .finally(() => { if (!cancelled) setIsLoadingPreview(false); });
    return () => { cancelled = true; };
  }, [course, isCoursePublished, accessToken, enrollmentComplete]);

  useEffect(() => {
    if (!course || !isCoursePublished || !accessToken) return;
    let cancelled = false;
    enrollInAcademyCourse(course.slug, accessToken)
      .then(() => { if (!cancelled) setEnrollmentComplete(true); })
      .catch((error: unknown) => { if (!cancelled) setMessage(error instanceof Error ? error.message : 'No se pudo cargar tu inscripción.'); });
    return () => { cancelled = true; };
  }, [course, isCoursePublished, accessToken]);

  if (!course) {
    return <main className="flex min-h-screen items-center justify-center bg-[#041a36] px-6 text-white"><div className="text-center"><h1 className="text-3xl font-semibold">No encontramos esta aula</h1><a className="mt-6 inline-flex items-center gap-2 text-cyan-200" href="/academia"><ArrowLeft className="h-4 w-4" />Volver a la Academia</a></div></main>;
  }

  if (!isCoursePublished) {
    return <main className="flex min-h-screen items-center justify-center bg-[#041a36] px-6 text-white"><div className="max-w-lg text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Academia ArkoData</p><h1 className="mt-4 text-3xl font-semibold">{course.title}</h1><p className="mt-4 leading-7 text-slate-300">Este curso está en preparación. Próximamente publicaremos su aula, clase de muestra y contenidos aprobados.</p><a href="/academia#cursos" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950"><ArrowLeft className="h-4 w-4" />Volver al catálogo</a></div></main>;
  }

  if (isLoadingPreview) return <main className="flex min-h-screen items-center justify-center bg-[#041a36] text-cyan-100">Cargando el aula virtual…</main>;

  const submitEnrollment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsEnrolling(true);
    const nextStudent = { name: studentName.trim(), email: studentEmail.trim() };
    try {
      if (!supabase) throw new Error('La autenticación de Academia aún no está configurada.');
      const authResult = authMode === 'signup'
        ? await supabase.auth.signUp({ email: nextStudent.email, password, options: { data: { full_name: nextStudent.name }, emailRedirectTo: `${window.location.origin}/academia/aula/${course.slug}` } })
        : await supabase.auth.signInWithPassword({ email: nextStudent.email, password });
      if (authResult.error) throw authResult.error;
      const session = authResult.data.session;
      if (!session) {
        setConfirmationPending(true);
        setMessage('Revisa tu correo para confirmar la cuenta y luego vuelve a iniciar sesión.');
        return;
      }
      await enrollInAcademyCourse(course.slug, session.access_token);
      setAccessToken(session.access_token);
      setStudent(nextStudent);
      setEnrollmentComplete(true);
    } catch (error) {
      const errorMessage = spanishAuthError(error);
      if (/confirm|venci|utilizado/i.test(errorMessage)) setConfirmationPending(true);
      setMessage(errorMessage);
    } finally {
      setIsEnrolling(false);
    }
  };

  const resendConfirmation = async () => {
    if (!supabase || !course || !studentEmail.trim()) {
      setMessage('Escribe el correo con el que creaste tu cuenta.');
      return;
    }
    setIsResendingConfirmation(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: studentEmail.trim(),
        options: { emailRedirectTo: `${window.location.origin}/academia/aula/${course.slug}` },
      });
      if (error) throw error;
      setConfirmationPending(true);
      setMessage('Solicitamos un nuevo enlace. Usa el correo más reciente y ábrelo una sola vez.');
    } catch (error) {
      setMessage(spanishAuthError(error));
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  const startPaidCheckout = async () => {
    if (!student) {
      document.getElementById('enrolamiento')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setMessage('Inscríbete gratis con tu nombre y correo para continuar al curso completo.');
      return;
    }
    setIsPaying(true);
    setMessage('');
    try {
      const response = await fetch('/api/academy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ courseSlug: course.slug }),
      });
      const result = await response.json() as { checkoutUrl?: string; message?: string };
      if (!response.ok || !result.checkoutUrl) throw new Error(result.message || 'No pudimos iniciar el pago.');
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No pudimos iniciar el pago.');
      setIsPaying(false);
    }
  };

  const submitAssessment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!previewData?.assessment || !accessToken) return;
    if (answers.length !== previewData.assessment.questions.length || answers.some((answer) => !Number.isInteger(answer))) {
      setMessage('Responde todas las preguntas antes de enviar la evaluación.');
      return;
    }
    setIsSubmittingAssessment(true);
    setMessage('');
    try {
      const response = await fetch('/api/academy/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ courseSlug: course.slug, assessmentId: previewData.assessment.id, answers }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No se pudo corregir la evaluación.');
      setAssessmentResult(result as AssessmentResult);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo corregir la evaluación.');
    } finally {
      setIsSubmittingAssessment(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#041a36] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#041a36]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/academia" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-100 hover:text-white"><ArrowLeft className="h-4 w-4" />Academia ArkoData</a>
          <span className="hidden text-sm text-slate-400 sm:inline">Aula virtual · {previewData?.course.title || course.title}</span>
          <a href="/academia#cursos" className="text-sm text-slate-300 transition hover:text-cyan-100">Ver otros cursos</a>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div>
          <div className="overflow-hidden rounded-[1.75rem] border border-cyan-200/15 bg-[radial-gradient(ellipse_at_top_right,rgba(14,116,220,0.3),transparent_55%),linear-gradient(135deg,#07396f,#041a36)] p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Aula virtual · Clase de prueba gratuita</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{previewData?.course.title || course.title}</h1>
            <p className="mt-4 max-w-3xl leading-7 text-slate-200">{previewData?.course.description || 'Crea una cuenta gratuita e inscríbete para entrar a la clase de muestra.'}</p>
            {previewData && <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300"><span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-cyan-200" />{previewData.lessons.length} lección{previewData.lessons.length === 1 ? '' : 'es'} de muestra</span>{previewData.course.estimatedMinutes && <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan-200" />{previewData.course.estimatedMinutes} minutos</span>}</div>}
          </div>

          {previewData ? <section className="mt-7 rounded-[1.6rem] border border-cyan-200/20 bg-[#071d3b] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Muestra gratuita</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{previewData.lessons[0]?.title}</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1.5 text-xs font-semibold text-emerald-100"><CirclePlay className="h-4 w-4" />Clase abierta</span>
            </div>
            {previewData.lessons.map((lesson) => (
              <article key={lesson.title} className="mt-6 rounded-2xl border border-white/10 bg-[#041a36]/70 p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                {lesson.description && <p className="mt-2 text-sm leading-6 text-slate-300">{lesson.description}</p>}
                {lesson.videoUrl && <video controls preload="metadata" src={lesson.videoUrl} className="mt-5 w-full rounded-xl bg-black" />}
                {lesson.content && <div className="mt-5 whitespace-pre-wrap leading-8 text-slate-200">{lesson.content}</div>}
                {lesson.materials.length > 0 && <ul className="mt-5 space-y-2">{lesson.materials.map((material) => <li key={material.url}><a href={material.url} target="_blank" rel="noreferrer" className="text-sm text-cyan-100 underline underline-offset-4">Descargar: {material.title}</a></li>)}</ul>}
              </article>
            ))}
          </section> : <section className="mt-7 rounded-[1.6rem] border border-cyan-200/20 bg-[#071d3b] p-6 text-sm leading-7 text-slate-300 sm:p-8">La clase gratuita se abrirá aquí después de iniciar sesión e inscribirte.{previewError && <p className="mt-3 text-amber-100">{previewError}</p>}</section>}

          {previewData?.assessment && <section className="mt-7 rounded-[1.6rem] border border-cyan-200/20 bg-[#071d3b] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Evaluación automática</p>
            <h2 className="mt-3 text-2xl font-semibold">{previewData.assessment.title}</h2>
            <p className="mt-2 text-sm text-slate-400">Necesitas {previewData.assessment.passingPercent}% para aprobar.</p>
            {!assessmentResult ? <form onSubmit={submitAssessment} className="mt-6 space-y-6">
              {previewData.assessment.questions.map((question, questionIndex) => <fieldset key={question.prompt} className="rounded-xl border border-white/10 bg-[#041a36]/70 p-4">
                <legend className="px-2 font-medium text-white">{questionIndex + 1}. {question.prompt}</legend>
                <div className="mt-3 space-y-2">{question.options.map((option, optionIndex) => <label key={option} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm text-slate-300 hover:bg-white/[0.04]">
                  <input required type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} onChange={() => setAnswers((current) => { const next = [...current]; next[questionIndex] = optionIndex; return next; })} className="mt-0.5 accent-cyan-300" />{option}
                </label>)}</div>
              </fieldset>)}
              <button disabled={isSubmittingAssessment} className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60">{isSubmittingAssessment ? 'Corrigiendo…' : 'Enviar evaluación'}</button>
            </form> : <div className="mt-6 rounded-xl border border-cyan-200/15 bg-[#041a36]/70 p-5">
              <p className={`text-lg font-semibold ${assessmentResult.passed ? 'text-emerald-200' : 'text-amber-200'}`}>{assessmentResult.passed ? '¡Aprobada!' : 'Sigue practicando'} · {assessmentResult.scorePercent}%</p>
              <ul className="mt-4 space-y-3">{assessmentResult.review.map((item, index) => <li key={item.prompt} className="text-sm leading-6 text-slate-300"><span className={item.correct ? 'text-emerald-200' : 'text-amber-200'}>{item.correct ? 'Correcta' : 'Revisa'}</span> — {item.explanation || item.prompt}</li>)}</ul>
              {!assessmentResult.passed && <button onClick={() => setAssessmentResult(null)} className="mt-5 text-sm font-semibold text-cyan-100 underline underline-offset-4">Intentar nuevamente</button>}
            </div>}
          </section>}

          <section className="mt-7 rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div className="flex items-center gap-3"><LockKeyhole className="h-5 w-5 text-cyan-200" /><h2 className="text-xl font-semibold">Curso completo</h2></div>
            <p className="mt-3 leading-7 text-slate-300">Profundiza con lecciones prácticas, ejercicios y materiales de trabajo. El contenido completo se habilita después de confirmar el pago.</p>
            {isVerifying ? <p className="mt-5 animate-pulse text-sm text-cyan-100">Verificando el pago con Mercado Pago…</p> : null}
            {paidLessons.length > 0 ? (
              <div className="mt-6 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                <nav className="space-y-2" aria-label="Lecciones del curso completo">
                  {paidLessons.map((lesson, index) => <button key={lesson.title} onClick={() => setActivePaidLesson(index)} aria-current={activePaidLesson === index ? 'step' : undefined} className={`w-full rounded-xl border p-3 text-left text-sm transition ${activePaidLesson === index ? 'border-cyan-200/40 bg-cyan-200/10 text-white' : 'border-white/10 text-slate-300 hover:bg-white/[0.05]'}`}><span className="text-xs text-cyan-200">Lección {index + 1}</span><span className="mt-1 block font-medium">{lesson.title}</span></button>)}
                </nav>
                <article className="rounded-2xl border border-cyan-200/15 bg-[#041a36]/75 p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Contenido del curso</p>
                  <h3 className="mt-3 text-xl font-semibold">{paidLessons[activePaidLesson]?.title}</h3>
                  <p className="mt-4 leading-8 text-slate-200">{paidLessons[activePaidLesson]?.content}</p>
                  {paidLessons[activePaidLesson]?.exercise && <div className="mt-6 rounded-xl border border-cyan-200/15 bg-cyan-200/[0.06] p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">Ejercicio práctico</p><p className="mt-2 text-sm leading-7 text-slate-200">{paidLessons[activePaidLesson].exercise}</p></div>}
                </article>
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {course.topics.map((topic, index) => <div key={topic} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#041a36]/60 p-4 text-sm text-slate-300"><LockKeyhole className="h-4 w-4 shrink-0 text-slate-500" /><span><span className="mr-2 text-xs text-slate-500">0{index + 1}</span>{topic}</span></div>)}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section id="enrolamiento" className="scroll-mt-28 rounded-[1.5rem] border border-cyan-200/20 bg-[#071d3b] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Tu inscripción</p>
            {student ? (
              <div className="mt-4 rounded-xl border border-emerald-200/20 bg-emerald-200/[0.06] p-4">
                <p className="flex items-center gap-2 font-semibold text-emerald-100"><CheckCircle2 className="h-5 w-5" />Estás inscrito</p>
                <p className="mt-2 text-sm text-slate-300">{student.name}<br />{student.email}</p>
                <p className="mt-3 text-xs leading-5 text-slate-400">Ya puedes tomar la clase de prueba gratuita. El progreso se guarda en este dispositivo.</p>
              </div>
            ) : enrollmentComplete ? (
              <div className="mt-4 rounded-xl border border-emerald-200/20 bg-emerald-200/[0.06] p-4 text-sm leading-6 text-emerald-100">Tu inscripción gratuita está lista. Puedes comenzar la clase de prueba.</div>
            ) : (
              <form onSubmit={submitEnrollment} className="mt-4 space-y-3">
                <p className="text-sm leading-6 text-slate-300">Inscríbete gratis para iniciar la clase de prueba y recibir información del curso.</p>
                <label className="block text-xs font-medium text-slate-300">Nombre
                  <input required value={studentName} onChange={(event) => setStudentName(event.target.value)} autoComplete="name" className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#041a36] px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-200/50" />
                </label>
                <label className="block text-xs font-medium text-slate-300">Correo electrónico
                  <input required type="email" value={studentEmail} onChange={(event) => setStudentEmail(event.target.value)} autoComplete="email" className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#041a36] px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-200/50" />
                </label>
                <label className="block text-xs font-medium text-slate-300">Contraseña
                  <input required type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#041a36] px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-200/50" />
                </label>
                <button disabled={isEnrolling} type="submit" className="w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60">{isEnrolling ? 'Procesando…' : authMode === 'signup' ? 'Crear cuenta e inscribirme' : 'Iniciar sesión e inscribirme'}</button>
                <button type="button" onClick={() => setAuthMode((mode) => mode === 'signup' ? 'signin' : 'signup')} className="w-full text-xs text-cyan-100 underline underline-offset-4">{authMode === 'signup' ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva'}</button>
                {confirmationPending && <button type="button" disabled={isResendingConfirmation} onClick={resendConfirmation} className="w-full text-xs font-semibold text-amber-100 underline underline-offset-4 disabled:opacity-50">{isResendingConfirmation ? 'Enviando…' : 'Reenviar correo de confirmación'}</button>}
              </form>
            )}

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between gap-3"><span className="font-semibold text-white">Acceso al curso completo</span><CreditCard className="h-5 w-5 text-cyan-200" /></div>
              {price ? <p className="mt-2 text-2xl font-semibold text-white">${new Intl.NumberFormat('es-CL').format(price)} <span className="text-sm font-normal text-slate-400">CLP</span></p> : <p className="mt-2 text-sm text-slate-400">Valor del curso próximamente</p>}
              <button onClick={startPaidCheckout} disabled={isPaying || isVerifying || paidLessons.length > 0 || !hasPriceConfig} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
                <CreditCard className="h-4 w-4" />{paidLessons.length > 0 ? 'Curso completo habilitado' : isPaying ? 'Conectando con Mercado Pago…' : 'Desbloquear curso completo'}
              </button>
              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />Pago procesado de forma segura por Mercado Pago. El contenido se habilita cuando el pago queda aprobado.</p>
            </div>
            {message && <p role="alert" className="mt-4 rounded-xl border border-amber-200/20 bg-amber-200/[0.06] p-3 text-sm leading-6 text-amber-100">{message}</p>}
          </section>
          {paidLessons.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm font-semibold text-white">Lo que incluye el curso</p>
              <ul className="mt-3 space-y-2.5">{course.topics.map((topic) => <li key={topic} className="flex gap-2 text-xs leading-5 text-slate-300"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-200" />{topic}</li>)}</ul>
            </div>
          )}
          {paidLessons.length > 0 && <p className="flex items-center gap-2 rounded-xl border border-emerald-200/20 bg-emerald-200/[0.06] p-4 text-sm text-emerald-100"><Play className="h-4 w-4" />Acceso de pago verificado</p>}
        </aside>
      </div>

      <footer className="border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>Aula virtual · Academia ArkoData</span><a href="/academia" className="inline-flex items-center gap-2 hover:text-white"><ArrowLeft className="h-4 w-4" />Volver a explorar cursos <ArrowRight className="h-4 w-4" /></a></div></footer>
    </main>
  );
}
