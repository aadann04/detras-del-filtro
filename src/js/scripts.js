window.addEventListener('DOMContentLoaded', event => {

    // Reset scroll position on reload so landing starts at hero
    const navigationEntries = performance.getEntriesByType
        ? performance.getEntriesByType('navigation')
        : [];
    const navType = navigationEntries.length
        ? navigationEntries[0].type
        : (performance.navigation || {}).type;
    const isReloadNavigation = navType === 'reload' || navType === 1;

    if (isReloadNavigation) {
        if (window.location.hash && history.replaceState) {
            const cleanUrl = window.location.pathname + window.location.search;
            history.replaceState(null, '', cleanUrl);
        }
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    const navList = mainNav?.querySelector('.navbar-nav');
    const navLinks = navList ? Array.from(navList.querySelectorAll('.nav-link')) : [];
    let navIndicator = null;
    const DESKTOP_BREAKPOINT = 992;
    const TOP_HIDE_THRESHOLD = 60;

    const ensureNavIndicator = () => {
        if (!navList) return null;
        if (!navIndicator) {
            navIndicator = document.createElement('span');
            navIndicator.className = 'nav-active-indicator';
            navList.appendChild(navIndicator);
        }
        return navIndicator;
    };

    const hideNavIndicator = () => {
        if (!navIndicator) return;
        navIndicator.classList.remove('is-visible');
    };

    const shouldShowIndicator = () => window.innerWidth >= DESKTOP_BREAKPOINT;

    const updateNavIndicator = (target) => {
        const indicator = ensureNavIndicator();
        if (!indicator) return;

        if (!shouldShowIndicator() || !target || target.getAttribute('href') === '#page-top') {
            hideNavIndicator();
            return;
        }

        const parentRect = navList.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const left = targetRect.left - parentRect.left;

        indicator.style.left = `${left}px`;
        indicator.style.width = `${targetRect.width}px`;
        indicator.classList.add('is-visible');
    };

    const syncIndicatorWithActive = () => {
        const current = navList?.querySelector('.nav-link.active');
        if (!current || current.hash === '#page-top') {
            hideNavIndicator();
        } else {
            updateNavIndicator(current);
        }
    };

    if (navList) {
        syncIndicatorWithActive();
        document.body.addEventListener('activate.bs.scrollspy', syncIndicatorWithActive);
        window.addEventListener('resize', () => {
            requestAnimationFrame(syncIndicatorWithActive);
        });
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                setTimeout(syncIndicatorWithActive, 300);
            });
            link.addEventListener('focusin', () => updateNavIndicator(link));
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                requestAnimationFrame(syncIndicatorWithActive);
            }
        });

        const blurLinks = () => {
            navLinks.forEach((link) => link.blur());
        };
        mainNav.addEventListener('mouseleave', blurLinks);

        const hideIndicatorNearTop = () => {
            if (window.scrollY <= TOP_HIDE_THRESHOLD) {
                hideNavIndicator();
            }
        };
        hideIndicatorNearTop();
        window.addEventListener('scroll', hideIndicatorNearTop);
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');

    const SAFE_SCROLL_OFFSET = 18;
    const scrollToSection = (target) => {
        if (!target) return;
        const navHeight = mainNav?.offsetHeight || 0;
        const viewportHeight = window.innerHeight;
        const safeAreaStart = navHeight + SAFE_SCROLL_OFFSET;
        const safeAreaEndOffset = SAFE_SCROLL_OFFSET;
        const safeAreaHeight = Math.max(viewportHeight - safeAreaStart - safeAreaEndOffset, 0);

        const rect = target.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        const sectionHeight = rect.height;
        let scrollTop;

        if (safeAreaHeight > 0 && sectionHeight <= safeAreaHeight) {
            const slack = safeAreaHeight - sectionHeight;
            scrollTop = absoluteTop - safeAreaStart - slack / 2;
        } else {
            scrollTop = absoluteTop - safeAreaStart;
        }

        window.scrollTo({
            top: Math.max(scrollTop, 0),
            behavior: 'smooth',
        });
    };

    const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]:not([href="#"])'));
    anchorLinks.forEach((link) => {
        if (link.hasAttribute('data-bs-toggle')) return;
        const href = link.getAttribute('href');
        const isPageTopLink = href === '#page-top';
        let target = null;
        try {
            target = document.querySelector(href);
        } catch (err) {
            target = null;
        }
        if (!target) return;

        link.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToSection(target);
            if (isPageTopLink) {
                hideNavIndicator();
            }
            if (history.replaceState) {
                history.replaceState(null, '', href);
            } else {
                window.location.hash = href;
            }
        });
    });

    if (window.location.hash && !isReloadNavigation) {
        try {
            const initialTarget = document.querySelector(window.location.hash);
            if (initialTarget) {
                requestAnimationFrame(() => scrollToSection(initialTarget));
                if (window.location.hash === '#page-top') {
                    hideNavIndicator();
                }
            }
        } catch (err) {
            // ignore invalid selectors
        }
    }

    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// Editor 2D (Módulo 2)
(function () {
    const canvas = document.getElementById('canvas2d');
    if (!canvas) {
        return;
    }

    const BASE_CANVAS_WIDTH = canvas.width;
    const BASE_CANVAS_HEIGHT = canvas.height;
    const MAX_CANVAS_WIDTH = BASE_CANVAS_WIDTH;
    const MAX_CANVAS_HEIGHT = BASE_CANVAS_HEIGHT;

    const ctx = canvas.getContext('2d');
    const dropZone = document.getElementById('dropzone2d');
    const fileInput = document.getElementById('file2d');
    const urlInput = document.getElementById('url2d');
    const loadUrlBtn = document.getElementById('cargarUrl2d');
    const resetBtn = document.getElementById('reset2d');
    const downloadBtn = document.getElementById('descargar2d');
    const compareBtn = document.getElementById('toggleComparador');
    const splitSlider = document.getElementById('splitComparador');
    const smoothToggle = document.getElementById('smoothToggle');
    const liquifyToggle = document.getElementById('liquifyToggle');
    const smoothIntensityInput = document.getElementById('smoothIntensity2d');
    const smoothBrushInput = document.getElementById('smoothBrush2d');
    const liquifyBrushInput = document.getElementById('liquifyBrush2d');
    const liquifyStrengthInput = document.getElementById('liquifyStrength2d');
    const overlayHint = document.querySelector('.canvas-overlay-hint span');
    let overlayTimeout = null;
    const editorShell = document.querySelector('.editor2d-shell');
    let overlayOverrideText = null;

    const adjustmentMap = [
        { id: 'expo2d', key: 'exposure' },
        { id: 'contraste2d', key: 'contrast' },
        { id: 'sombras2d', key: 'shadows' },
        { id: 'luces2d', key: 'highlights' },
        { id: 'temp2d', key: 'temperature' },
        { id: 'vibrancia2d', key: 'vibrance' },
        { id: 'claridad2d', key: 'clarity' },
        { id: 'vineta2d', key: 'vignette' },
    ];

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    const BG_COLOR = '#0b0d12';

    const RAW_EXTENSIONS = ['.cr2', '.dng'];
    const RAW_MIME_TYPES = ['image/x-canon-cr2', 'image/x-adobe-dng', 'application/x-canon-cr2', 'application/x-dng'];

    const workCanvas = document.createElement('canvas');
    const baseCanvas = document.createElement('canvas');
    const afterCanvas = document.createElement('canvas');
    const patchCanvas = document.createElement('canvas');

    const syncBufferSizes = (width, height) => {
        const w = Math.max(1, Math.round(width));
        const h = Math.max(1, Math.round(height));
        [canvas, workCanvas, baseCanvas, afterCanvas].forEach((c) => {
            c.width = w;
            c.height = h;
        });
        canvas.style.aspectRatio = `${w} / ${h}`;
    };

    syncBufferSizes(BASE_CANVAS_WIDTH, BASE_CANVAS_HEIGHT);

    const fitImageDimensions = (imgW, imgH) => {
        const safeW = Math.max(1, imgW);
        const safeH = Math.max(1, imgH);
        const scale = Math.min(MAX_CANVAS_WIDTH / safeW, MAX_CANVAS_HEIGHT / safeH, 1);
        return {
            width: Math.round(safeW * scale),
            height: Math.round(safeH * scale),
            scale,
        };
    };

    const workCtx = workCanvas.getContext('2d');
    const baseCtx = baseCanvas.getContext('2d');
    const afterCtx = afterCanvas.getContext('2d');
    const patchCtx = patchCanvas.getContext('2d');

    const state = {
        imageLoaded: false,
        comparisonEnabled: false,
        comparisonSplit: 1,
        activeTool: 'none',
    };

    const imageMeta = {
        naturalWidth: BASE_CANVAS_WIDTH,
        naturalHeight: BASE_CANVAS_HEIGHT,
        fittedWidth: BASE_CANVAS_WIDTH,
        fittedHeight: BASE_CANVAS_HEIGHT,
    };

    const adjustments = {
        exposure: 0,
        contrast: 0,
        shadows: 0,
        highlights: 0,
        temperature: 0,
        vibrance: 0,
        clarity: 0,
        vignette: 0,
    };

    const toolDefaults = {
        smoothIntensity: Number(smoothIntensityInput?.value) || 40,
        smoothBrush: Number(smoothBrushInput?.value) || 80,
        liquifyBrush: Number(liquifyBrushInput?.value) || 120,
        liquifyStrength: Number(liquifyStrengthInput?.value) || 35,
    };

    const toolSettings = { ...toolDefaults };

    const pointerState = {
        active: false,
        last: { x: 0, y: 0 },
        pointerId: null,
        dirty: false,
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const clamp01 = (value) => clamp(value, 0, 1);
    const getExtension = (name = '') => {
        const idx = name.lastIndexOf('.');
        return idx >= 0 ? name.slice(idx).toLowerCase() : '';
    };
    const isRawExtension = (name = '') => RAW_EXTENSIONS.includes(getExtension(name));
    const isSupportedMime = (mime = '') => {
        const lower = mime.toLowerCase();
        if (!lower) return false;
        if (lower.startsWith('image/')) return true;
        return RAW_MIME_TYPES.includes(lower);
    };
    const isSupportedSource = (mime = '', name = '') => {
        if (isSupportedMime(mime)) return true;
        return isRawExtension(name);
    };
    const isRawSourceType = (mime = '', name = '') => {
        const lower = (mime || '').toLowerCase();
        return RAW_MIME_TYPES.includes(lower) || isRawExtension(name);
    };
    const getUrlFileName = (urlString = '') => {
        try {
            const url = new URL(urlString);
            const pathname = url.pathname || '';
            return pathname.substring(pathname.lastIndexOf('/') + 1);
        } catch (_) {
            return '';
        }
    };

    const RAW_LIB_SPECIFIER = './assets/libraw/index.js';
    const RAW_DEFAULT_OPTIONS = {
        outputBps: 8,
        useCameraWb: true,
        noAutoBright: false,
        autoBrightThr: 0.01,
        outputColor: 1,
        highlight: 0,
    };

    let rawDecoderInstancePromise = null;
    let rawDecoderQueue = Promise.resolve();

    const ensureRawDecoder = async () => {
        if (!rawDecoderInstancePromise) {
            rawDecoderInstancePromise = (async () => {
                const module = await import(RAW_LIB_SPECIFIER);
                const LibRawCtor = module?.default || module?.LibRaw || module;
                if (typeof LibRawCtor !== 'function') {
                    throw new Error('No se pudo inicializar el decodificador RAW.');
                }
                return new LibRawCtor();
            })();
            rawDecoderInstancePromise.catch(() => {
                rawDecoderInstancePromise = null;
            });
        }
        return rawDecoderInstancePromise;
    };

    const withRawDecoderQueue = (task) => {
        const run = rawDecoderQueue.then(() => task());
        rawDecoderQueue = run
            .catch(() => { })
            .then(() => { });
        return run;
    };

    const findNumberInSources = (sources, keys) => {
        for (const source of sources) {
            if (!source) continue;
            for (const key of keys) {
                const value = source[key];
                if (typeof value === 'number' && value > 0) {
                    return value;
                }
            }
        }
        return null;
    };

    const resolveRawDimensions = (meta = {}, payloadInfo = {}, pixelLength, hintedChannels) => {
        const sources = [
            payloadInfo,
            meta?.image,
            meta?.sizes,
            meta?.thumbnail,
            meta?.thumb,
            meta?.preview,
            meta,
        ];
        const widthKeys = ['width', 'Width', 'iwidth', 'raw_width', 'rawWidth', 'output_width', 'outputWidth', 'full_width', 'fullWidth'];
        const heightKeys = ['height', 'Height', 'iheight', 'raw_height', 'rawHeight', 'output_height', 'outputHeight', 'full_height', 'fullHeight'];

        let width = findNumberInSources(sources, widthKeys);
        let height = findNumberInSources(sources, heightKeys);

        if (!width || !height) {
            throw new Error('No se pudo determinar la resolución del archivo RAW.');
        }

        const totalPixels = Math.max(1, Math.round(width)) * Math.max(1, Math.round(height));
        const channels = hintedChannels && hintedChannels > 0 ? hintedChannels : Math.max(1, Math.round(pixelLength / totalPixels));
        if (totalPixels * channels !== pixelLength) {
            console.warn('Dimensiones RAW inconsistentes, se continuará con los valores detectados.');
        }

        return { width: Math.round(width), height: Math.round(height), channels };
    };

    const normalizeRawPayload = (payload) => {
        if (!payload) {
            throw new Error('El decodificador RAW no entregó datos.');
        }
        if (payload.data) {
            const typed = payload.data instanceof Uint8Array
                ? payload.data
                : new Uint8Array(payload.data.buffer || payload.data);
            return {
                pixels: typed,
                width: payload.width,
                height: payload.height,
                channels: payload.channels,
            };
        }
        if (payload instanceof Uint8Array) {
            return { pixels: payload };
        }
        if (payload.buffer instanceof ArrayBuffer) {
            return { pixels: new Uint8Array(payload.buffer) };
        }
        throw new Error('Formato de datos RAW inesperado.');
    };

    const buildImageDataFromRaw = (pixels, width, height, hintedChannels) => {
        const totalPixels = width * height;
        if (!totalPixels) {
            throw new Error('Tamaño de imagen RAW no válido.');
        }
        const channels = hintedChannels && hintedChannels > 0
            ? hintedChannels
            : Math.max(1, Math.round(pixels.length / totalPixels));
        const clamped = new Uint8ClampedArray(totalPixels * 4);
        for (let srcIndex = 0, destIndex = 0; destIndex < clamped.length; destIndex += 4, srcIndex += channels) {
            const r = pixels[srcIndex] ?? 0;
            const g = pixels[srcIndex + Math.min(1, channels - 1)] ?? r;
            const b = pixels[srcIndex + Math.min(2, channels - 1)] ?? r;
            const a = channels >= 4 ? pixels[srcIndex + 3] : 255;
            clamped[destIndex] = r;
            clamped[destIndex + 1] = g;
            clamped[destIndex + 2] = b;
            clamped[destIndex + 3] = a;
        }
        return new ImageData(clamped, width, height);
    };

    const decodeRawBufferToDataUrl = async (buffer, label = 'RAW') => {
        const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        const decoder = await ensureRawDecoder();
        const { meta, payload } = await withRawDecoderQueue(async () => {
            await decoder.open(uint8, RAW_DEFAULT_OPTIONS);
            const fullMeta = await decoder.metadata(true);
            const rawImage = await decoder.imageData();
            return { meta: fullMeta, payload: rawImage };
        });

        const normalized = normalizeRawPayload(payload);
        const { width, height, channels } = resolveRawDimensions(meta || {}, { width: normalized.width, height: normalized.height }, normalized.pixels.length, normalized.channels);
        const imageData = buildImageDataFromRaw(normalized.pixels, width, height, channels);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) {
            throw new Error('No se pudo crear un contexto 2D para el RAW.');
        }
        tempCtx.putImageData(imageData, 0, 0);
        return tempCanvas.toDataURL('image/jpeg', 0.95);
    };

    const drawPlaceholder = () => {
        ctx.save();
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.textAlign = 'center';
        ctx.font = '600 22px "Nunito", sans-serif';
        ctx.fillText('Carga una imagen o pega un enlace HTTPS', canvas.width / 2, canvas.height / 2);
        ctx.restore();
    };

    const HISTORY_LIMIT = 30;
    const history = {
        stack: [],
        index: -1,
        limit: HISTORY_LIMIT,
        isRestoring: false,
    };

    const clearHistory = () => {
        history.stack = [];
        history.index = -1;
    };

    const createHistorySnapshot = () => ({
        imageData: workCtx.getImageData(0, 0, workCanvas.width, workCanvas.height),
        adjustments: { ...adjustments },
        comparisonEnabled: state.comparisonEnabled,
        comparisonSplit: state.comparisonSplit,
        imageMeta: { ...imageMeta },
        canvasSize: { width: workCanvas.width, height: workCanvas.height },
    });

    const captureHistory = () => {
        if (!state.imageLoaded || history.isRestoring) return;
        const snapshot = createHistorySnapshot();
        history.stack.splice(history.index + 1);
        history.stack.push(snapshot);
        if (history.stack.length > history.limit) {
            history.stack.shift();
        }
        history.index = history.stack.length - 1;
    };

    const updateAdjustmentInputs = () => {
        adjustmentMap.forEach(({ id, key }) => {
            const input = document.getElementById(id);
            if (input) input.value = String(adjustments[key] ?? 0);
        });
    };

    const applySnapshot = (snapshot) => {
        if (!snapshot) return;
        history.isRestoring = true;
        syncBufferSizes(snapshot.canvasSize.width, snapshot.canvasSize.height);
        Object.assign(imageMeta, snapshot.imageMeta);
        workCtx.putImageData(snapshot.imageData, 0, 0);
        Object.assign(adjustments, snapshot.adjustments);
        updateAdjustmentInputs();
        state.comparisonEnabled = snapshot.comparisonEnabled;
        state.comparisonSplit = clamp(snapshot.comparisonSplit, 0, 1);
        if (splitSlider) {
            splitSlider.value = String(Math.round(state.comparisonSplit * 100));
        }
        updateComparisonState();
        setActiveTool('none');
        requestRender();
        history.isRestoring = false;
    };

    const undoHistory = () => {
        if (history.index <= 0) return;
        history.index -= 1;
        applySnapshot(history.stack[history.index]);
    };

    const redoHistory = () => {
        if (history.index >= history.stack.length - 1) return;
        history.index += 1;
        applySnapshot(history.stack[history.index]);
    };

    const resetImageMeta = () => {
        imageMeta.naturalWidth = BASE_CANVAS_WIDTH;
        imageMeta.naturalHeight = BASE_CANVAS_HEIGHT;
        imageMeta.fittedWidth = canvas.width;
        imageMeta.fittedHeight = canvas.height;
    };

    const resetWorkspaces = () => {
        [ctx, workCtx, baseCtx, afterCtx].forEach((context) => {
            context.save?.();
            context.fillStyle = BG_COLOR;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.restore?.();
        });
        resetImageMeta();
    };

    const updateOverlayHint = () => {
        if (!overlayHint) return;
        if (overlayOverrideText) {
            overlayHint.innerHTML = overlayOverrideText;
            overlayHint.classList.add('is-active');
            return;
        }
        if (!state.imageLoaded) {
            overlayHint.textContent = 'Carga una imagen para empezar a editar.';
        } else if (state.activeTool === 'liquify') {
            overlayHint.innerHTML = '<span class="status-dot"></span>Liquify activo: arrastra para empujar rasgos.';
        } else if (state.activeTool === 'smooth') {
            overlayHint.innerHTML = '<span class="status-dot"></span>Suavizado activo: pinta para difuminar piel.';
        } else {
            overlayHint.textContent = '';
        }
        overlayHint.classList.add('is-active');
    };

    const setOverlayMessage = (message, options = {}) => {
        if (!overlayHint) return;
        if (overlayTimeout) {
            clearTimeout(overlayTimeout);
            overlayTimeout = null;
        }
        overlayOverrideText = message;
        overlayHint.innerHTML = message;
        overlayHint.classList.remove('is-hiding');
        overlayHint.classList.add('is-active');
        if (options.autoHide) {
            overlayTimeout = setTimeout(() => {
                overlayHint.classList.add('is-hiding');
                overlayHint.classList.remove('is-active');
                overlayTimeout = setTimeout(() => {
                    overlayOverrideText = null;
                    overlayHint.classList.remove('is-hiding');
                    updateOverlayHint();
                }, 400);
            }, options.duration ?? 1800);
        }
    };

    const runWithOverlayMessage = async (message, task) => {
        setOverlayMessage(message, { autoHide: false });
        try {
            return await task();
        } finally {
            setOverlayMessage(null);
        }
    };

    const setActiveTool = (tool) => {
        state.activeTool = state.activeTool === tool ? 'none' : tool;
        const smoothActive = state.activeTool === 'smooth';
        const liquifyActive = state.activeTool === 'liquify';

        if (smoothToggle) {
            smoothToggle.textContent = smoothActive ? 'ON' : 'OFF';
            smoothToggle.classList.toggle('btn-warning', smoothActive);
            smoothToggle.classList.toggle('btn-outline-light', !smoothActive);
        }
        if (liquifyToggle) {
            liquifyToggle.textContent = liquifyActive ? 'ON' : 'OFF';
            liquifyToggle.classList.toggle('btn-warning', liquifyActive);
            liquifyToggle.classList.toggle('btn-outline-warning', !liquifyActive);
        }
        setOverlayMessage(
            liquifyActive
                ? '<span class="status-dot"></span>Liquify activado'
                : smoothActive
                    ? '<span class="status-dot"></span>Suavizado activado'
                    : 'Herramientas desactivadas',
            { autoHide: true, duration: 1600 }
        );
        if (!liquifyActive && !smoothActive) {
            overlayOverrideText = null;
            updateOverlayHint();
        }
    };

    const getCanvasCoords = (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: clamp((event.clientX - rect.left) * scaleX, 0, canvas.width),
            y: clamp((event.clientY - rect.top) * scaleY, 0, canvas.height),
        };
    };

    const getRegion = (x, y, radius) => {
        const left = Math.floor(clamp(x - radius, 0, canvas.width));
        const top = Math.floor(clamp(y - radius, 0, canvas.height));
        const right = Math.ceil(clamp(x + radius, 0, canvas.width));
        const bottom = Math.ceil(clamp(y + radius, 0, canvas.height));
        const width = Math.max(1, right - left);
        const height = Math.max(1, bottom - top);
        return { left, top, width, height, radius };
    };

    const applyAdjustments = (imageData) => {
        const data = imageData.data;
        const exposureFactor = Math.pow(2, adjustments.exposure / 50);
        const contrastFactor = 1 + adjustments.contrast / 100;
        const shadows = adjustments.shadows / 100;
        const highlights = adjustments.highlights / 100;
        const temp = adjustments.temperature / 100;
        const vibrance = adjustments.vibrance / 100;
        const clarity = adjustments.clarity / 100;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i] / 255;
            let g = data[i + 1] / 255;
            let b = data[i + 2] / 255;

            r = clamp01(((r - 0.5) * contrastFactor + 0.5) * exposureFactor);
            g = clamp01(((g - 0.5) * contrastFactor + 0.5) * exposureFactor);
            b = clamp01(((b - 0.5) * contrastFactor + 0.5) * exposureFactor);

            let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            if (shadows > 0) {
                const delta = (1 - lum) * shadows * 0.9;
                r = clamp01(r + delta);
                g = clamp01(g + delta);
                b = clamp01(b + delta);
            } else if (shadows < 0) {
                const delta = lum * (-shadows) * 0.9;
                r = clamp01(r - delta);
                g = clamp01(g - delta);
                b = clamp01(b - delta);
            }

            if (highlights > 0) {
                const delta = lum * highlights * 0.9;
                r = clamp01(r - delta);
                g = clamp01(g - delta);
                b = clamp01(b - delta);
            } else if (highlights < 0) {
                const delta = (1 - lum) * (-highlights) * 0.9;
                r = clamp01(r + delta);
                g = clamp01(g + delta);
                b = clamp01(b + delta);
            }

            if (temp !== 0) {
                const warm = temp * 0.12;
                r = clamp01(r + warm);
                g = clamp01(g + warm * 0.2);
                b = clamp01(b - warm);
            }

            if (vibrance !== 0) {
                const avg = (r + g + b) / 3;
                const maxChannel = Math.max(r, g, b);
                const vib = vibrance > 0 ? vibrance * (1 - maxChannel) : vibrance;
                r = clamp01(avg + (r - avg) * (1 + vib));
                g = clamp01(avg + (g - avg) * (1 + vib));
                b = clamp01(avg + (b - avg) * (1 + vib));
            }

            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            if (clarity !== 0) {
                const midBoost = Math.sin((lum - 0.5) * Math.PI);
                const amount = midBoost * clarity * 0.5;
                r = clamp01(r + amount);
                g = clamp01(g + amount);
                b = clamp01(b + amount);
            }

            data[i] = Math.round(r * 255);
            data[i + 1] = Math.round(g * 255);
            data[i + 2] = Math.round(b * 255);
        }
    };

    const applyVignette = (ctxTarget, amount) => {
        if (!amount) return;
        const strength = clamp(amount / 100, 0, 1);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const maxRadius = Math.hypot(cx, cy);
        const gradient = ctxTarget.createRadialGradient(
            cx,
            cy,
            maxRadius * 0.15,
            cx,
            cy,
            maxRadius
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        const edgeAlpha = Math.min(0.92, Math.max(0.2, strength));
        gradient.addColorStop(1, `rgba(0,0,0,${edgeAlpha})`);
        ctxTarget.save();
        ctxTarget.globalCompositeOperation = 'multiply';
        ctxTarget.fillStyle = gradient;
        ctxTarget.fillRect(0, 0, canvas.width, canvas.height);
        ctxTarget.restore();
    };

    const renderFinal = () => {
        if (!state.imageLoaded) {
            drawPlaceholder();
            return;
        }

        afterCtx.clearRect(0, 0, canvas.width, canvas.height);
        afterCtx.drawImage(workCanvas, 0, 0);
        const imageData = afterCtx.getImageData(0, 0, canvas.width, canvas.height);
        applyAdjustments(imageData);
        afterCtx.putImageData(imageData, 0, 0);
        applyVignette(afterCtx, adjustments.vignette);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!state.comparisonEnabled) {
            ctx.drawImage(afterCanvas, 0, 0);
            return;
        }

        ctx.drawImage(baseCanvas, 0, 0);
        const split = clamp(state.comparisonSplit, 0, 1);
        const splitX = canvas.width * split;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, splitX, canvas.height);
        ctx.clip();
        ctx.drawImage(afterCanvas, 0, 0);
        ctx.restore();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(splitX - 1, 0, 2, canvas.height);
    };

    let renderQueued = false;
    const requestRender = () => {
        if (!state.imageLoaded) {
            drawPlaceholder();
            return;
        }
        if (renderQueued) return;
        renderQueued = true;
        requestAnimationFrame(() => {
            renderQueued = false;
            renderFinal();
        });
    };

    const updateComparisonState = () => {
        if (!compareBtn || !splitSlider) return;
        compareBtn.textContent = state.comparisonEnabled ? 'Comparador ON' : 'Comparador OFF';
        compareBtn.classList.toggle('btn-info', state.comparisonEnabled);
        compareBtn.classList.toggle('btn-outline-info', !state.comparisonEnabled);
        splitSlider.classList.toggle('is-active', state.comparisonEnabled);
        splitSlider.disabled = !state.comparisonEnabled;
    };

    const resetAdjustments = () => {
        adjustmentMap.forEach(({ id, key }) => {
            const input = document.getElementById(id);
            if (input) input.value = '0';
            adjustments[key] = 0;
        });
        if (smoothIntensityInput) {
            toolSettings.smoothIntensity = toolDefaults.smoothIntensity;
            smoothIntensityInput.value = String(toolDefaults.smoothIntensity);
        }
        if (smoothBrushInput) {
            toolSettings.smoothBrush = toolDefaults.smoothBrush;
            smoothBrushInput.value = String(toolDefaults.smoothBrush);
        }
        if (liquifyBrushInput) {
            toolSettings.liquifyBrush = toolDefaults.liquifyBrush;
            liquifyBrushInput.value = String(toolDefaults.liquifyBrush);
        }
        if (liquifyStrengthInput) {
            toolSettings.liquifyStrength = toolDefaults.liquifyStrength;
            liquifyStrengthInput.value = String(toolDefaults.liquifyStrength);
        }
    };

    const syncDownloadState = () => {
        if (downloadBtn) downloadBtn.disabled = !state.imageLoaded;
        if (!state.imageLoaded) {
            state.comparisonEnabled = false;
            updateComparisonState();
        }
    };

    const ingestImage = (src) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const { width, height } = fitImageDimensions(img.width, img.height);
            syncBufferSizes(width, height);
            baseCanvas.width = width;
            baseCanvas.height = height;
            baseCtx.fillStyle = BG_COLOR;
            baseCtx.fillRect(0, 0, canvas.width, canvas.height);
            workCtx.fillStyle = BG_COLOR;
            workCtx.fillRect(0, 0, canvas.width, canvas.height);
            baseCtx.drawImage(img, 0, 0, width, height);
            workCtx.drawImage(img, 0, 0, width, height);
            imageMeta.naturalWidth = img.naturalWidth || img.width;
            imageMeta.naturalHeight = img.naturalHeight || img.height;
            imageMeta.fittedWidth = width;
            imageMeta.fittedHeight = height;
            clearHistory();
            state.imageLoaded = true;
            state.comparisonSplit = 1;
            if (splitSlider) splitSlider.value = '100';
            resetAdjustments();
            setActiveTool('none');
            state.comparisonEnabled = false;
            updateComparisonState();
            syncDownloadState();
            requestRender();
            captureHistory();
        };
        img.onerror = () => {
            alert('No se pudo cargar la imagen. Verifica el archivo o URL.');
        };
        img.src = src;
    };

    const loadFile = async (file) => {
        if (!file) return;
        if (!isSupportedSource(file.type, file.name)) {
            alert('El archivo debe ser JPG, PNG, CR2 o DNG.');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            alert('La imagen supera el límite de 50 MB.');
            return;
        }
        if (isRawSourceType(file.type, file.name)) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const dataUrl = await runWithOverlayMessage('Procesando RAW…', () =>
                    decodeRawBufferToDataUrl(new Uint8Array(arrayBuffer), file.name || 'RAW')
                );
                ingestImage(dataUrl);
            } catch (error) {
                console.error(error);
                alert('No se pudo procesar el RAW. Intenta con otro archivo o conviértelo a JPG/PNG.');
            }
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => ingestImage(evt.target?.result);
        reader.onerror = () => alert('No se pudo leer el archivo seleccionado.');
        reader.readAsDataURL(file);
    };

    const loadFromUrl = async () => {
        const url = urlInput?.value.trim();
        if (!url) {
            alert('Pega un enlace HTTPS a una imagen válida.');
            return;
        }
        try {
            loadUrlBtn.disabled = true;
            loadUrlBtn.textContent = 'Cargando...';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Respuesta no válida');
            }
            const blob = await response.blob();
            const remoteName = getUrlFileName(url);
            if (!isSupportedSource(blob.type, remoteName)) {
                throw new Error('El enlace no apunta a una imagen JPG, PNG, CR2 o DNG.');
            }
            if (blob.size > MAX_FILE_SIZE) {
                throw new Error('La imagen supera el límite de 50 MB.');
            }
            if (isRawSourceType(blob.type, remoteName)) {
                try {
                    const buffer = await blob.arrayBuffer();
                    const dataUrl = await runWithOverlayMessage('Procesando RAW…', () =>
                        decodeRawBufferToDataUrl(new Uint8Array(buffer), remoteName || 'RAW')
                    );
                    ingestImage(dataUrl);
                } catch (error) {
                    console.error(error);
                    alert('No se pudo procesar el RAW descargado. Intenta con otro archivo o conviértelo a JPG/PNG.');
                }
            } else {
                const reader = new FileReader();
                reader.onload = (evt) => ingestImage(evt.target?.result);
                reader.onerror = () => alert('No se pudo leer la imagen descargada.');
                reader.readAsDataURL(blob);
            }
        } catch (error) {
            alert('No se pudo descargar la imagen. Verifica la URL, el formato o el CORS del servidor.');
        } finally {
            if (loadUrlBtn) {
                loadUrlBtn.disabled = false;
                loadUrlBtn.textContent = 'Cargar';
            }
        }
    };

    const handlePointerDown = (event) => {
        if (!state.imageLoaded || state.activeTool === 'none') return;
        pointerState.active = true;
        pointerState.pointerId = event.pointerId;
        pointerState.last = getCanvasCoords(event);
        pointerState.dirty = false;
        canvas.setPointerCapture(event.pointerId);
        if (state.activeTool === 'smooth') {
            applySmoothStroke(pointerState.last);
            pointerState.dirty = true;
            requestRender();
        }
        event.preventDefault();
    };

    const handlePointerMove = (event) => {
        if (!pointerState.active || state.activeTool === 'none') return;
        const current = getCanvasCoords(event);
        if (state.activeTool === 'liquify') {
            applyLiquifyStroke(pointerState.last, current);
            pointerState.dirty = true;
            requestRender();
        } else if (state.activeTool === 'smooth') {
            applySmoothStroke(current);
            pointerState.dirty = true;
            requestRender();
        }
        pointerState.last = current;
    };

    const stopPointer = () => {
        if (!pointerState.active) return;
        pointerState.active = false;
        if (pointerState.pointerId !== null) {
            try {
                canvas.releasePointerCapture(pointerState.pointerId);
            } catch (_) {
                // ignore
            }
        }
        pointerState.pointerId = null;
        if (pointerState.dirty) {
            pointerState.dirty = false;
            captureHistory();
        }
    };

    const applySmoothStroke = (point) => {
        const radius = toolSettings.smoothBrush;
        const intensity = clamp(toolSettings.smoothIntensity / 100, 0, 1);
        if (radius <= 0 || intensity <= 0) return;
        const region = getRegion(point.x, point.y, radius);
        patchCanvas.width = region.width;
        patchCanvas.height = region.height;
        patchCtx.clearRect(0, 0, region.width, region.height);
        const blurPx = Math.max(1, radius * 0.3);
        patchCtx.filter = `blur(${blurPx}px)`;
        patchCtx.drawImage(
            workCanvas,
            region.left,
            region.top,
            region.width,
            region.height,
            0,
            0,
            region.width,
            region.height
        );
        patchCtx.filter = 'none';
        workCtx.save();
        workCtx.globalAlpha = intensity;
        workCtx.beginPath();
        workCtx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        workCtx.clip();
        workCtx.drawImage(
            patchCanvas,
            0,
            0,
            region.width,
            region.height,
            region.left,
            region.top,
            region.width,
            region.height
        );
        workCtx.restore();
    };

    const applyLiquifyStroke = (from, to) => {
        const radius = toolSettings.liquifyBrush;
        const strength = clamp(toolSettings.liquifyStrength / 100, 0, 1);
        if (radius <= 0 || strength <= 0) return;
        const moveX = to.x - from.x;
        const moveY = to.y - from.y;
        if (Math.abs(moveX) < 0.3 && Math.abs(moveY) < 0.3) return;

        const region = getRegion(from.x, from.y, radius);
        const input = workCtx.getImageData(region.left, region.top, region.width, region.height);
        const { width, height, data: srcData } = input;
        const output = workCtx.createImageData(width, height);
        const dstData = output.data;
        const centerX = from.x - region.left;
        const centerY = from.y - region.top;
        const maxRadius = radius;

        const sample = (x, y) => {
            const sx = clamp(x, 0, width - 1);
            const sy = clamp(y, 0, height - 1);
            const x0 = Math.floor(sx);
            const x1 = Math.min(width - 1, x0 + 1);
            const y0 = Math.floor(sy);
            const y1 = Math.min(height - 1, y0 + 1);
            const dx = sx - x0;
            const dy = sy - y0;

            const idx = (y0 * width + x0) * 4;
            const idxX1 = (y0 * width + x1) * 4;
            const idxY1 = (y1 * width + x0) * 4;
            const idxY1X1 = (y1 * width + x1) * 4;

            const interpolate = (i0, i1, i2, i3) => {
                const top = srcData[i0] * (1 - dx) + srcData[i1] * dx;
                const bottom = srcData[i2] * (1 - dx) + srcData[i3] * dx;
                return top * (1 - dy) + bottom * dy;
            };

            return [
                interpolate(idx, idxX1, idxY1, idxY1X1),
                interpolate(idx + 1, idxX1 + 1, idxY1 + 1, idxY1X1 + 1),
                interpolate(idx + 2, idxX1 + 2, idxY1 + 2, idxY1X1 + 2),
                interpolate(idx + 3, idxX1 + 3, idxY1 + 3, idxY1X1 + 3),
            ];
        };

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const offset = (y * width + x) * 4;
                const dist = Math.hypot(x - centerX, y - centerY);
                let sampleX = x;
                let sampleY = y;
                if (dist < maxRadius) {
                    const falloff = Math.pow(1 - dist / maxRadius, 2);
                    sampleX = x - moveX * strength * falloff;
                    sampleY = y - moveY * strength * falloff;
                }
                const [r, g, b, a] = sample(sampleX, sampleY);
                dstData[offset] = r;
                dstData[offset + 1] = g;
                dstData[offset + 2] = b;
                dstData[offset + 3] = a;
            }
        }

        workCtx.putImageData(output, region.left, region.top);
    };

    // === Event wiring ===
    fileInput?.addEventListener('change', (event) => {
        const [file] = event.target.files || [];
        loadFile(file);
        event.target.value = '';
    });

    dropZone?.addEventListener('dragenter', (event) => {
        event.preventDefault();
        dropZone.classList.add('is-dragover');
    });
    dropZone?.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('is-dragover');
    });
    dropZone?.addEventListener('dragleave', (event) => {
        event.preventDefault();
        dropZone.classList.remove('is-dragover');
    });
    dropZone?.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('is-dragover');
        const file = event.dataTransfer?.files?.[0];
        loadFile(file);
    });

    loadUrlBtn?.addEventListener('click', () => {
        loadFromUrl();
    });

    adjustmentMap.forEach(({ id, key }) => {
        const input = document.getElementById(id);
        if (!input) return;
        adjustments[key] = Number(input.value) || 0;
        input.addEventListener('input', (event) => {
            adjustments[key] = Number(event.target.value) || 0;
            requestRender();
        });
        input.addEventListener('change', () => {
            captureHistory();
        });
    });

    smoothIntensityInput?.addEventListener('input', (event) => {
        toolSettings.smoothIntensity = Number(event.target.value) || 0;
    });
    smoothBrushInput?.addEventListener('input', (event) => {
        toolSettings.smoothBrush = Number(event.target.value) || 0;
    });
    liquifyBrushInput?.addEventListener('input', (event) => {
        toolSettings.liquifyBrush = Number(event.target.value) || 0;
    });
    liquifyStrengthInput?.addEventListener('input', (event) => {
        toolSettings.liquifyStrength = Number(event.target.value) || 0;
    });

    smoothToggle?.addEventListener('click', () => setActiveTool('smooth'));
    liquifyToggle?.addEventListener('click', () => setActiveTool('liquify'));

    compareBtn?.addEventListener('click', () => {
        if (!state.imageLoaded) {
            alert('Primero carga una imagen para usar el comparador.');
            return;
        }
        state.comparisonEnabled = !state.comparisonEnabled;
        updateComparisonState();
        requestRender();
    });

    splitSlider?.addEventListener('input', (event) => {
        state.comparisonSplit = (Number(event.target.value) || 0) / 100;
        if (state.comparisonEnabled) {
            requestRender();
        }
    });

    resetBtn?.addEventListener('click', () => {
        resetAdjustments();
        setActiveTool('none');
        state.comparisonEnabled = false;
        state.comparisonSplit = 1;
        if (splitSlider) splitSlider.value = '100';
        updateComparisonState();
        if (state.imageLoaded) {
            workCtx.drawImage(baseCanvas, 0, 0);
            requestRender();
            captureHistory();
        } else {
            drawPlaceholder();
        }
    });

    downloadBtn?.addEventListener('click', () => {
        if (!state.imageLoaded) return;
        renderFinal();

        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        const exportWidth = Math.max(1, imageMeta.naturalWidth || canvas.width);
        const exportHeight = Math.max(1, imageMeta.naturalHeight || canvas.height);
        exportCanvas.width = exportWidth;
        exportCanvas.height = exportHeight;

        const sourceW = Math.max(1, imageMeta.fittedWidth || canvas.width);
        const sourceH = Math.max(1, imageMeta.fittedHeight || canvas.height);

        exportCtx.drawImage(
            afterCanvas,
            0, 0, sourceW, sourceH,
            0, 0, exportWidth, exportHeight
        );

        exportCanvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'detras-del-filtro.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.9);
    });

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((type) => {
        canvas.addEventListener(type, stopPointer);
    });

    document.addEventListener('keydown', (event) => {
        if (!state.imageLoaded) return;
        if (!(event.ctrlKey || event.metaKey)) return;
        if (!editorShell) return;
        const target = event.target;
        const insideEditor = target instanceof Element ? editorShell.contains(target) : false;
        const allowGlobal = target === document.body || target === document.documentElement;
        if (!insideEditor && !allowGlobal) return;
        if (event.key.toLowerCase() !== 'z') return;
        event.preventDefault();
        if (event.shiftKey) {
            redoHistory();
        } else {
            undoHistory();
        }
    });

    resetWorkspaces();
    clearHistory();
    drawPlaceholder();
    updateOverlayHint();
    updateComparisonState();
    syncDownloadState();
})();


