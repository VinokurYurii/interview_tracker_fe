import { createContext } from 'react';
import type { PositionWithCompany } from '../../types/position.ts';

export interface PositionsContextValue {
  positions: PositionWithCompany[];
  isLoading: boolean;
  addPosition: (position: PositionWithCompany) => void;
  updatePositionInList: (id: number, updates: Partial<PositionWithCompany>) => void;
}

export const PositionsContext = createContext<PositionsContextValue | null>(null);
