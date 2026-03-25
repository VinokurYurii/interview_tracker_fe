export interface Company {
  id: number;
  name: string;
  site_link: string | null;
}

export interface CreateCompanyData {
  name: string;
  site_link?: string;
}
