export type UserRole = "SUPER_ADMIN" | "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image: string | null;
  createdAt: Date;
  _count?: {
    classes?: number;
    enrollments?: number;
  };
}
