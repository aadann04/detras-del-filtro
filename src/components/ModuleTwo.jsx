import { useEffect, useRef } from 'react';
import { Button } from './ui/Button.jsx';
import { initPhotoEditor } from '../legacy/scripts';

const ModuleTwo = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initPhotoEditor();
  }, []);

  return (
    <section id="modulo2" className="projects-section bg-[#0b0d12] py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-teal-900/20 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-yellow-900/10 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 lg:px-5 relative z-10">
        <div className="flex flex-wrap justify-center mb-16">
          <div className="w-full lg:w-8/12 text-center">
            <h2 className="mb-6 text-4xl font-bold text-white tracking-tight">Editor Rápido</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Sube una foto y aplica ajustes sencillos. Comprueba en segundos lo fácil que es estilizar piel, sombras
              y proporciones para crear una versión "mejorada".
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center -mx-4">
          <div className="w-full lg:w-11/12 px-4">
            <div className="editor2d-shell flex flex-col-reverse lg:flex-row gap-8">

              {/* Left Panel: Controls */}
              <div className="w-full lg:w-4/12 flex flex-col gap-6">
                <div className="editor-panel bg-gray-900/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 h-full">

                  {/* Upload Area */}
                  <div
                    id="dropzone2d"
                    className="dropzone2d border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center transition-all hover:border-teal-500/50 hover:bg-teal-500/5 group cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 group-hover:text-teal-400 mb-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors text-center">
                      <span className="font-semibold text-teal-400">Click para subir</span> o arrastra aquí
                    </p>
                    <input id="file2d" type="file" accept="image/*" hidden />
                    <small className="text-gray-600 mt-2 text-xs">JPG/PNG - Max. 50MB</small>
                  </div>

                  {/* URL Loader */}
                  <div className="url-loader">
                    <div className="flex rounded-lg overflow-hidden border border-gray-700 focus-within:border-teal-500/50 transition-colors">
                      <input
                        id="url2d"
                        type="url"
                        className="block w-full px-4 py-2.5 text-sm text-gray-200 bg-black/20 focus:outline-none placeholder-gray-600"
                        placeholder="O pega un enlace https://..."
                      />
                      <button id="cargarUrl2d" className="px-4 py-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-xs font-medium uppercase tracking-wider" type="button">
                        Cargar
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-2" />

                  {/* Sliders Grid */}
                  <div className="space-y-5 overflow-y-auto pr-2 max-h-[400px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 transition-colors">
                    {[
                      { id: 'expo2d', label: 'Exposición', min: -100, max: 100 },
                      { id: 'contraste2d', label: 'Contraste', min: -100, max: 100 },
                      { id: 'sombras2d', label: 'Sombras', min: -100, max: 100 },
                      { id: 'luces2d', label: 'Luces', min: -100, max: 100 },
                      { id: 'temp2d', label: 'Temperatura', min: -100, max: 100 },
                      { id: 'vibrancia2d', label: 'Vibrancia', min: -100, max: 100 },
                      { id: 'claridad2d', label: 'Claridad', min: -100, max: 100 },
                      { id: 'vineta2d', label: 'Viñeta', min: 0, max: 100 },
                    ].map((control) => (
                      <div key={control.id} className="control-block">
                        <div className="flex justify-between mb-2">
                          <label htmlFor={control.id} className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                            {control.label}
                          </label>
                        </div>
                        <input
                          id={control.id}
                          type="range"
                          min={control.min}
                          max={control.max}
                          step="1"
                          defaultValue="0"
                          className="custom-slider"
                        />
                      </div>
                    ))}

                    {/* Tools */}
                    <div className="space-y-4 pt-4 border-t border-gray-800">
                      <div className="control-block">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold">Suavizado de Piel</span>
                          <button id="smoothToggle" className="px-2 py-1 text-[10px] uppercase tracking-wider border border-gray-600 text-gray-400 rounded hover:border-teal-500 hover:text-teal-500 transition-colors" type="button">
                            OFF
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Intensidad</label>
                            <input id="smoothIntensity2d" type="range" min="0" max="100" defaultValue="40" className="custom-slider" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Brocha</label>
                            <input id="smoothBrush2d" type="range" min="10" max="200" defaultValue="80" className="custom-slider" />
                          </div>
                        </div>
                      </div>

                      <div className="control-block">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs uppercase tracking-wider text-yellow-500 font-semibold">Liquify</span>
                          <button id="liquifyToggle" className="px-2 py-1 text-[10px] uppercase tracking-wider border border-gray-600 text-gray-400 rounded hover:border-yellow-500 hover:text-yellow-500 transition-colors" type="button">
                            OFF
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Tamaño</label>
                            <input id="liquifyBrush2d" type="range" min="20" max="250" defaultValue="120" className="custom-slider custom-slider-yellow" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Fuerza</label>
                            <input id="liquifyStrength2d" type="range" min="5" max="100" defaultValue="35" className="custom-slider custom-slider-yellow" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-800">
                    <button id="toggleComparador" className="col-span-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs uppercase tracking-wider font-medium rounded-lg transition-colors flex items-center justify-center gap-2" type="button">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      Comparar
                    </button>
                    <button id="reset2d" className="py-2 px-4 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-xs uppercase tracking-wider font-medium rounded-lg transition-colors" type="button">
                      Reset
                    </button>
                    <button id="descargar2d" className="py-2 px-4 bg-teal-600 hover:bg-teal-500 text-white text-xs uppercase tracking-wider font-bold rounded-lg shadow-lg shadow-teal-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" type="button" disabled>
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel: Canvas */}
              <div className="w-full lg:w-8/12">
                <div className="editor-canvas stage3d relative w-full rounded-2xl overflow-visible bg-[#050608] border border-white/10 shadow-2xl ring-1 ring-white/5 mx-auto">
                  <div className="editor-canvas-inner relative w-full min-h-[200px] flex items-center justify-center">
                    <canvas id="canvas2d" width="1280" height="720" className="max-w-full max-h-[80vh] w-auto h-auto block"></canvas>

                    {/* Slider Comparador */}
                    <input
                      id="splitComparador"
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="100"
                      className="before-after-slider absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-white/20 rounded-full appearance-none cursor-ew-resize opacity-0 transition-opacity duration-300 pointer-events-none z-20 hover:bg-white/30 focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.5)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-gray-500 text-xs font-medium tracking-wide">
                    USA LOS CONTROLES A LA IZQUIERDA PARA AJUSTAR • ARRASTRA EN LA IMAGEN PARA RETOCAR
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleTwo;
