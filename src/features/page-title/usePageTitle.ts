import { useContext } from 'react';
import { PageTitleContext } from './page-title-context.ts';

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (!context) throw new Error('usePageTitle must be used within PageTitleProvider');
  return context;
}
