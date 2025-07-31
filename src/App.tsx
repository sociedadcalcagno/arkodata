import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  ArrowRight,
  Bot,
  Brain,
  Zap,
  Shield,
  Users,
  TrendingUp,
  X,
  User,
  Building,
  Calendar,
  Copy,
  ExternalLink,
  Lock
} from 'lucide-react';
import { emailService, type LeadData } from './emailService';
import AdminLogin from './components/AdminLogin';
import AIChat from './components/AIChat';

function App() {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showEmailDashboard, setShowEmailDashboard] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [storedEmails, setStoredEmails] = useState<any[]>([]);
  
  const [chatState, setChatState] = useState({
    messages: [] as Array<{role: 'user' | 'assistant', content: string}>,
    userInput: '',
    userName: '',
    userEmail: '',
    userCompany: '',
    hasShownInterest: false,
    conversationStage: 'greeting',
    conversationHistory: [] as Array<{role: 'user' | 'assistant', content: string}>
  });

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

  // Inicializar EmailJS y cargar emails guardados
  useEffect(() => {
    emailService.initialize();
    loadStoredEmails();
    checkAdminSession();
  }, []);

  const checkAdminSession = () => {
    const session = localStorage.getItem('arko_admin_session');
    if (session) {
      const sessionTime = parseInt(session);
      const now = Date.now();
      // Sesión válida por 1 hora
      if (now - sessionTime < 3600000) {
        setIsAdminAuthenticated(true);
      } else {
        localStorage.removeItem('arko_admin_session');
      }
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
      setShowEmailDashboard(true);
    }
    setShowAdminLogin(false);
  };

  const handleEmailDashboardAccess = () => {
    if (isAdminAuthenticated) {
      setShowEmailDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('arko_admin_session');
    setIsAdminAuthenticated(false);
    setShowEmailDashboard(false);
  };

  const loadStoredEmails = () => {
    const emails = emailService.getStoredLeads();
    setStoredEmails(emails);
  };

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
      const leadData: LeadData = {
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        company: contactForm.company.trim() || 'No especificada',
        phone: contactForm.phone.trim() || 'No proporcionado',
        interest: contactForm.message.trim(),
        source: 'Formulario de contacto web'
      };

      // Guardar localmente (esto siempre funciona)
      emailService.saveLeadLocally(leadData);
      
      // Intentar enviar emails (opcional, no bloquea si falla)
      try {
        await emailService.notifyTeam(leadData);
        console.log('✅ Email enviado al equipo');
      } catch (emailError) {
        console.log('⚠️ Email no enviado, pero datos guardados:', emailError);
      }

      // Actualizar lista de emails
      loadStoredEmails();

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
    }
  };

  // Función para copiar datos de un lead
  const copyLeadData = (lead: any) => {
    const data = `Nombre: ${lead.name}\nEmail: ${lead.email}\nEmpresa: ${lead.company}\nTeléfono: ${lead.phone}\nInterés: ${lead.interest}\nFecha: ${new Date(lead.capturedAt).toLocaleString('es-CL')}`;
    navigator.clipboard.writeText(data);
    alert('Datos copiados al portapapeles');
  };

  // Función para enviar WhatsApp
  const sendWhatsApp = (lead: any) => {
    const message = `Hola ${lead.name}, vi tu consulta desde ArkoData. ¿Te gustaría que conversemos sobre ${lead.interest}?`;
    const phone = lead.phone.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Función para enviar email
  const sendEmail = (lead: any) => {
    const subject = `Respuesta a tu consulta - ArkoData`;
    const body = `Hola ${lead.name},\n\nGracias por contactarnos. Hemos recibido tu consulta sobre: "${lead.interest}"\n\nNos pondremos en contacto contigo pronto.\n\nSaludos,\nEquipo ArkoData`;
    window.open(`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ArkoData</h1>
                <p className="text-sm text-cyan-200">Soluciones Tecnológicas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleEmailDashboardAccess}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Admin ({storedEmails.length})</span>
              </button>
              
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Contacto</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transformamos tu
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Negocio Digital
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Estamos aquí para ayudarte a transformar tu negocio con soluciones tecnológicas innovadoras
            </p>
            
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

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nuestras Soluciones
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ofrecemos tecnología de vanguardia para impulsar tu empresa hacia el futuro
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
                <li>• Integración WhatsApp y Web</li>
                <li>• Respuestas personalizadas</li>
              </ul>
              <button
                onClick={() => setShowAIChat(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Probar Ahora</span>
              </button>
            </div>

            {/* Web Development */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Desarrollo Web</h3>
              <p className="text-gray-300 mb-6">
                Sitios web modernos, rápidos y optimizados que convierten visitantes en clientes.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Diseño responsive</li>
                <li>• Optimización SEO</li>
                <li>• E-commerce avanzado</li>
                <li>• Aplicaciones web progresivas</li>
              </ul>
            </div>

            {/* Cybersecurity */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ciberseguridad</h3>
              <p className="text-gray-300 mb-6">
                Protege tu empresa con soluciones de seguridad avanzadas y monitoreo continuo.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Auditorías de seguridad</li>
                <li>• Protección contra malware</li>
                <li>• Backup y recuperación</li>
                <li>• Capacitación en seguridad</li>
              </ul>
            </div>

            {/* Consulting */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Consultoría TI</h3>
              <p className="text-gray-300 mb-6">
                Estrategias tecnológicas personalizadas para optimizar tus procesos empresariales.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Análisis de infraestructura</li>
                <li>• Migración a la nube</li>
                <li>• Optimización de procesos</li>
                <li>• Transformación digital</li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Analytics & BI</h3>
              <p className="text-gray-300 mb-6">
                Convierte tus datos en insights accionables con herramientas de análisis avanzadas.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Dashboards interactivos</li>
                <li>• Reportes automatizados</li>
                <li>• Análisis predictivo</li>
                <li>• Visualización de datos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para Transformar tu Negocio?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contáctanos hoy y descubre cómo podemos ayudarte a alcanzar tus objetivos tecnológicos
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-3"
            >
              <Mail className="w-6 h-6" />
              <span>Enviar Mensaje</span>
            </button>
            
            <a
              href="https://wa.me/56933553024?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20ArkoData"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3"
            >
              <MessageCircle className="w-6 h-6" />
              <span>WhatsApp</span>
            </a>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-8 justify-center items-center text-gray-400">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-cyan-400" />
              <span>+56 9 3355 3024</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>contacto@arkodata.cl</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span>Santiago, Chile</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-cyan-400/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Contáctanos</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {contactForm.submitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado!</h4>
                <p className="text-gray-300">Nos pondremos en contacto contigo pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Empresa
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    placeholder="Cuéntanos sobre tu proyecto o necesidad..."
                    required
                  />
                </div>

                {contactForm.submitError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-300 text-sm">{contactForm.submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactForm.isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {contactForm.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
              <p className="text-gray-400 text-sm mb-4">O contáctanos directamente por WhatsApp</p>
              <a
                href="https://wa.me/56933553024?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20ArkoData"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Abrir WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Email Dashboard Modal */}
      {showEmailDashboard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-cyan-400/30">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Dashboard Administrativo</h3>
                <p className="text-gray-400">Emails Capturados: {storedEmails.length}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Cerrar Sesión
                </button>
                <button
                  onClick={() => setShowEmailDashboard(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {storedEmails.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">No hay emails capturados</h4>
                <p className="text-gray-400">Los emails se guardarán automáticamente cuando los usuarios interactúen con el chat.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {storedEmails.map((lead, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{lead.name}</h4>
                        <p className="text-cyan-400">{lead.email}</p>
                        <p className="text-gray-400 text-sm">{lead.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">
                          {new Date(lead.capturedAt).toLocaleString('es-CL')}
                        </p>
                        <span className="inline-block bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs mt-1">
                          {lead.source}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm mb-2"><strong>Teléfono:</strong> {lead.phone}</p>
                      <p className="text-gray-300 text-sm"><strong>Interés:</strong> {lead.interest}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => sendEmail(lead)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </button>
                      
                      <button
                        onClick={() => sendWhatsApp(lead)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                      
                      <button
                        onClick={() => copyLeadData(lead)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <AIChat onClose={() => setShowAIChat(false)} />
      )}
    </div>
  );
}

export default App;