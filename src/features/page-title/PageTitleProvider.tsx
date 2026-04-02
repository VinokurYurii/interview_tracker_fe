import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { PageTitleContext } from './page-title-context.ts';

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState('');

  const setTitle = useCallback((newTitle: string) => {
    setTitleState(newTitle);
  }, []);

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}
