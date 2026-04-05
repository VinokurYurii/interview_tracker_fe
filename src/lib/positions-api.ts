import type { PositionWithCompany, CreatePositionData, UpdatePositionData } from '../types/position.ts';
import { apiClient } from './api-client.ts';

export async function getPositions(): Promise<PositionWithCompany[]> {
  const { data } = await apiClient<PositionWithCompany[]>('/api/positions');
  return data;
}

export async function getPosition(id: number): Promise<PositionWithCompany> {
  const { data } = await apiClient<PositionWithCompany>(`/api/positions/${id}`);
  return data;
}

export async function createPosition(positionData: CreatePositionData): Promise<PositionWithCompany> {
  const { data } = await apiClient<PositionWithCompany>('/api/positions', {
    method: 'POST',
    body: JSON.stringify({ position: positionData }),
  });
  return data;
}

export async function updatePosition(id: number, positionData: UpdatePositionData): Promise<PositionWithCompany> {
  const { data } = await apiClient<PositionWithCompany>(`/api/positions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ position: positionData }),
  });
  return data;
}

export async function deletePosition(id: number): Promise<void> {
  await apiClient(`/api/positions/${id}`, { method: 'DELETE' });
}
