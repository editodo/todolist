import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import * as Font from 'expo-font';
import { setLanguage as setI18nLanguage, deviceLanguage } from '../i18n';

import { colors, themes } from '../theme';
import { useAuth } from './AuthContext';
import { API_URL, apiFetch } from '../config';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { user, logout } = useAuth();
    const systemScheme = useColorScheme(); // 'light' | 'dark' from the phone/browser setting; updates live

    // Mode: 'light', 'dark', 'system'
    const [mode, setMode] = useState('light'); // Default to light for consistent preview
    // Theme: 'simple', 'round', 'skitch', 'kitsch'
    const [themeStyle, setThemeStyle] = useState('simple');
    // Palette: 'simple', 'mincho', 'lemon', 'green', 'pinky'
    const [palette, setPalette] = useState('simple');

    // --- Fonts: NotoSansKR by default; a catalog font (글꼴 변경) when chosen ---
    // Phone: bundled NotoSansKR regular/bold. Web: Google Fonts CSS (only the glyphs a page uses are downloaded).
    const BASE_FONT = Platform.OS === 'web'
        ? { regular: 'Noto Sans KR', bold: 'Noto Sans KR', custom: false }
        : { regular: 'NotoSansKR_400Regular', bold: 'NotoSansKR_700Bold', custom: false };
    const [baseFontReady, setBaseFontReady] = useState(false);
    const [fonts, setFonts] = useState([]); // catalog from the server
    const [fontId, setFontIdState] = useState(null); // null = 기본 글씨체 (NotoSansKR)
    const [customFamily, setCustomFamily] = useState(null);
    const [language, setLanguageState] = useState(null); // 'ko' | 'en' | null (= device language)

    useEffect(() => {
        if (Platform.OS === 'web') {
            if (!document.getElementById('font-noto-sans-kr')) {
                const link = document.createElement('link');
                link.id = 'font-noto-sans-kr';
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap';
                document.head.appendChild(link);
            }
            setBaseFontReady(true);
        } else {
            Font.loadAsync({
                NotoSansKR_400Regular: require('@expo-google-fonts/noto-sans-kr/400Regular/NotoSansKR_400Regular.ttf'),
                NotoSansKR_700Bold: require('@expo-google-fonts/noto-sans-kr/700Bold/NotoSansKR_700Bold.ttf'),
            }).catch((e) => console.warn('Base font load failed', e)).finally(() => setBaseFontReady(true));
        }
        fetch(`${API_URL}/api/fonts`).then((r) => (r.ok ? r.json() : [])).then(setFonts).catch(() => {});
    }, []);

    // Load the chosen catalog font (uploaded files are served from our API, web fonts from their own host)
    useEffect(() => {
        const entry = fonts.find((f) => f.id === fontId);
        if (!entry) { setCustomFamily(null); return; }
        const family = `ET_font_${entry.id}`;
        const uri = entry.url.startsWith('/') ? `${API_URL}${entry.url}` : entry.url;
        Font.loadAsync({ [family]: uri })
            .then(() => setCustomFamily(family))
            .catch((e) => { console.warn('Font load failed, using default', e); setCustomFamily(null); });
    }, [fontId, fonts]);

    const savePreference = (body) => {
        if (user?.token) apiFetch(`${API_URL}/api/preferences`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {});
    };
    const setFontId = (id) => { setFontIdState(id); savePreference({ font_id: id }); };
    const setLanguage = (lang) => { setLanguageState(lang); savePreference({ language: lang }); };

    // Fetch saved preferences on user change
    useEffect(() => {
        if (user?.id) {
            fetchSettings(user.id);
        }
    }, [user?.id]);

    const fetchSettings = async (userId) => {
        try {
            const response = await apiFetch(`${API_URL}/api/preferences/${userId}`);

            if (response.status === 404 || response.status === 401) {
                console.warn(`Preferences request rejected (${response.status}). Logging out invalid session.`);
                logout();
                return;
            }

            if (response.ok) {
                const data = await response.json();
                if (data.mode) setMode(data.mode);
                if (data.theme) setThemeStyle(data.theme);
                if (data.color_theme) setPalette(data.color_theme);
                setFontIdState(data.font_id ?? null);
                if (data.language) setLanguageState(data.language);
            }
        } catch (e) {
            console.error('Failed to fetch settings:', e);
        }
    };

    // Derived State for Current Colors
    // 1. Resolve System Mode
    const activeMode = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

    // 2. Get Basic & Palette Colors
    const basicColors = colors.basic[activeMode];
    const paletteGroup = colors.palettes[palette] || colors.palettes.simple;
    const currentPalette = paletteGroup[activeMode];

    // 3. Get Theme Shape
    const currentThemeStyle = themes[themeStyle] || themes.simple;

    // i18n reads a module value; set it before children render (null preference = device language)
    const effectiveLanguage = language || deviceLanguage();
    setI18nLanguage(effectiveLanguage);

    // Combined Theme Object to consume in components
    const theme = {
        mode: activeMode,
        colors: {
            ...colors, // shared static colors (main, white, danger)
            ...basicColors, // mode specific basics (body, text, border, etc.)
            ...currentPalette, // palette specific overrides (base, dominant, accent)
        },
        style: currentThemeStyle,
        // null until the base font is loaded, so text never asks for a family that isn't registered yet
        font: !baseFontReady ? null : customFamily ? { regular: customFamily, bold: customFamily, custom: true } : BASE_FONT,
        paletteName: palette,
        themeName: themeStyle
    };

    return (
        <ThemeContext.Provider value={{
            mode, setMode,
            themeStyle, setThemeStyle,
            palette, setPalette,
            fonts, fontId, setFontId,
            language, setLanguage, effectiveLanguage,
            theme // Expose the computed theme
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
