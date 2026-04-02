import { useEffect } from 'react';
import { usePageTitle } from './usePageTitle.ts';

export function useSetPageTitle(title: string) {
  const { setTitle } = usePageTitle();
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
}
