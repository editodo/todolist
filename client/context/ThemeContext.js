import React, { createContext, useState, useContext, useEffect } from 'react';

import { colors, themes } from '../theme';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { user } = useAuth();

    // Mode: 'light', 'dark', 'system'
    const [mode, setMode] = useState('light'); // Default to light for consistent preview
    // Theme: 'simple', 'round', 'skitch', 'kitsch'
    const [themeStyle, setThemeStyle] = useState('simple');
    // Palette: 'simple', 'mincho', 'lemon', 'green', 'pinky'
    const [palette, setPalette] = useState('simple');

    // Fetch saved preferences on user change
    useEffect(() => {
        if (user?.id) {
            fetchSettings(user.id);
        }
    }, [user?.id]);

    const fetchSettings = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/api/preferences/${userId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.mode) setMode(data.mode);
                if (data.theme) setThemeStyle(data.theme);
                if (data.color_theme) setPalette(data.color_theme);
            }
        } catch (e) {
            console.error('Failed to fetch settings:', e);
        }
    };

    // Derived State for Current Colors
    // 1. Resolve System Mode
    const activeMode = mode === 'system' ? 'light' : mode; // Force light if system for now, or use useColorScheme() in future

    // 2. Get Basic & Palette Colors
    const basicColors = colors.basic[activeMode];
    const paletteGroup = colors.palettes[palette] || colors.palettes.simple;
    const currentPalette = paletteGroup[activeMode];

    // 3. Get Theme Shape
    const currentThemeStyle = themes[themeStyle] || themes.simple;

    // Combined Theme Object to consume in components
    const theme = {
        mode: activeMode,
        colors: {
            ...colors, // shared static colors (main, white, danger)
            ...basicColors, // mode specific basics (body, text, border, etc.)
            ...currentPalette, // palette specific overrides (base, dominant, accent)
        },
        style: currentThemeStyle,
        paletteName: palette,
        themeName: themeStyle
    };

    return (
        <ThemeContext.Provider value={{
            mode, setMode,
            themeStyle, setThemeStyle,
            palette, setPalette,
            theme // Expose the computed theme
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
