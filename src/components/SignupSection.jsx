import { Send } from 'lucide-react';

const SignupSection = () => (
  <section className="signup-section py-32 bg-[#0b0d12] relative overflow-hidden" id="signup">
    {/* Background Gradient Mesh */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-teal-900/5 to-black/0 pointer-events-none" />

    <div className="container mx-auto px-4 lg:px-5 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-600/20 mb-8 ring-1 ring-white/10">
          <Send className="text-teal-400 ml-1" size={32} strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Únete a la conversación
        </h2>
        <p className="text-lg text-white/50 mb-10 font-light">
          Recibe ideas exclusivas, tutoriales y trucos para experimentar con luz y retoque digital.
        </p>

        <form className="form-signup relative max-w-lg mx-auto" id="contactForm">
          <div className="relative flex items-center">
            <input
              className="w-full pl-6 pr-36 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-300 backdrop-blur-sm"
              id="emailAddress"
              type="email"
              placeholder="Ingresa tu correo..."
              aria-label="Ingresa tu correo"
            />
            <button
              className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-teal-600 hover:bg-teal-500 text-white rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
              id="submitButton"
              type="button"
            >
              Suscribirse
            </button>
          </div>
          <p className="mt-4 text-xs text-white/20">
            No enviamos spam. Puedes darte de baja en cualquier momento.
          </p>
        </form>
      </div>
    </div>
  </section>
);

export default SignupSection;
