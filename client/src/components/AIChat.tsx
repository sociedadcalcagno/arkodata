import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  onClose: () => void;
}

export default function AIChat({ onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu ArkoAsistente inteligente 🤖\n\nPuedo ayudarte con:\n• Información sobre nuestros servicios\n• Resolver dudas técnicas\n• Conectarte con nuestro equipo\n• Generar propuestas personalizadas\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
    focusInput(); // Enfocar input después de cada mensaje
  }, [messages]);

  useEffect(() => {
    // Enfocar input cuando se abre el chat
    focusInput();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    focusInput(); // Mantener foco después de enviar

    try {
      // Aquí iría la integración con OpenAI
      // Por ahora, respuestas simuladas inteligentes
      const response = await simulateAIResponse(userMessage.content);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Disculpa, tuve un problema técnico. ¿Podrías intentar de nuevo o contactar directamente a nuestro equipo?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      focusInput(); // Mantener foco después de recibir respuesta
    }
  };

  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));

    const input = userInput.toLowerCase();

    // Respuestas inteligentes basadas en palabras clave
    if (input.includes('precio') || input.includes('costo') || input.includes('cuanto')) {
      return `💰 **Precios de ArkoData**\n\nNuestros precios varían según tus necesidades:\n\n🔹 **Consultoría básica**: Desde $150.000 CLP\n🔹 **Desarrollo web**: Desde $500.000 CLP\n🔹 **ArkoAsistente**: Desde $80.000 CLP/mes\n🔹 **Soluciones IA**: Cotización personalizada\n\n¿Te gustaría que un asesor te prepare una cotización específica para tu proyecto?`;
    }

    if (input.includes('arkoasistente') || input.includes('asistente') || input.includes('bot')) {
      return `🤖 **ArkoAsistente - Tu Asistente Virtual**\n\n✨ **Características principales:**\n• Atención 24/7 automatizada\n• Captura de leads inteligente\n• Integración WhatsApp y Web\n• Respuestas personalizadas\n• Dashboard de gestión\n\n📊 **Beneficios:**\n• Aumenta conversiones hasta 40%\n• Reduce tiempo de respuesta a segundos\n• Captura leads mientras duermes\n\n¿Quieres ver una demo personalizada?`;
    }

    if (input.includes('web') || input.includes('sitio') || input.includes('página')) {
      return `🌐 **Desarrollo Web Profesional**\n\n🚀 **Nuestros servicios incluyen:**\n• Diseño responsive moderno\n• Optimización SEO avanzada\n• E-commerce completo\n• Aplicaciones web progresivas\n• Integración con sistemas existentes\n\n⚡ **Tecnologías que usamos:**\n• React, Next.js, Vue\n• Node.js, Python\n• Bases de datos modernas\n• Cloud hosting optimizado\n\n¿Tienes algún proyecto específico en mente?`;
    }

    if (input.includes('ia') || input.includes('inteligencia artificial') || input.includes('machine learning')) {
      return `🧠 **Soluciones de Inteligencia Artificial**\n\n🎯 **Servicios especializados:**\n• Chatbots conversacionales\n• Análisis predictivo de datos\n• Automatización de procesos\n• Reconocimiento de patrones\n• Sistemas de recomendación\n\n💡 **Casos de uso populares:**\n• Atención al cliente automatizada\n• Análisis de sentimientos\n• Optimización de inventarios\n• Detección de fraudes\n\n¿En qué área te gustaría implementar IA?`;
    }

    if (input.includes('contacto') || input.includes('equipo') || input.includes('asesor')) {
      return `📞 **Contacta con Nuestro Equipo**\n\n👥 **Formas de contacto:**\n• **WhatsApp**: +56 9 3355 3024\n• **Email**: contacto@arkodata.cl\n• **Formulario web**: Disponible en la página\n\n⏰ **Horarios de atención:**\n• Lunes a Viernes: 9:00 - 18:00\n• Sábados: 10:00 - 14:00\n• Emergencias: 24/7 por WhatsApp\n\n¿Prefieres que un asesor te contacte directamente?`;
    }

    if (input.includes('seguridad') || input.includes('ciberseguridad') || input.includes('protección')) {
      return `🛡️ **Ciberseguridad Empresarial**\n\n🔒 **Servicios de protección:**\n• Auditorías de seguridad completas\n• Protección contra malware avanzado\n• Backup y recuperación de datos\n• Capacitación en seguridad\n• Monitoreo 24/7\n\n⚠️ **Estadísticas importantes:**\n• 95% de ataques son evitables\n• Backup reduce pérdidas en 80%\n• Capacitación previene 70% de incidentes\n\n¿Quieres una evaluación gratuita de tu seguridad actual?`;
    }

    // Respuesta por defecto inteligente
    return `Entiendo tu consulta sobre "${userInput}". \n\n🎯 **Te puedo ayudar con:**\n• Información detallada sobre nuestros servicios\n• Cotizaciones personalizadas\n• Conexión con nuestro equipo técnico\n• Programar una demo gratuita\n\n¿Hay algo específico que te gustaría saber sobre ArkoData o nuestras soluciones tecnológicas?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col border border-cyan-400/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">ArkoAsistente</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">En línea</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-cyan-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-gray-100'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-cyan-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('es-CL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-gray-300 text-sm">ArkoAsistente está escribiendo...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-slate-700">
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
              disabled={isLoading}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white p-3 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Presiona Enter para enviar • Shift + Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
}