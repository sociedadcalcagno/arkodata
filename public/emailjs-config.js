// Configuración de EmailJS para ArkoData
// Este archivo se carga opcionalmente para habilitar emails

(function() {
  // Solo cargar si EmailJS no está ya cargado
  if (window.emailjs) return;
  
  // Cargar EmailJS de forma asíncrona
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  script.async = true;
  script.onload = function() {
    console.log('📧 EmailJS cargado correctamente');
  };
  script.onerror = function() {
    console.log('⚠️ EmailJS no pudo cargarse - continuando sin emails');
  };
  
  document.head.appendChild(script);
})();