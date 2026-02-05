export const colors = {
    // Basic Static Colors (Shared)
    main: '#5AC1CC',
    dark: '#222222',
    lightGray: '#EEEEEE',
    white: '#FFFFFF',
    danger: '#FF3030',

    // Mode Specific Basic Colors (from colorchip.css)
    basic: {
        light: {
            body: '#FFFFFF',
            base: '#FFFFFF',
            text: '#222222',
            subText: '#444444',
            guideText: '#888888',
            border: '#EEEEEE',
            fnb: '#CCCCCC',
            fnbText: '#AAAAAA',
            fnbActive: '#222222',
            calendarColr: '#666666',
            dim: 'rgba(0,0,0,0.2)',
            mypageColor: '#f7f8f9'
        },
        dark: {
            body: '#12120A',
            base: '#333333',
            text: '#FFFFFF',
            subText: '#DDDDDD',
            guideText: '#777777',
            border: '#333333',
            fnb: '#444444',
            fnbText: '#666666',
            fnbActive: '#BBBBBB',
            calendarColr: '#999999',
            dim: 'rgba(255,255,255,0.2)',
            mypageColor: '#202020'
        }
    },

    // Palettes (from colorchip.css)
    palettes: {
        simple: {
            light: {
                base: '#F5F5F5',
                dominant: '#D9D9D9',
                accent: '#222222',
                checkboxLabel: '#444444',
                checkboxCheckedLabel: '#AAAAAA'
            },
            dark: {
                base: '#333333',
                dominant: '#666666',
                accent: '#D8D8D8',
                checkboxLabel: '#DADADA',
                checkboxCheckedLabel: '#666666'
            }
        },
        mincho: {
            light: {
                base: '#D8F0EF',
                dominant: '#A7D3D2',
                accent: '#997B6A',
                checkboxLabel: '#1D5A58',
                checkboxCheckedLabel: '#679A98'
            },
            dark: {
                base: '#40817D',
                dominant: '#A7D3D2',
                accent: '#98D2CF',
                checkboxLabel: '#DFF1F0',
                checkboxCheckedLabel: '#78ABA9'
            }
        },
        lemon: {
            light: {
                base: '#FFF3CA',
                dominant: '#D9CC9D',
                accent: '#F3637D',
                checkboxLabel: '#473C15',
                checkboxCheckedLabel: '#958D71',
            },
            dark: {
                base: '#695D34',
                dominant: '#97864D',
                accent: '#EAE5BA',
                checkboxLabel: '#F2EEE0',
                checkboxCheckedLabel: '#958D71',
            }
        },
        green: {
            light: {
                base: '#E9FFDF',
                dominant: '#B9D9AA',
                accent: '#228262',
                checkboxLabel: '#18320C',
                checkboxCheckedLabel: '#829C76',
            },
            dark: {
                base: '#374E2D',
                dominant: '#59784C',
                accent: '#CBE2BF',
                checkboxLabel: '#EDFAE7',
                checkboxCheckedLabel: '#829C76',
            }
        },
        pinky: {
            light: {
                base: '#FFD8E7',
                dominant: '#FFB9D4',
                accent: '#FA6EA5',
                checkboxLabel: '#411023',
                checkboxCheckedLabel: '#AB7B8E',
            },
            dark: {
                base: '#6F2945',
                dominant: '#904765',
                accent: '#FF9FC5',
                checkboxLabel: '#F3DBE4',
                checkboxCheckedLabel: '#AB7B8E',
            }
        }
    }
};

export const fonts = {
    regular: 'System',
    bold: 'System',
};

import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const layout = {
    // Web: Limit width to simulate mobile size
    // Native: Use full width
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    windowWidth: width,
};

export const themes = {
    simple: {
        borderRadius: 0,
        styleName: 'style_simple',
    },
    round: {
        borderRadius: 20,
        styleName: 'style_round',
    },
    skitch: {
        borderRadius: 15,
        styleName: 'style_skitch',
    },
    kitsch: {
        borderRadius: 20,
        styleName: 'style_kitsch',
    }
};
