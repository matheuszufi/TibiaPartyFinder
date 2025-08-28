import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage, type Language } from '../contexts/LanguageContext';

const languageOptions = [
  { value: 'pt' as Language, label: 'Português', flag: '🇧🇷' },
  { value: 'en' as Language, label: 'English', flag: '🇺🇸' },
  { value: 'es' as Language, label: 'Español', flag: '🇪🇸' }
];

interface LanguageSelectorProps {
  variant?: 'default' | 'header';
}

export function LanguageSelector({ variant = 'default' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  
  const currentOption = languageOptions.find(option => option.value === language);

  if (variant === 'header') {
    return (
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-auto border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/40 focus:border-white/60">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentOption?.flag}</span>
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200">
          {languageOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <span>{option.flag}</span>
                <span>{t(`language.${option.value === 'pt' ? 'portuguese' : option.value === 'en' ? 'english' : 'spanish'}`)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <span>{option.flag}</span>
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
