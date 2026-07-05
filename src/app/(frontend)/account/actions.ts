'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { sendCustomerVerificationEmail } from '@/utilities/customerEmailVerification'
import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { getServerSideURL } from '@/utilities/getURL'

type Address = {
  city: string
  company?: string | null
  country: string
  firstName: string
  id?: string | null
  isDefaultBilling?: boolean | null
  isDefaultShipping?: boolean | null
  label?: string | null
  lastName: string
  line1: string
  line2?: string | null
  phone?: string | null
  postalCode: string
  stateProvince: string
}

const value = (formData: FormData, key: string): string => {
  return String(formData.get(key) || '').trim()
}

const checked = (formData: FormData, key: string): boolean => {
  return formData.get(key) === 'on'
}

const redirectWithStatus = (path: string, status: string): never => {
  redirect(`${path}?status=${encodeURIComponent(status)}`)
}

const buildAddress = (formData: FormData): Address => ({
  city: value(formData, 'city'),
  company: value(formData, 'company') || null,
  country: value(formData, 'country'),
  firstName: value(formData, 'firstName'),
  isDefaultBilling: checked(formData, 'isDefaultBilling'),
  isDefaultShipping: checked(formData, 'isDefaultShipping'),
  label: value(formData, 'label') || 'Home',
  lastName: value(formData, 'lastName'),
  line1: value(formData, 'line1'),
  line2: value(formData, 'line2') || null,
  phone: value(formData, 'phone') || null,
  postalCode: value(formData, 'postalCode'),
  stateProvince: value(formData, 'stateProvince'),
})

export const updateProfile = async (formData: FormData): Promise<void> => {
  const { customer, payload, user } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })

  if (!customer) redirect('/')

  const firstName = value(formData, 'firstName')
  const lastName = value(formData, 'lastName')
  const email = value(formData, 'email').toLowerCase()
  const phone = value(formData, 'phone')
  const emailChanged = email !== customer.email

  if (!firstName || !lastName || !email) redirectWithStatus('/account/profile', 'missing-required')

  if (emailChanged) {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        email,
        name: `${firstName} ${lastName}`,
      },
      overrideAccess: true,
    })
  }

  await payload.update({
    collection: 'customers',
    id: customer.id,
    context: {
      allowCustomerProfileUpdate: true,
      allowCustomerSecurityUpdate: emailChanged,
    },
    data: {
      email,
      emailVerified: emailChanged ? false : customer.emailVerified,
      emailVerifiedAt: emailChanged ? null : customer.emailVerifiedAt,
      firstName,
      lastName,
      phone,
    },
    overrideAccess: true,
  })

  if (emailChanged) {
    await sendCustomerVerificationEmail({
      customer: {
        ...customer,
        email,
        emailVerified: false,
        emailVerifiedAt: null,
        firstName,
        lastName,
      },
      payload,
    })
  }

  revalidatePath('/account')
  revalidatePath('/account/profile')
  redirectWithStatus('/account/profile', 'saved')
}

export const updatePreferences = async (formData: FormData): Promise<void> => {
  const { customer, payload } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })

  if (!customer) redirect('/')

  await payload.update({
    collection: 'customers',
    id: customer.id,
    context: {
      allowCustomerProfileUpdate: true,
    },
    data: {
      marketingEmailOptIn: checked(formData, 'marketingEmailOptIn'),
      smsOptIn: checked(formData, 'smsOptIn'),
    },
    overrideAccess: true,
  })

  revalidatePath('/account')
  revalidatePath('/account/settings')
  redirectWithStatus('/account/settings', 'preferences-saved')
}

export const addAddress = async (formData: FormData): Promise<void> => {
  const { customer, payload } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })

  if (!customer) redirect('/')

  const addresses = [...((customer.addresses || []) as Address[]), buildAddress(formData)]

  await payload.update({
    collection: 'customers',
    id: customer.id,
    context: {
      allowCustomerProfileUpdate: true,
    },
    data: {
      addresses,
    },
    overrideAccess: true,
  })

  revalidatePath('/account')
  revalidatePath('/account/addresses')
  redirectWithStatus('/account/addresses', 'address-added')
}

export const updateAddress = async (formData: FormData): Promise<void> => {
  const { customer, payload } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })

  if (!customer) redirect('/')

  const addressID = value(formData, 'addressID')
  const addresses = ((customer.addresses || []) as Address[]).map((address) =>
    address.id === addressID ? { ...buildAddress(formData), id: address.id } : address,
  )

  await payload.update({
    collection: 'customers',
    id: customer.id,
    context: {
      allowCustomerProfileUpdate: true,
    },
    data: {
      addresses,
    },
    overrideAccess: true,
  })

  revalidatePath('/account')
  revalidatePath('/account/addresses')
  redirectWithStatus('/account/addresses', 'address-updated')
}

export const deleteAddress = async (formData: FormData): Promise<void> => {
  const { customer, payload } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })

  if (!customer) redirect('/')

  const addressID = value(formData, 'addressID')
  const addresses = ((customer.addresses || []) as Address[]).filter(
    (address) => address.id !== addressID,
  )

  await payload.update({
    collection: 'customers',
    id: customer.id,
    context: {
      allowCustomerProfileUpdate: true,
    },
    data: {
      addresses,
    },
    overrideAccess: true,
  })

  revalidatePath('/account')
  revalidatePath('/account/addresses')
  redirectWithStatus('/account/addresses', 'address-deleted')
}

export const setDefaultAddress = async (formData: FormData): Promise<void> => {
  const { customer, payload } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })

  if (!customer) redirect('/')

  const addressID = value(formData, 'addressID')
  const defaultType = value(formData, 'defaultType')
  const addresses = ((customer.addresses || []) as Address[]).map((address) => ({
    ...address,
    isDefaultBilling:
      defaultType === 'billing' ? address.id === addressID : address.isDefaultBilling,
    isDefaultShipping:
      defaultType === 'shipping' ? address.id === addressID : address.isDefaultShipping,
  }))

  await payload.update({
    collection: 'customers',
    id: customer.id,
    context: {
      allowCustomerProfileUpdate: true,
    },
    data: {
      addresses,
    },
    overrideAccess: true,
  })

  revalidatePath('/account')
  revalidatePath('/account/addresses')
  redirectWithStatus('/account/addresses', 'default-updated')
}

export const changePassword = async (formData: FormData): Promise<void> => {
  const { payload, user } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })
  const currentPassword = value(formData, 'currentPassword')
  const newPassword = value(formData, 'newPassword')
  const newPasswordConfirm = value(formData, 'newPasswordConfirm')

  if (
    !currentPassword ||
    !newPassword ||
    newPassword.length < 8 ||
    newPassword !== newPasswordConfirm
  ) {
    redirectWithStatus('/account/settings', 'password-invalid')
  }

  const loginResponse = await fetch(`${getServerSideURL()}/api/users/login`, {
    body: JSON.stringify({
      email: user.email,
      password: currentPassword,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!loginResponse.ok) {
    redirectWithStatus('/account/settings', 'password-current-invalid')
  }

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      password: newPassword,
    },
    overrideAccess: true,
  })

  redirectWithStatus('/account/settings', 'password-updated')
}

export const resendVerificationEmail = async (): Promise<void> => {
  const { customer, payload } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account/settings',
  })

  if (!customer) redirect('/')

  if (customer.emailVerified) {
    redirectWithStatus('/account/settings', 'email-already-verified')
  }

  await sendCustomerVerificationEmail({
    customer,
    payload,
  })

  redirectWithStatus('/account/settings', 'verification-email-sent')
}
