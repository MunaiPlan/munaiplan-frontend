import { instance } from '../api/axios.api';

export type Role = 'user' | 'admin';

export interface CurrentUser {
  id: string;
  organization_id: string;
  name: string;
  surname: string;
  email: string;
  role: Role;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  user_count: number;
}

export interface OrganizationInput {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface AccountInput {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

export interface Account {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: Role;
}

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export const adminService = {
  async currentUser(): Promise<CurrentUser> {
    const { data } = await instance.get<CurrentUser>('/api/v1/users/me');
    return data;
  },
  async listOrganizations(): Promise<OrganizationSummary[]> {
    const { data } = await instance.get<unknown>('/api/v1/admin/organizations');
    return asArray<OrganizationSummary>(data);
  },
  async createOrganization(organization: OrganizationInput, user: AccountInput): Promise<void> {
    await instance.post('/api/v1/admin/organizations', { organization, user });
  },
  async listUsers(organizationId: string): Promise<Account[]> {
    const { data } = await instance.get<unknown>(`/api/v1/admin/organizations/${organizationId}/users`);
    return asArray<Account>(data);
  },
  async createUser(organizationId: string, user: AccountInput): Promise<void> {
    await instance.post(`/api/v1/admin/organizations/${organizationId}/users`, user);
  },
};

/** Extracts the API's `{message}` error text, falling back to a generic message. */
export const apiErrorMessage = (error: unknown, fallback: string): string => {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  return typeof message === 'string' && message ? message : fallback;
};
