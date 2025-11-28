
export const MISSIONS_POOL = [
    // --- Misiones 3D (Iluminación) ---
    {
        id: '3d_rembrandt',
        module: '3d',
        title: 'El Clásico Rembrandt',
        description: 'Busca el famoso triángulo de luz en la mejilla opuesta a la luz.',
        hint: 'Coloca la luz a unos 45° laterales y ligeramente elevada.',
        target: {
            theta: 45, // Grados
            phi: 60,   // Grados (0 es arriba)
        },
        tolerance: 25 // Grados de margen
    },
    {
        id: '3d_silhouette',
        module: '3d',
        title: 'Silueta Misteriosa',
        description: 'Oculta los detalles y resalta solo el contorno.',
        hint: 'Coloca la luz completamente detrás del modelo.',
        target: {
            theta: 180,
            phi: 90,
        },
        tolerance: 35
    },
    {
        id: '3d_split',
        module: '3d',
        title: 'Cara Dividida',
        description: 'Dramatismo total: media cara en luz, media en sombra.',
        hint: 'Mueve la luz exactamente a un lado (90°).',
        target: {
            theta: 90,
            phi: 90,
        },
        tolerance: 15
    },
    {
        id: '3d_godfather',
        module: '3d',
        title: 'Luz Cenital',
        description: 'Como en el cine clásico, crea sombras fuertes en los ojos.',
        hint: 'Sube la luz casi hasta arriba del todo.',
        target: {
            phi: 15,
        },
        tolerance: 20
    },
    {
        id: '3d_horror',
        module: '3d',
        title: 'Terror Nocturno',
        description: 'Una iluminación antinatural que viene desde abajo.',
        hint: 'Baja la luz por debajo del nivel de la cara.',
        target: {
            phi: 140,
        },
        tolerance: 25
    },

    // --- Misiones 2D (Edición) ---
    {
        id: '2d_noir',
        module: '2d',
        title: 'Cine Negro',
        description: 'Elimina el color y busca un contraste fuerte.',
        hint: 'Baja la vibrancia al mínimo y sube el contraste.',
        target: {
            vibrance: -100,
            contrast: 50
        },
        tolerance: { vibrance: 15, contrast: 25 }
    },
    {
        id: '2d_ethereal',
        module: '2d',
        title: 'Sueño Etéreo',
        description: 'Suaviza la realidad para un look onírico.',
        hint: 'Reduce la claridad (negativo) y sube un poco la exposición.',
        target: {
            clarity: -50,
            exposure: 20
        },
        tolerance: { clarity: 25, exposure: 20 }
    },
    {
        id: '2d_warmth',
        module: '2d',
        title: 'Atardecer Cálido',
        description: 'Dale a la foto una temperatura acogedora.',
        hint: 'Aumenta la temperatura y añade un poco de sombras.',
        target: {
            temperature: 60,
            shadows: 20
        },
        tolerance: { temperature: 25, shadows: 25 }
    },
    {
        id: '2d_focus',
        module: '2d',
        title: 'Enfoque Central',
        description: 'Oscurece los bordes para centrar la atención.',
        hint: 'Aplica una viñeta fuerte.',
        target: {
            vignette: 70
        },
        tolerance: { vignette: 25 }
    },
    {
        id: '2d_cyber',
        module: '2d',
        title: 'Estilo Cyberpunk',
        description: 'Frío, contrastado y digital.',
        hint: 'Baja la temperatura (frío) y sube el contraste.',
        target: {
            temperature: -50,
            contrast: 40
        },
        tolerance: { temperature: 25, contrast: 25 }
    }
];

// Función auxiliar para obtener misiones diarias basadas en la fecha
export function getDailyMissions() {
    const today = new Date().toDateString(); // "Wed Nov 27 2024"

    // Simple hash de la fecha para usar como semilla
    let seed = 0;
    for (let i = 0; i < today.length; i++) {
        seed = ((seed << 5) - seed) + today.charCodeAt(i);
        seed |= 0;
    }

    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const m3d = MISSIONS_POOL.filter(m => m.module === '3d');
    const m2d = MISSIONS_POOL.filter(m => m.module === '2d');

    const daily3d = m3d[Math.floor(random() * m3d.length)];
    const daily2d = m2d[Math.floor(random() * m2d.length)];

    return [daily3d, daily2d];
}
