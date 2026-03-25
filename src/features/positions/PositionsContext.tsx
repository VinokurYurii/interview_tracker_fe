import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { PositionWithCompany } from '../../types/position.ts';
import { getPositions } from '../../lib/positions-api.ts';
import { PositionsContext } from './positions-context.ts';

export function PositionsProvider({ children }: { children: ReactNode }) {
  const [positions, setPositions] = useState<PositionWithCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getPositions()
      .then((data) => {
        if (!cancelled) setPositions(data);
      })
      .catch(() => {
        // API errors handled by api-client (401 clears token)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const addPosition = useCallback((position: PositionWithCompany) => {
    setPositions((prev) => [position, ...prev]);
  }, []);

  const updatePositionInList = useCallback((id: number, updates: Partial<PositionWithCompany>) => {
    setPositions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  return (
    <PositionsContext.Provider value={{ positions, isLoading, addPosition, updatePositionInList }}>
      {children}
    </PositionsContext.Provider>
  );
}
