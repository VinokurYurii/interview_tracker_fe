import { useState, useCallback } from 'react';

type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme');
  return saved === 'light' ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
