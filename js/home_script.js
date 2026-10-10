// UpliftEd - Dynamic Microphone Speech Translation Engine & Voice Synthesizer

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Clean Sidebar Navigation Toggle ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (sidebarToggle && sidebar && sidebarOverlay) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        };

        if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // --- 2. Global Toast Notification Helper ---
    window.showToast = function(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const iconClass = type === 'success' ? 'fa-circle-check' : (type === 'danger' ? 'fa-triangle-exclamation' : 'fa-circle-info');
        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // --- 3. Tamil, Telugu & Multilingual Speech Synthesis Engine ---
    let systemVoices = [];
    function loadVoices() {
        if ('speechSynthesis' in window) {
            systemVoices = window.speechSynthesis.getVoices();
        }
    }
    loadVoices();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    window.speakTextWithVoice = function(text, lang) {
        if (!('speechSynthesis' in window) || !text) return;
        window.speechSynthesis.cancel(); // Cancel active speech

        const utterance = new SpeechSynthesisUtterance(text);
        const langCodeMap = { es: 'es-ES', hi: 'hi-IN', fr: 'fr-FR', de: 'de-DE', ta: 'ta-IN', te: 'te-IN' };
        const targetLangCode = langCodeMap[lang] || 'es-ES';
        utterance.lang = targetLangCode;

        // Search for matching voice (Tamil, Telugu, Hindi, etc.)
        if (systemVoices.length === 0) loadVoices();
        let matchingVoice = systemVoices.find(v => v.lang.toLowerCase().includes(targetLangCode.toLowerCase()) || v.lang.toLowerCase().startsWith(lang));

        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    };

    // --- 4. Dynamic Real-Time Microphone Speech Translator ---
    const demoInput = document.getElementById('demo-input');
    const demoOutput = document.getElementById('demo-output');
    const langChips = document.querySelectorAll('.lang-chip');
    const micBtn = document.getElementById('btn-mic-listen');
    const speakBtn = document.getElementById('btn-speak-translation');
    const copyBtn = document.getElementById('btn-copy-translation');
    const waveAnimation = document.getElementById('translator-wave');

    const multiTranslations = {
        es: {
            "Welcome to UpliftEd online learning portal": "Bienvenido al portal de aprendizaje en línea UpliftEd",
            "Education is the most powerful weapon to change the world": "La educación es el arma más poderosa para cambiar el mundo",
            "Hello world": "Hola Mundo"
        },
        hi: {
            "Welcome to UpliftEd online learning portal": "UpliftEd ऑनलाइन लर्निंग पोर्टल में आपका स्वागत है",
            "Education is the most powerful weapon to change the world": "शिक्षा दुनिया को बदलने का सबसे शक्तिशाली हथियार है",
            "Hello world": "नमस्ते दुनिया"
        },
        ta: {
            "Welcome to UpliftEd online learning portal": "UpliftEd இணையவழி கற்றல் தளத்திற்கு நல்வரவு",
            "Education is the most powerful weapon to change the world": "கல்வியே உலகை மாற்றும் மிகச்சிறந்த ஆயுதம்",
            "Hello world": "வணக்கம் உலகம்"
        },
        te: {
            "Welcome to UpliftEd online learning portal": "UpliftEd ఆన్‌లైన్ లెర్నింగ్ పోర్టల్‌కి స్వాగతం",
            "Education is the most powerful weapon to change the world": "ప్రపంచాన్ని మార్చడానికి విద్యే అత్యంత శక్తివంతమైన ఆయుధం",
            "Hello world": "హలో వరల్డ్"
        }
    };

    let currentLang = 'es';

    window.translateLiveText = async function(text, targetLang) {
        if (!text.trim()) return '';

        if (multiTranslations[targetLang] && multiTranslations[targetLang][text.trim()]) {
            return multiTranslations[targetLang][text.trim()];
        }

        try {
            const langPair = `en|${targetLang}`;
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${langPair}`);
            const data = await res.json();
            if (data && data.responseData && data.responseData.translatedText) {
                return data.responseData.translatedText;
            }
        } catch (err) {
            console.warn('Translation API fallback:', err);
        }

        return `[${targetLang.toUpperCase()}]: ${text}`;
    };

    async function updateTranslation() {
        if (!demoInput || !demoOutput) return;
        const text = demoInput.value.trim();
        if (!text) {
            demoOutput.innerText = 'Translation output will appear here in real-time...';
            return;
        }

        demoOutput.innerText = 'Translating spoken text...';
        const translated = await window.translateLiveText(text, currentLang);
        demoOutput.innerText = translated;
    }

    if (langChips.length > 0) {
        langChips.forEach(chip => {
            chip.addEventListener('click', function() {
                langChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                currentLang = this.getAttribute('data-lang') || 'es';
                updateTranslation();
                window.showToast(`Target language set to ${this.innerText}`, 'info');
            });
        });
    }

    if (demoInput) {
        demoInput.addEventListener('input', updateTranslation);
    }

    // Web Speech API Microphone Capture
    if (micBtn) {
        let isListening = false;
        let recognition = null;

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isListening = true;
                micBtn.style.background = '#ef4444';
                micBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> Listening...';
                if (waveAnimation) waveAnimation.style.display = 'flex';
                window.showToast('Microphone live! Speak in English to translate...', 'info');
            };

            recognition.onresult = async (e) => {
                let micTranscript = '';
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    micTranscript += e.results[i][0].transcript;
                }

                if (demoInput && micTranscript.trim()) {
                    demoInput.value = micTranscript;
                    const translated = await window.translateLiveText(micTranscript, currentLang);
                    if (demoOutput) demoOutput.innerText = translated;
                }
            };

            recognition.onerror = (err) => console.warn('Speech recognition error:', err);
            recognition.onend = () => {
                isListening = false;
                micBtn.style.background = '';
                micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i> Voice Input';
                if (waveAnimation) waveAnimation.style.display = 'none';
            };
        }

        micBtn.addEventListener('click', () => {
            if (!recognition) {
                window.showToast('Web Speech API not supported in this browser.', 'info');
                return;
            }
            if (!isListening) {
                recognition.start();
            } else {
                recognition.stop();
            }
        });
    }

    // Spoken Audio Output with Tamil & Telugu Voice Selection
    if (speakBtn) {
        speakBtn.addEventListener('click', () => {
            const text = demoOutput ? demoOutput.innerText : '';
            if (!text || text.includes('will appear here') || text.includes('Translating')) {
                window.showToast('No translated speech available to play.', 'info');
                return;
            }

            window.speakTextWithVoice(text, currentLang);
            window.showToast(`Playing ${currentLang.toUpperCase()} audio speech...`, 'info');
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = demoOutput ? demoOutput.innerText : '';
            if (!text || text.includes('will appear here')) return;
            navigator.clipboard.writeText(text);
            window.showToast('Translation copied!', 'success');
        });
    }

    const sampleBtns = document.querySelectorAll('.sample-btn');
    sampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (demoInput) {
                demoInput.value = this.innerText;
                updateTranslation();
            }
        });
    });
});