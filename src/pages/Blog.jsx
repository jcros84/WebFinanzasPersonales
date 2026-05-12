import React from 'react';
import { ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      category: 'Ahorro',
      time: '5 min lectura',
      title: '5 Consejos para ahorrar sin esfuerzo',
      excerpt: 'Aprende la regla del 50/30/20 y cómo aplicarla de manera sencilla a tu vida diaria...',
      color: 'from-blue-400 to-blue-600',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop'
    },
    {
      category: 'Inversión',
      time: '8 min lectura',
      title: '¿Qué es el interés compuesto?',
      excerpt: 'La octava maravilla del mundo explicada para que cualquiera pueda entenderla y aprovecharla...',
      color: 'from-blue-400 to-purple-500',
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop'
    },
    {
      category: 'Seguridad',
      time: '10 min lectura',
      title: 'Cómo proteger tus activos digitales',
      excerpt: 'Guía práctica sobre ciberseguridad financiera para mantener tus ahorros a salvo de fraudes...',
      color: 'from-orange-400 to-red-500',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <main className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Recursos y Aprendizaje</h1>
          <p className="text-slate-600">Mejora tu cultura financiera con nuestros artículos semanales.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="flex flex-col group cursor-pointer">
              <div className="aspect-video bg-slate-200 rounded-2xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors z-10"></div>
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${post.color}`}></div>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary font-bold mb-4">
                <span className="uppercase tracking-widest">{post.category}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="text-slate-500 font-medium italic">{post.time}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4 group-hover:text-secondary transition-colors">{post.title}</h2>
              <p className="text-slate-600 mb-6 flex-grow">{post.excerpt}</p>
              <div className="flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Leer artículo <ArrowRight className="w-4 h-4 text-secondary" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;
