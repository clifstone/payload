'use client'
// import { useModal } from '@lib/context/modals';
import { useDrawer } from '@/ui/context/drawers'
import { useRouter } from 'next/navigation'

interface ClientProps {
  drawer?: string
  modal?: string
  modalData?: any
  navigateTo?: string
  transition?: string
}

const Client = ({
  drawer,
  // modal,
  // modalData,
  navigateTo,
  ...props
}: ClientProps) => {
  // const { toggleModal, setModalData } = useModal();
  const { toggleDrawer } = useDrawer()
  const router = useRouter()

  const handleClick = (e: any) => {
    if (drawer) toggleDrawer(drawer)
    if (navigateTo) router.push(navigateTo)
    // if (modal) toggleModal(modal);
    // if (modalData) setModalData(modalData);
  }

  return (
    <div
      className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] z-10"
      onClick={handleClick}
    />
  )
}

export default Client
