import { Button } from "./ui/Button.jsx";

const Hero = () => (
  <header id="inicio" className="masthead relative w-full h-screen min-h-[40rem] bg-[#050608] flex items-center justify-center overflow-hidden">
    {/* Spotlight Effect */}
    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_60%)] blur-[120px] pointer-events-none opacity-60 animate-pulse-slow" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(255,209,102,0.08),transparent_60%)] blur-[100px] pointer-events-none opacity-40" />

    <div className="container mx-auto px-4 lg:px-5 relative z-10">
      <div className="flex justify-center">
        <div className="text-center max-w-4xl">
          <h1 className="mx-auto my-0 uppercase font-extrabold text-5xl sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-2xl">
            Detras del <br className="md:hidden" /> Filtro
          </h1>
          <h2 className="text-white/60 mx-auto mt-6 mb-12 max-w-2xl text-lg md:text-xl font-light leading-relaxed">
            Descubre lo fácil que es cambiar una imagen y cómo la luz, el ángulo y los retoques alteran lo que creemos ver.
          </h2>
          <a
            href="#modulo1"
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('modulo1');
              if (element) {
                const offset = -50; // Ajuste manual para coincidir con la navbar
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - offset;

                const startPosition = window.scrollY;
                const distance = offsetPosition - startPosition;
                const duration = 1000; // Duración más equilibrada para suavidad
                let start = null;

                function animation(currentTime) {
                  if (start === null) start = currentTime;
                  const timeElapsed = currentTime - start;

                  // EaseOutCubic: Empieza rápido y frena suavemente (sin pausa al inicio)
                  const ease = (t) => 1 - Math.pow(1 - t, 3);

                  const run = ease(Math.min(timeElapsed / duration, 1)) * distance + startPosition;
                  window.scrollTo(0, run);

                  if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                requestAnimationFrame(animation);
              }
            }}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Empecemos
            </span>
          </a>
        </div>
      </div>
    </div>
  </header>
);

export default Hero;
