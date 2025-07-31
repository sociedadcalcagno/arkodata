import { X, Copy, ExternalLink, User, Building, Calendar, Phone, Mail } from 'lucide-react';
import { useLeads } from '../lib/api';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({ onClose, onLogout }: AdminDashboardProps) {
  const { data: leads = [], isLoading } = useLeads();

  // Función para copiar datos de un lead
  const copyLeadData = (lead: any) => {
    const data = `Nombre: ${lead.name}\nEmail: ${lead.email}\nEmpresa: ${lead.company}\nTeléfono: ${lead.phone}\nInterés: ${lead.interest}\nFecha: ${new Date(lead.createdAt).toLocaleString('es-CL')}`;
    navigator.clipboard.writeText(data);
    alert('Datos copiados al portapapeles');
  };

  // Función para enviar WhatsApp
  const sendWhatsApp = (lead: any) => {
    const message = `Hola ${lead.name}, vi tu consulta desde ArkoData. ¿Te gustaría que conversemos sobre ${lead.interest}?`;
    const phone = lead.phone?.replace(/[^\d]/g, '') || '';
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      alert('Este lead no tiene teléfono registrado');
    }
  };

  // Función para enviar email
  const sendEmail = (lead: any) => {
    const subject = `Respuesta a tu consulta - ArkoData`;
    const body = `Hola ${lead.name},\n\nGracias por contactarnos. Hemos recibido tu consulta sobre: "${lead.interest}"\n\nNos pondremos en contacto contigo pronto.\n\nSaludos,\nEquipo ArkoData`;
    window.open(`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-6xl h-[80vh] flex flex-col border border-red-500/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h3 className="text-2xl font-bold text-white">Dashboard Administrativo</h3>
            <p className="text-gray-400">Gestión de leads y contactos ({leads.length} registros)</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Cargando leads...</p>
              </div>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">No hay leads registrados</h4>
                <p className="text-gray-400">Los nuevos contactos aparecerán aquí</p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto h-full p-6">
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">{lead.name}</h4>
                            <p className="text-sm text-gray-400">
                              {new Date(lead.createdAt).toLocaleString('es-CL')} • {lead.source}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyLeadData(lead)}
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                          title="Copiar datos"
                        >
                          <Copy className="w-4 h-4 text-white" />
                        </button>
                        
                        <button
                          onClick={() => sendEmail(lead)}
                          className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                          title="Enviar email"
                        >
                          <Mail className="w-4 h-4 text-white" />
                        </button>
                        
                        {lead.phone && lead.phone !== 'No proporcionado' && (
                          <button
                            onClick={() => sendWhatsApp(lead)}
                            className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                            title="Enviar WhatsApp"
                          >
                            <Phone className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{lead.email}</span>
                        </div>
                        
                        {lead.phone && lead.phone !== 'No proporcionado' && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{lead.phone}</span>
                          </div>
                        )}
                        
                        {lead.company && lead.company !== 'No especificada' && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{lead.company}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-800 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Mensaje/Interés:</h5>
                      <p className="text-white text-sm leading-relaxed">{lead.interest}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}