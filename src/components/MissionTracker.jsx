import { useEffect, useState } from 'react';
import { getDailyMissions } from '../lib/missionsData';
import { CheckCircle2, Circle, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

const MissionTracker = () => {
    const [missions, setMissions] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [completed, setCompleted] = useState({});
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        // Cargar misiones del día
        const daily = getDailyMissions();
        setMissions(daily);

        // Cargar estado de completado
        const today = new Date().toDateString();
        const savedStatus = JSON.parse(localStorage.getItem('daily_missions_status') || '{}');
        const savedDate = localStorage.getItem('daily_missions_date');

        // Si es un día nuevo, resetear estado visual (pero mantener racha si aplica)
        if (savedDate !== today) {
            setCompleted({});
            localStorage.setItem('daily_missions_status', JSON.stringify({}));
            localStorage.setItem('daily_missions_date', today);
        } else {
            setCompleted(savedStatus);
        }

        // Calcular Racha
        const storedStreak = parseInt(localStorage.getItem('mission_streak') || '0');
        const lastStreakDate = localStorage.getItem('last_streak_date');

        // Verificar si la racha se rompió (si la última vez fue antes de ayer)
        if (lastStreakDate) {
            const lastDate = new Date(lastStreakDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            // Comparar strings de fecha para evitar problemas de hora
            if (lastDate.toDateString() !== today && lastDate.toDateString() !== yesterday.toDateString()) {
                setStreak(0);
                localStorage.setItem('mission_streak', '0');
            } else {
                setStreak(storedStreak);
            }
        } else {
            setStreak(storedStreak);
        }

    }, []);

    useEffect(() => {
        // Control de visibilidad basado en scroll
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight * 0.8;
            const footerOffset = document.body.scrollHeight - window.innerHeight - 200;

            if (scrollY > heroHeight && scrollY < footerOffset) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handle3DUpdate = (e) => {
            const { theta, phi } = e.detail;
            checkMission('3d', { theta, phi });
        };

        const handle2DUpdate = (e) => {
            const adjustments = e.detail;
            checkMission('2d', adjustments);
        };

        window.addEventListener('mission:update-3d', handle3DUpdate);
        window.addEventListener('mission:update-2d', handle2DUpdate);

        return () => {
            window.removeEventListener('mission:update-3d', handle3DUpdate);
            window.removeEventListener('mission:update-2d', handle2DUpdate);
        };
    }, [missions, completed]); // Añadido completed a dependencias para tener estado fresco

    const checkMission = (moduleType, currentValues) => {
        const mission = missions.find(m => m.module === moduleType);
        if (!mission || completed[mission.id]) return;

        let isMatch = true;

        for (const [key, targetValue] of Object.entries(mission.target)) {
            const currentValue = currentValues[key];
            if (currentValue === undefined) continue;

            let tolerance = mission.tolerance;
            if (typeof tolerance === 'object') {
                tolerance = tolerance[key] || 10;
            }

            let diff = Math.abs(currentValue - targetValue);
            if (key === 'theta') {
                const rad2deg = (r) => (r * 180) / Math.PI;
                const currentDeg = rad2deg(currentValue) % 360;
                const targetDeg = targetValue % 360;
                let angleDiff = Math.abs(currentDeg - targetDeg);
                if (angleDiff > 180) angleDiff = 360 - angleDiff;
                diff = angleDiff;
            } else if (key === 'phi') {
                const rad2deg = (r) => (r * 180) / Math.PI;
                const currentDeg = rad2deg(currentValue);
                diff = Math.abs(currentDeg - targetValue);
            }

            if (diff > tolerance) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            completeMission(mission.id);
        }
    };
    const completeMission = (id) => {
        const newCompleted = { ...completed, [id]: true };
        setCompleted(newCompleted);
        localStorage.setItem('daily_missions_status', JSON.stringify(newCompleted));

        // Feedback Auditivo
        playSuccessSound();

        // Verificar si TODAS están completas ahora
        const allDone = missions.every(m => newCompleted[m.id] || m.id === id);

        if (allDone && missions.length > 0) {
            triggerCelebration();
            updateStreak();
        }
    };

    const playSuccessSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        } catch (e) {
            // Ignorar errores de audio
        }
    };

    const updateStreak = () => {
        const today = new Date().toDateString();
        const lastStreakDate = localStorage.getItem('last_streak_date');

        // Solo incrementar si no se ha incrementado hoy
        if (lastStreakDate !== today) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            localStorage.setItem('mission_streak', newStreak.toString());
            localStorage.setItem('last_streak_date', today);
        }
    };

    const triggerCelebration = () => {
        playCelebrationSound(); // Sonido de victoria
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#2dd4bf', '#fbbf24', '#ffffff'] // Teal, Amber, White
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#2dd4bf', '#fbbf24', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    const playCelebrationSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            // Melodía triunfal simple (Do-Mi-Sol-Do agudo)
            const notes = [523.25, 659.25, 783.99, 1046.50];
            const times = [0, 0.1, 0.2, 0.3]; // Tiempos de inicio

            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle'; // Sonido más brillante tipo trompeta/juego
                osc.frequency.setValueAtTime(freq, ctx.currentTime + times[i]);

                gain.gain.setValueAtTime(0.1, ctx.currentTime + times[i]);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + times[i] + 0.4);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + times[i]);
                osc.stop(ctx.currentTime + times[i] + 0.4);
            });
        } catch (e) {
            // Ignorar
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-72 pointer-events-none">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto transition-all duration-500 animate-in fade-in slide-in-from-right-10">

                {/* Header con Racha */}
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Misiones</h3>
                    </div>

                    {streak > 0 && (
                        <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-full" title="Racha de días seguidos">
                            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                            <span className="text-xs font-bold text-orange-400">{streak} días</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {missions.map((mission) => {
                        const isDone = completed[mission.id];
                        return (
                            <div key={mission.id} className={`relative group transition-all duration-300 ${isDone ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 transition-colors duration-300 ${isDone ? 'text-teal-400' : 'text-gray-500'}`}>
                                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-semibold transition-colors ${isDone ? 'text-teal-400 line-through' : 'text-gray-200'}`}>
                                            {mission.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                            {mission.description}
                                        </p>
                                        {!isDone && (
                                            <div className="mt-2 text-[10px] text-teal-200/60 bg-teal-900/20 px-2 py-1 rounded inline-block border border-teal-500/10">
                                                Tip: {mission.hint}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {Object.keys(completed).length === missions.length && missions.length > 0 && (
                    <div className="mt-4 text-center">
                        <span className="text-xs font-bold text-yellow-400 animate-pulse">¡TODAS LAS MISIONES COMPLETADAS!</span>

                        <div className="mt-3 space-y-2">
                            {missions.map(m => m.insight && (
                                <p key={m.id} className="text-[11px] text-gray-300 italic leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-700">
                                    "{m.insight}"
                                </p>
                            ))}
                        </div>

                        <p className="text-xs text-gray-300 mt-3 font-medium border-t border-white/10 pt-2">Vuelve mañana para una nueva misión</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionTracker;
