import { MapPin, Mail, Phone, Twitter, Facebook, Instagram } from 'lucide-react';

const ContactSection = () => (
  <section id="contacto" className="contact-section bg-[#050608] py-24 relative overflow-hidden">
    {/* Subtle background glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-teal-900/10 blur-[120px] rounded-full pointer-events-none" />

    <div className="container mx-auto px-4 lg:px-5 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contáctanos</h2>
        <p className="text-white/40 max-w-xl mx-auto">
          ¿Tienes preguntas o quieres colaborar? Estamos aquí para escucharte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
        {/* Card 1: Ubicación */}
        <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <MapPin size={24} strokeWidth={1.5} />
          </div>
          <h4 className="uppercase tracking-widest text-xs font-bold text-white/40 mb-3">Ubicación</h4>
          <div className="text-lg text-white font-medium">Ciudad Creativa, MX</div>
        </div>

        {/* Card 2: Correo */}
        <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <Mail size={24} strokeWidth={1.5} />
          </div>
          <h4 className="uppercase tracking-widest text-xs font-bold text-white/40 mb-3">Correo</h4>
          <div className="text-lg text-white font-medium">
            <a href="mailto:hola@detrasdelfiltro.com" className="hover:text-teal-400 transition-colors">
              hola@detrasdelfiltro.com
            </a>
          </div>
        </div>

        {/* Card 3: Teléfono */}
        <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <Phone size={24} strokeWidth={1.5} />
          </div>
          <h4 className="uppercase tracking-widest text-xs font-bold text-white/40 mb-3">Teléfono</h4>
          <div className="text-lg text-white font-medium">+52 (55) 1234 5678</div>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-8">
        <a href="#!" className="text-white/30 hover:text-white hover:scale-110 transition-all duration-300">
          <Twitter size={24} strokeWidth={1.5} />
        </a>
        <a href="#!" className="text-white/30 hover:text-white hover:scale-110 transition-all duration-300">
          <Facebook size={24} strokeWidth={1.5} />
        </a>
        <a href="#!" className="text-white/30 hover:text-white hover:scale-110 transition-all duration-300">
          <Instagram size={24} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  </section>
);

export default ContactSection;
