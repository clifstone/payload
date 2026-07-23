'use client'
import TextInput from '@/ui/forms/components/text-input'
import TextArea from '@/ui/forms/components/textarea'
import Select from '@/ui/forms/components/select'
import Checkbox from '@/ui/forms/components/checkbox'
import FormWrapper from '@/ui/forms/formWrapper'
import Button from '@/ui/buttons/simple'

const serviceOptions = [
  { label: 'Website Design', value: 'website-design' },
  { label: 'Frontend Development', value: 'frontend-development' },
  { label: 'Backend Development', value: 'backend-development' },
  { label: 'Payload CMS Build', value: 'payload-cms-build' },
  { label: 'Ecommerce Store', value: 'ecommerce-store' },
  { label: 'Brand Identity', value: 'brand-identity' },
  { label: 'SEO Cleanup', value: 'seo-cleanup' },
  { label: 'Accessibility Audit', value: 'accessibility-audit' },
  { label: 'Performance Optimization', value: 'performance-optimization' },
  { label: 'Maintenance Plan', value: 'maintenance-plan' },
]

const TestForm = () => {
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex gap-8">
          <div className="w-[80px] h-[80px] bg-primary" />
          <div className="w-[80px] h-[80px] bg-secondary" />
          <div className="w-[80px] h-[80px] bg-tertiary" />
          <div className="w-[80px] h-[80px] bg-quaternary" />
          <div className="w-[80px] h-[80px] bg-quinary" />
        </div>
        <div className="flex gap-8">
          <div className="w-[80px] h-[80px] bg-[#ff0081]" />
          <div className="w-[80px] h-[80px] bg-[#ffaed7]" />
          <div className="w-[80px] h-[80px] bg-[#ffcae5]" />
          <div className="w-[80px] h-[80px] bg-[#C81D25]" />
          <div className="w-[80px] h-[80px] bg-[#BFD7EA]" />
        </div>
      </div>

      <div className="h-[64px]"></div>

      <div className="">
        <FormWrapper
          onSubmit={(e) => {
            e.preventDefault()
            console.log('sumbit works')
          }}
        >
          <div className="flex flex-col gap-4">
            <TextInput
              label="First Name"
              placeholder="First Name"
              inputMode="text"
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              inputMode="text"
              required
            />
            <TextInput
              label="Email"
              placeholder="Email Address"
              inputMode="email"
              required
            />
            <TextInput
              label="Phone"
              placeholder="Phone Number"
              inputMode="tel"
              required
            />
            <Select
              name="service"
              label="Service"
              placeholder="Choose a service"
              options={serviceOptions}
              searchThreshold={6}
              required
            />
            <TextArea
              label="Message"
              placeholder="What do you want?"
              required
            />
            <TextInput
              label="Password"
              placeholder="Password"
              inputMode="password"
              required
            />
            <Checkbox
              name="terms"
              label="I agree to the terms and conditions."
              required
              classNames={{
                box: 'rounded-md border-2 border-primary/60 peer-checked:border-primary peer-checked:bg-primary',
                icon: 'text-primary-foreground',
                label: 'text-base',
                alert: 'ml-8',
              }}
            />
            <Button
              variant="solid"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </FormWrapper>
      </div>
    </>
  )
}

export default TestForm
