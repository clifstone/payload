import { Button } from '@/components/ui/button'
import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import {
  AddressBlock,
  Field,
  NativeCheckbox,
  NativeInput,
  SectionHeader,
  StatusMessage,
  type AccountAddress,
} from '../components'
import { addAddress, deleteAddress, setDefaultAddress, updateAddress } from '../actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    status?: string
  }>
}

const AddressFormFields = ({ address }: { address?: AccountAddress }) => (
  <>
    {address?.id && <input name="addressID" type="hidden" value={address.id} />}
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Label">
        <NativeInput defaultValue={address?.label || 'Home'} name="label" />
      </Field>
      <Field label="Company">
        <NativeInput defaultValue={address?.company || ''} name="company" />
      </Field>
      <Field label="First name">
        <NativeInput defaultValue={address?.firstName || ''} name="firstName" required />
      </Field>
      <Field label="Last name">
        <NativeInput defaultValue={address?.lastName || ''} name="lastName" required />
      </Field>
    </div>
    <Field label="Street address line 1">
      <NativeInput defaultValue={address?.line1 || ''} name="line1" required />
    </Field>
    <Field label="Street address line 2">
      <NativeInput defaultValue={address?.line2 || ''} name="line2" />
    </Field>
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="City">
        <NativeInput defaultValue={address?.city || ''} name="city" required />
      </Field>
      <Field label="State / province">
        <NativeInput defaultValue={address?.stateProvince || ''} name="stateProvince" required />
      </Field>
      <Field label="Postal / ZIP code">
        <NativeInput defaultValue={address?.postalCode || ''} name="postalCode" required />
      </Field>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Country">
        <NativeInput defaultValue={address?.country || ''} name="country" required />
      </Field>
      <Field label="Phone">
        <NativeInput defaultValue={address?.phone || ''} name="phone" type="tel" />
      </Field>
    </div>
    <div className="flex flex-wrap gap-4">
      <NativeCheckbox name="isDefaultShipping" value={address?.isDefaultShipping}>
        Default shipping
      </NativeCheckbox>
      <NativeCheckbox name="isDefaultBilling" value={address?.isDefaultBilling}>
        Default billing
      </NativeCheckbox>
    </div>
  </>
)

export default async function AddressesPage({ searchParams }: PageProps) {
  const { customer } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account/addresses',
  })
  const status = (await searchParams)?.status

  if (!customer) return null

  const addresses = (customer.addresses || []) as AccountAddress[]

  return (
    <div>
      <SectionHeader eyebrow="Account" title="Addresses" />
      <StatusMessage status={status} />

      <div className="grid gap-6">
        {addresses.length ? (
          addresses.map((address) => (
            <section className="rounded-lg border p-5" key={address.id}>
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-neutral-950">
                      {address.label || 'Saved address'}
                    </h2>
                    {address.isDefaultShipping && (
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium">
                        Shipping
                      </span>
                    )}
                    {address.isDefaultBilling && (
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium">
                        Billing
                      </span>
                    )}
                  </div>
                  <AddressBlock address={address} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={setDefaultAddress}>
                    <input name="addressID" type="hidden" value={address.id || ''} />
                    <input name="defaultType" type="hidden" value="shipping" />
                    <Button size="sm" type="submit" variant="outline">
                      Make shipping
                    </Button>
                  </form>
                  <form action={setDefaultAddress}>
                    <input name="addressID" type="hidden" value={address.id || ''} />
                    <input name="defaultType" type="hidden" value="billing" />
                    <Button size="sm" type="submit" variant="outline">
                      Make billing
                    </Button>
                  </form>
                  <form action={deleteAddress}>
                    <input name="addressID" type="hidden" value={address.id || ''} />
                    <Button size="sm" type="submit" variant="destructive">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>

              <details className="rounded-md bg-neutral-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold">Edit address</summary>
                <form action={updateAddress} className="mt-4 grid gap-4">
                  <AddressFormFields address={address} />
                  <div>
                    <Button type="submit">Save address</Button>
                  </div>
                </form>
              </details>
            </section>
          ))
        ) : (
          <p className="rounded-lg border p-5 text-sm text-neutral-500">No saved addresses yet.</p>
        )}

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold text-neutral-950">Add address</h2>
          <form action={addAddress} className="grid gap-4">
            <AddressFormFields />
            <div>
              <Button type="submit">Add address</Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
