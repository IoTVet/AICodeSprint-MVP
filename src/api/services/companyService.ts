// src/api/services/companyService.ts
import client from '../client';
import { CompanyContext } from '../types';

export const companyService = {
  getCompanyContext: () => client.get<CompanyContext[]>('/company-context'),
  updateCompanyContext: (context: CompanyContext[]) => client.put('/company-context', context),
};