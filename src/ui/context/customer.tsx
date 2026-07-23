'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Customer {
  // Replace these with actual customer fields
  id: string
  name: string
  email: string
}

interface CustomerContextType {
  customer: Customer | null
  setCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
  showLogin: boolean
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
}

interface CustomerProviderProps {
  theCustomer?: Customer | null
  children: ReactNode
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

export const CustomerProvider = ({ theCustomer, children }: CustomerProviderProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [showLogin, setShowLogin] = useState<boolean>(true)

  useEffect(() => {
    console.log(customer)
  }, [customer])

  return (
    <CustomerContext.Provider
      value={{
        customer,
        setCustomer,
        showLogin,
        setShowLogin,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext)

  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider')
  }

  return context
}
