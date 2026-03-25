import { useContext } from 'react';
import { PositionsContext } from './positions-context.ts';
import type { PositionsContextValue } from './positions-context.ts';

export function usePositions(): PositionsContextValue {
  const context = useContext(PositionsContext);
  if (!context) {
    throw new Error('usePositions must be used within a PositionsProvider');
  }
  return context;
}
