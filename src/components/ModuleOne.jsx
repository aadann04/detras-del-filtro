import { useEffect, useRef } from 'react';
import { DottedGlowBackground } from './ui/dotted-glow-background';
import { initModule1 } from '../legacy/modulo1-3d';

const ModuleOne = () => {
  const stageRef = useRef(null);
  const toggleLightRef = useRef(null);
  const presetRef = useRef(null);
  const intensityRef = useRef(null);
  const resetRef = useRef(null);
  const captureRef = useRef(null);

  useEffect(() => {
    const cleanup = initModule1({
      stage: stageRef.current,
      toggleLightButton: toggleLightRef.current,
      presetSelect: presetRef.current,
      intensitySlider: intensityRef.current,
      resetButton: resetRef.current,
      captureButton: captureRef.current,
    });
    return cleanup;
  }, []);

  return (
    <section
      id="modulo1"
      className="about-section text-center relative overflow-hidden py-8 pb-20 scroll-mt-32 lg:scroll-mt-40"
    >
      <DottedGlowBackground
        className="pointer-events-none absolute inset-0"
        opacity={0.4}
        gap={20}
        radius={1.8}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
      <div className="relative z-10 container mx-auto px-4 lg:px-5">
        <div className="flex flex-wrap justify-center -mx-4">
          <div className="w-full lg:w-8/12 px-4">
            <h2 className="text-white mb-6 text-4xl font-bold tracking-tight">Luz y forma</h2>
            <p className="text-white/50 mb-8">
              Explora un modelo 3D y mueve las luces a tu antojo. Verás cómo cambian contornos, la marcación muscular y volumen con solo modificar iluminación, dirección y dureza de la luz.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center -mx-4">
          <div className="w-full lg:w-10/12 px-4">
            <div
              id="stage3d"
              ref={stageRef}
              className="stage3d aspect-video w-full rounded-xl overflow-hidden bg-black/20 shadow-2xl"
              aria-label="Escena 3D interactiva"
            />

            <div className="control-deck mt-6 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Sección Izquierda: Control Principal */}
                <div className="md:col-span-3 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                  <span className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">Interacción</span>
                  <button
                    id="toggleLight"
                    ref={toggleLightRef}
                    className="w-full py-2.5 px-4 text-sm font-medium rounded-lg border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span>Mover Luz: OFF</span>
                  </button>
                </div>

                {/* Sección Central: Ajustes */}
                <div className="md:col-span-6 flex flex-col gap-4 px-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="presetLight" className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                        Esquema de Luz
                      </label>
                      <div className="relative">
                        <select
                          id="presetLight"
                          ref={presetRef}
                          className="w-full appearance-none bg-black/40 text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors cursor-pointer"
                        >
                          <option value="">Personalizado</option>
                          <option value="cenital">Cenital (Dramático)</option>
                          <option value="contrapicada">Contrapicada (Misterio)</option>
                          <option value="perfil_izq">Perfil Izquierdo</option>
                          <option value="perfil_der">Perfil Derecho</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="intensity" className="text-xs uppercase tracking-wider text-gray-400 font-medium flex justify-between">
                        <span>Intensidad</span>
                      </label>
                      <div className="flex items-center h-full">
                        <input
                          type="range"
                          id="intensity"
                          ref={intensityRef}
                          min="0"
                          max="6"
                          step="0.1"
                          defaultValue="2.4"
                          className="custom-slider"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección Derecha: Acciones */}
                <div className="md:col-span-3 flex flex-col items-center md:items-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4 gap-3">
                  <button
                    id="capture3d"
                    ref={captureRef}
                    className="w-full py-2 px-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-teal-500/20 hover:from-teal-500 hover:to-teal-400 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capturar
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleOne;


