import { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Send, 
  Bot,
  Brain,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Building,
  User,
  Calendar,
  Copy,
  ExternalLink,
  Lock,
  X
} from 'lucide-react';
import { useCreateLead } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import AIChat from '../components/AIChat';


export default function HomePage() {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showApproachModal, setShowApproachModal] = useState(false);

  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    isSubmitting: false,
    submitSuccess: false,
    submitError: ''
  });

  const createLead = useCreateLead();
  const { toast } = useToast();

  // Función para manejar el envío del formulario de contacto
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setContactForm(prev => ({ ...prev, submitError: '', isSubmitting: true }));

    try {
      // Validar campos requeridos
      if (!contactForm.name.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!contactForm.email.trim()) {
        throw new Error('El email es requerido');
      }
      if (!contactForm.message.trim()) {
        throw new Error('El mensaje es requerido');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactForm.email)) {
        throw new Error('Por favor ingresa un email válido');
      }

      // Crear objeto de lead
      const leadData = {
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        company: contactForm.company.trim() || 'No especificada',
        phone: contactForm.phone.trim() || 'No proporcionado',
        interest: contactForm.message.trim(),
        source: 'Formulario de contacto web'
      };

      // Crear lead usando la API
      await createLead.mutateAsync(leadData);

      // Mostrar éxito
      setContactForm(prev => ({
        ...prev,
        isSubmitting: false,
        submitSuccess: true,
        submitError: '',
        // Limpiar formulario
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      }));

      toast({
        title: 'Mensaje enviado',
        description: 'Tu mensaje ha sido enviado exitosamente. Te contactaremos pronto.',
      });

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setContactForm(prev => ({ ...prev, submitSuccess: false }));
        setShowContactForm(false);
      }, 3000);

    } catch (error) {
      console.error('Error en formulario:', error);
      setContactForm(prev => ({
        ...prev,
        isSubmitting: false,
        submitError: error instanceof Error ? error.message : 'Error desconocido'
      }));

      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      });
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">ArkoData</h1>
                <p className="text-xs sm:text-sm text-cyan-200 hidden sm:block">Soluciones Tecnológicas</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Contacto</span>
                <span className="xs:hidden">•••</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-2 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="w-full max-w-6xl mx-auto">
              <h1 className="font-bold text-white leading-[1.1] px-1 mb-8 sm:mb-12 lg:mb-16">
                <span className="block text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl hero-title">ArkoData</span>
                <span className="block text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-300 mt-1 mb-2">Sociedad Calcagno SPA</span>
                <span className="block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-1 sm:mt-2 hero-subtitle" style={{
                  background: 'linear-gradient(90deg, #22d3ee 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                  lineHeight: '1.2'
                }}>
                  Adaptamos procesos reales con tecnologia e inteligencia aplicada al negocio
                </span>
              </h1>
            </div>
            
            <div className="mt-4 sm:mt-6 lg:mt-8">
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed px-3">
                No partimos desde el software. Partimos desde como opera tu empresa, donde se frena y como combinar procesos, personas e IA para que el cambio sea util, adoptable y sostenible.
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-8 px-3">
              <div className="bg-white/8 border border-white/15 rounded-2xl p-4 sm:p-5 backdrop-blur-sm text-left">
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                  Nos importa entender los matices de cada operacion. Empresas grandes, medianas y pequenas no necesitan copiar un sistema rigido: necesitan una estructura capaz de factorizar lo que ya existe, adaptar flujos y dar soporte real a sus usuarios.
                </p>
                <button
                  onClick={() => setShowApproachModal(true)}
                  className="mt-4 inline-flex items-center rounded-lg border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  Como entendemos tu operacion
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowAIChat(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-3"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Hablar con ArkoAsistente</span>
              </button>
              
              <button
                onClick={() => setShowContactForm(true)}
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3"
              >
                <Phone className="w-6 h-6" />
                <span>Contactar Equipo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {showApproachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-cyan-400/20 bg-slate-900/95 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Nuestra Logica</p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">La tecnologia es el medio, no el centro</h2>
              </div>
              <button
                onClick={() => setShowApproachModal(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
              <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
                En ArkoData no creemos que una empresa mejore solo por comprar software. Lo que realmente genera valor es la capacidad de entender como funciona su operacion, separar lo esencial de lo accesorio y adaptar tecnologia e inteligencia artificial al flujo real del negocio.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">1. Entender</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    Leemos procesos, fricciones, dependencias, personas y excepciones. Nos importa la complejidad real, no una version simplificada en PowerPoint.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">2. Factorizar</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    Ordenamos la logica del negocio para que no dependa de una sola herramienta. Eso permite integrar, automatizar y evolucionar sin quedar amarrados a un software rigido.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">3. Acompanar al usuario</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    Disenamos soluciones que apoyan al usuario final, respetan sus matices operativos y le entregan confianza para adoptar el cambio con claridad.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <p className="text-sm leading-relaxed text-cyan-50 sm:text-base">
                  Para grandes, medianas y pequenas empresas, eso significa algo concreto: combinar procesos, sistemas existentes e IA de forma adaptable. No para imponer una plataforma, sino para liderar mejor, apoyar mejor y responder mejor frente a escenarios reales.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => {
                    setShowApproachModal(false);
                    setShowAIChat(true);
                  }}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white transition-all hover:from-cyan-600 hover:to-blue-700"
                >
                  Conversar con ArkoAsistente
                </button>
                <button
                  onClick={() => {
                    setShowApproachModal(false);
                    setShowContactForm(true);
                  }}
                  className="rounded-xl border border-cyan-400 px-5 py-3 font-semibold text-cyan-200 transition-colors hover:bg-cyan-400 hover:text-slate-900"
                >
                  Hablar con el equipo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nuestras Soluciones Tecnológicas Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Nuestras Soluciones Tecnológicas
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Soluciones Inteligentes */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Soluciones Inteligentes</h3>
              <p className="text-gray-300 text-sm">
                Implementamos sistemas de IA avanzados que automatizan procesos y mejoran la toma de decisiones en tu organización.
              </p>
            </div>

            {/* Infraestructura Robusta */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Infraestructura Robusta</h3>
              <p className="text-gray-300 text-sm">
                Desarrollamos arquitecturas tecnológicas sólidas y escalables que soportan el crecimiento de tu empresa.
              </p>
            </div>

            {/* Desarrollo Personalizado */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Desarrollo Personalizado</h3>
              <p className="text-gray-300 text-sm">
                Creamos soluciones a medida que se adaptan perfectamente a las necesidades específicas de tu negocio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo Completo de Soluciones */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Catálogo Completo de Soluciones
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Inteligencia Artificial & Sistemas */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center mr-3">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Inteligencia Artificial & Sistemas</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Chatbots y asistentes virtuales</li>
                <li>• Análisis predictivo avanzado</li>
                <li>• Machine Learning personalizado</li>
                <li>• Automatización de procesos RPA</li>
                <li>• Sistemas de recomendación</li>
                <li>• Procesamiento de lenguaje natural</li>
                <li>• Computer Vision</li>
                <li>• Analytics e inteligencia de negocios</li>
              </ul>
            </div>

            {/* Administración - Agentes */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Administración - Agentes</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Sistemas CRM avanzados</li>
                <li>• Gestión de leads automática</li>
                <li>• Workflows de ventas</li>
                <li>• Dashboard de métricas</li>
                <li>• Integración con herramientas</li>
                <li>• Automatización de follow-ups</li>
                <li>• Reportes personalizados</li>
              </ul>
            </div>

            {/* Cloud & Storage */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center mr-3">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Cloud & Storage</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Migración a la nube</li>
                <li>• Arquitecturas serverless</li>
                <li>• Bases de datos escalables</li>
                <li>• Backup automático</li>
                <li>• CDN y optimización</li>
                <li>• Monitoreo 24/7</li>
              </ul>
            </div>

            {/* Desarrollo de Software */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Desarrollo de Software</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Aplicaciones web modernas</li>
                <li>• Apps móviles nativas</li>
                <li>• APIs y microservicios</li>
                <li>• E-commerce personalizado</li>
                <li>• Sistemas de gestión</li>
                <li>• Integraciones complejas</li>
              </ul>
            </div>

            {/* Seguridad & Compliance */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Seguridad & Compliance</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Auditorías de seguridad</li>
                <li>• Implementación ISO 27001</li>
                <li>• Protección de datos GDPR</li>
                <li>• Pentesting y vulnerabilidades</li>
                <li>• Backup y recuperación</li>
                <li>• Cifrado end-to-end</li>
              </ul>
            </div>

            {/* Automatización & Testing */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center mr-3">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Automatización & Testing</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• CI/CD pipelines</li>
                <li>• Testing automatizado</li>
                <li>• DevOps y deployment</li>
                <li>• Monitoreo de aplicaciones</li>
                <li>• Quality assurance</li>
                <li>• Performance optimization</li>
              </ul>
            </div>

            {/* Consultoría & Soporte */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Consultoría & Soporte</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Análisis de requerimientos</li>
                <li>• Arquitectura de soluciones</li>
                <li>• Capacitación técnica</li>
                <li>• Soporte 24/7</li>
                <li>• Mantenimiento preventivo</li>
                <li>• Optimización continua</li>
              </ul>
            </div>

            {/* Administración & Redes */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center mr-3">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Administración & Redes</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Administración de servidores</li>
                <li>• Configuración de redes</li>
                <li>• Virtualización VMware</li>
                <li>• Balanceadores de carga</li>
                <li>• VPN corporativas</li>
                <li>• Firewall y seguridad</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Por qué elegirnos?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Capacidad Garantizada</h3>
              <p className="text-gray-300">
                Garantizamos la disponibilidad de nuestros especialistas para atender tus proyectos con los más altos estándares de calidad.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tecnología de Vanguardia</h3>
              <p className="text-gray-300">
                Utilizamos las últimas tecnologías y metodologías ágiles para entregarte soluciones modernas y eficientes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Equipo Calificado</h3>
              <p className="text-gray-300">
                Nuestro equipo está conformado por profesionales certificados con amplia experiencia en proyectos corporativos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section Original - Mantenemos pero simplificado */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nuestros Servicios Destacados
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Soluciones tecnológicas de vanguardia para impulsar tu empresa hacia el futuro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Solutions */}
            <div className="ai-card bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative">
              <div className="ai-badge">IA</div>
              <div className="ai-icon w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Inteligencia Artificial</h3>
              <p className="text-gray-300 mb-6">
                Automatiza procesos, mejora la toma de decisiones y optimiza la experiencia del cliente con IA avanzada.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Chatbots inteligentes</li>
                <li>• Análisis predictivo</li>
                <li>• Automatización de procesos</li>
                <li>• Machine Learning personalizado</li>
              </ul>
              <div className="ai-footer">
                Potenciado por tecnología de última generación
              </div>
            </div>

            {/* ArkoAsistente */}
            <div className="arkoasistente-card rounded-2xl p-8 relative">
              <div className="arkoasistente-badge">NUEVO</div>
              <div className="arkoasistente-icon w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">ArkoAsistente</h3>
              <p className="text-gray-300 mb-6">
                Tu asistente virtual inteligente que atiende clientes 24/7, captura leads y mejora la experiencia de usuario.
              </p>
              <ul className="space-y-2 text-sm text-gray-400 mb-6">
                <li>• Atención automática 24/7</li>
                <li>• Captura de leads inteligente</li>
                <li>• Respuestas personalizadas</li>
                <li>• Integración WhatsApp</li>
              </ul>
              <button
                onClick={() => setShowAIChat(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Probar Ahora</span>
              </button>
            </div>

            {/* Other services cards... */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Desarrollo Web</h3>
              <p className="text-gray-300 mb-6">
                Sitios web modernos y aplicaciones que impulsan tu presencia digital y convierten visitantes en clientes.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Diseño responsive</li>
                <li>• E-commerce avanzado</li>
                <li>• SEO optimizado</li>
                <li>• Aplicaciones web progresivas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-cyan-400/30 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Contáctanos</h3>
              <p className="text-gray-400">Cuéntanos sobre tu proyecto</p>
            </div>

            {contactForm.submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado!</h4>
                <p className="text-gray-400">Te contactaremos pronto</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Tu nombre *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Tu email *"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Empresa"
                    value={contactForm.company}
                    onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <textarea
                    placeholder="Cuéntanos sobre tu proyecto *"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                {contactForm.submitError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{contactForm.submitError}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={contactForm.isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {contactForm.isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <AIChat onClose={() => setShowAIChat(false)} />
      )}


    </div>
  );
}
