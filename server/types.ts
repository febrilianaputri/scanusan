import type { UserRole } from "../src/types.js"

export interface Employee {
  id: string

  name: string

  email: string

  role: UserRole

  status: "active" | "inactive"

  lastActivity: string

  phone?: string

  position?: string

  department?: string
}

declare global {
  namespace Express {
    interface Request {
      employee?: Employee
    }
  }
}
