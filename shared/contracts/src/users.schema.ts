import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'manager', 'employee']);

export const UserSummarySchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string(),
  last_name: z.string(),
  role: UserRoleSchema,
});

export const UserListSchema = z.array(UserSummarySchema);

export const CreateUserSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.email().max(255),
  phone_number: z.string().max(20).nullable().optional(),
  role: UserRoleSchema.optional(),
  contract_start_date: z.iso.date(),
  contract_end_date: z.iso.date().nullable().optional(),
  team_id: z.number().int().positive().nullable().optional(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserSummary = z.infer<typeof UserSummarySchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;