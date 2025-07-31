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
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight px-2">
              Transformamos tu
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-1 sm:mt-2">
                Negocio Digital
              </span>
            </h1>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
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