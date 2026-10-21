// Minimal i18n: the Korean text is the key, so untranslated strings just stay Korean.
// The language is a module value (set by ThemeContext before render), and App remounts the
// navigation tree when it changes, so t() works in components, handlers and Alerts alike.
import EN from './i18n.en';

export const LANGUAGES = [
    { id: 'ko', label: '한국어' },
    { id: 'en', label: 'English' },
];

let current = 'ko';

export function deviceLanguage() {
    try {
        const loc = Intl.DateTimeFormat().resolvedOptions().locale || '';
        return loc.toLowerCase().startsWith('ko') ? 'ko' : 'en';
    } catch (e) {
        return 'ko';
    }
}

export const setLanguage = (lang) => { current = lang === 'en' ? 'en' : 'ko'; };
export const getLanguage = () => current;

// t('체험 기간 {n}일 남음', { n: 3 })
export function t(ko, vars) {
    let s = current === 'en' ? (EN[ko] ?? ko) : ko;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
    return s;
}

export const useT = () => t;
