export type RoleName = 'owner' | 'vet';

export interface Role {
  role_id: number;
  role_name: RoleName;
  description: string;
}