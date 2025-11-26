"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export type Locale = 'en' | 'ar';

interface LanguageContextType {
    language: Locale;
    setLanguage: (lang: Locale) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type TranslationDictionary = Record<string, string | Record<string, any>>;

const LANGUAGE_STORAGE_KEY = 'lm_language';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [languageState, setLanguageState] = useState<Locale>('ar');

    const persistLanguage = (lang: Locale) => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            }
        } catch {
            // ignore storage errors (private mode, etc.)
        }
    };

    const setLanguage = (lang: Locale) => {
        setLanguageState(lang);
        persistLanguage(lang);
    };

    const translations: Record<Locale, TranslationDictionary> = {
        en: en as TranslationDictionary,
        ar: ar as TranslationDictionary,
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[languageState];
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Fallback to key if not found
            }
        }
        return typeof value === 'string' ? value : key;
    };

    const dir = languageState === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved === 'ar' || saved === 'en') {
            setLanguageState(saved);
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = languageState;
        document.documentElement.dir = dir;
    }, [languageState, dir]);

    return (
        <LanguageContext.Provider value={{ language: languageState, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
