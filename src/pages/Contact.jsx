import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <main className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Hablemos de tu futuro</h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            ¿Tienes dudas sobre cómo FinanzaPro puede ayudarte? Nuestro equipo de expertos está listo para asesorarte.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-secondary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Email</h4>
                <p className="text-slate-600">soporte@finanzapro.com</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Chat en vivo</h4>
                <p className="text-slate-600">Disponible de Lunes a Viernes (9:00 - 18:00)</p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </main>
  );
};

export default Contact;
