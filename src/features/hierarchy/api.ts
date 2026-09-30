import { instance } from '../../api/axios.api';
import { kinds, type Kind } from './hierarchy';
import { treeChanged } from './treeEvents';

export interface TreeNode {
  id: string;
  kind: Kind;
  name: string;
  children: TreeNode[];
}

type Values = Record<string, unknown>;

export const hierarchyApi = {
  async tree(): Promise<TreeNode[]> {
    const { data } = await instance.get<TreeNode[]>('/api/v1/companies/tree');
    return Array.isArray(data) ? data : [];
  },
  async get<T = Values>(kind: Kind, id: string): Promise<T> {
    const { data } = await instance.get<T>(`/api/v1/${kinds[kind].api}/${id}`);
    return data;
  },
  async create(kind: Kind, parentId: string | undefined, body: Values): Promise<void> {
    const spec = kinds[kind];
    const query = spec.parentParam && parentId ? `?${spec.parentParam}=${encodeURIComponent(parentId)}` : '';
    await instance.post(`/api/v1/${spec.api}/${query}`, body);
    treeChanged();
  },
  async update(kind: Kind, id: string, body: Values): Promise<void> {
    await instance.put(`/api/v1/${kinds[kind].api}/${id}`, body);
    treeChanged();
  },
  async remove(kind: Kind, id: string): Promise<void> {
    await instance.delete(`/api/v1/${kinds[kind].api}/${id}`);
    treeChanged();
  },
};
