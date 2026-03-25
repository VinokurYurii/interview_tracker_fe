import type { Company, CreateCompanyData } from '../types/company.ts';
import { apiClient } from './api-client.ts';

export async function getCompanies(): Promise<Company[]> {
  const { data } = await apiClient<Company[]>('/api/companies');
  return data;
}

export async function createCompany(companyData: CreateCompanyData): Promise<Company> {
  const { data } = await apiClient<Company>('/api/companies', {
    method: 'POST',
    body: JSON.stringify({ company: companyData }),
  });
  return data;
}
