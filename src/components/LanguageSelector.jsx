import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Add RTL support for Arabic
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="language-selector dropdown">
      <button 
        className="btn btn-outline-light dropdown-toggle" 
        type="button" 
        id="languageDropdown" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        {languages.find(lang => lang.code === i18n.language)?.flag || '🌐'} 
        {languages.find(lang => lang.code === i18n.language)?.name || 'Language'}
      </button>
      <ul className="dropdown-menu" aria-labelledby="languageDropdown">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button 
              className={`dropdown-item ${i18n.language === lang.code ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              <span className="flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LanguageSelector; 