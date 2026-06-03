import { useState } from 'react';
import { Send } from 'lucide-react';
import { useCreateLead } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import AIChat from '../components/AIChat';
import ArkoLanding from '../components/landing/ArkoLanding';

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
    submitError: '',
  });

  const createLead = useCreateLead();
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactForm((prev) => ({ ...prev, submitError: '', isSubmitting: true }));

    try {
      if (!contactForm.name.trim()) throw new Error('El nombre es requerido');
      if (!contactForm.email.trim()) throw new Error('El email es requerido');
      if (!contactForm.message.trim()) throw new Error('El mensaje es requerido');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactForm.email)) {
        throw new Error('Por favor ingresa un email valido');
      }

      await createLead.mutateAsync({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        company: contactForm.company.trim() || 'No especificada',
        phone: contactForm.phone.trim() || 'No proporcionado',
        interest: contactForm.message.trim(),
        source: 'Formulario de contacto web',
      });

      setContactForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        isSubmitting: false,
        submitSuccess: true,
        submitError: '',
      });

      toast({
        title: 'Mensaje enviado',
        description: 'Tu mensaje ha sido enviado exitosamente. Te contactaremos pronto.',
      });

      setTimeout(() => {
        setContactForm((prev) => ({ ...prev, submitSuccess: false }));
        setShowContactForm(false);
      }, 3000);
    } catch (error) {
      setContactForm((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: error instanceof Error ? error.message : 'Error desconocido',
      }));

      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <ArkoLanding onOpenChat={() => setShowAIChat(true)} onOpenContact={() => setShowContactForm(true)} />

      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cyan-400/30 bg-slate-900 p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-white">Solicitar Diagnostico</h3>
              <p className="text-slate-400">Cuentanos sobre tu operacion o proyecto</p>
            </div>

            {contactForm.submitSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                  <Send className="h-8 w-8 text-emerald-400" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-white">Mensaje enviado</h4>
                <p className="text-slate-400">Te contactaremos pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Tu nombre *"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Tu email *"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Telefono"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Empresa"
                    value={contactForm.company}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, company: e.target.value }))}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="Describe el proceso, problema u oportunidad que quieres resolver *"
                  value={contactForm.message}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                  required
                />

                {contactForm.submitError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/15 p-3">
                    <p className="text-sm text-red-300">{contactForm.submitError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 rounded-lg border border-slate-700 px-6 py-3 text-slate-300 transition-colors hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={contactForm.isSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-medium text-white transition-all hover:from-cyan-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {contactForm.isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <span>Enviar</span>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showAIChat && <AIChat onClose={() => setShowAIChat(false)} />}
    </>
  );
}
