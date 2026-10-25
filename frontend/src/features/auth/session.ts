const TOKEN = "token";
const ROLE = "role";

export type Role = "employee" | "manager";

export const getToken = () => localStorage.getItem(TOKEN);
export const getRole = () => localStorage.getItem(ROLE) as Role | null;

export const setSession = (token: string, role: Role) => {
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(ROLE, role);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(ROLE);
};
