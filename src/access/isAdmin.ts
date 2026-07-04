import type { Access, FieldAccess } from 'payload'

type UserWithRoles = {
  roles?: ('admin' | 'customer')[] | null
}

export const hasAdminRole = (user: unknown): boolean => {
  return Boolean((user as UserWithRoles | null | undefined)?.roles?.includes('admin'))
}

export const isAdmin: Access = ({ req: { user } }) => {
  return hasAdminRole(user)
}

export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return hasAdminRole(user)
}
