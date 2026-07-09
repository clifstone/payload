import type { ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

const FormWrapper = ({ children }: Props) => {
  return (
    <form
      className=""
      //onSubmit={}
    >
      {children && children}
    </form>
  )
}

export default FormWrapper
