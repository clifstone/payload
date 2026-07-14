'use client'
import TextInput from '@/ui/forms/components/text-input'
import TextArea from '@/ui/forms/components/textarea'
import FormWrapper from '@/ui/forms/formWrapper'
import Button from '@/ui/buttons/simple'

const TestForm = () => {
  return (
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
          inputMode='text'
          required
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          inputMode='text'
          required
        />
        <TextInput
          label="Email"
          placeholder="Email Address"
          inputMode='email'
          required
        />
        <TextInput
          label="Phone"
          placeholder="Phone Number"
          inputMode='tel'
          required
        />
        <TextArea
          label="Message"
          placeholder="What do you want?"
          required
        />
        <Button variant='solid' type="submit">Submit</Button>
      </div>
    </FormWrapper>
  )
}

export default TestForm
