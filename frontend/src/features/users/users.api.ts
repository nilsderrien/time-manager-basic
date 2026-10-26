import {
  UserListSchema,
  type UserSummary,
} from '@time-manager/contracts/users';
import { api } from '../../lib/api';

export async function listUsers(): Promise<UserSummary[]> {
  const { data } = await api.get<unknown>('/users');
  return UserListSchema.parse(data);
}
