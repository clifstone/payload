'use client'
// import { useModal } from '@lib/context/modals';
// import { useDrawer } from '@lib/context/drawers';

const Client = ({
  // drawer,
  // modal,
  // modalData,
  // navigateTo,
  ...props
}) => {
  // const { toggleModal, setModalData } = useModal();
  // const { toggleDrawer } = useDrawer();

  const handleClick = (e: any) => {
    // if (drawer) toggleDrawer(drawer);
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
