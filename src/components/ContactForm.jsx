import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare } from 'lucide-react';
import { postContactMessage } from '../services/messages';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await postContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="glass-card p-8 lg:p-12">
      {status === 'success' ? (
        <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">¡Mensaje enviado!</h3>
          <p className="text-slate-600">Gracias por contactarnos. Te responderemos pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-2 text-slate-700">Nombre completo</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">
                <User size={20} />
              </span>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                placeholder="Tu nombre" 
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2 text-slate-700">Correo electrónico</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">
                <Mail size={20} />
              </span>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="tu@email.com" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold mb-2 text-slate-700">Mensaje</label>
            <textarea 
              id="message" 
              name="message" 
              rows="4" 
              required 
              placeholder="¿En qué podemos ayudarte?" 
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 transition-all"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className={`btn-primary w-full flex items-center justify-center gap-2 group ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'} 
            {status !== 'loading' && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </button>
          
          {status === 'error' && (
            <p className="text-red-500 text-sm text-center">Hubo un error al enviar el mensaje. Inténtalo de nuevo.</p>
          )}
        </form>
      )}
    </div>
  );
};

export default ContactForm;
