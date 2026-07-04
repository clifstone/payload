import type { Access, FieldAccess } from 'payload'

import { hasAdminRole } from '@/access/isAdmin'

export const adminsOnly: Access = ({ req: { user } }) => {
  return hasAdminRole(user)
}

export const customersAdminOnly = ({
  req: { user },
}: Parameters<NonNullable<Access>>[0]): boolean => {
  return hasAdminRole(user)
}

export const adminsOrSelfCustomer: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasAdminRole(user)) return true

  return {
    user: {
      equals: user.id,
    },
  }
}

export const adminFieldOnly: FieldAccess = ({ req: { user } }) => {
  return hasAdminRole(user)
}
