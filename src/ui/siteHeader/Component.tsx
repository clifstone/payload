import Link from 'next/link'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Button from '@/ui/buttons/simple'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
// import SiteLogo from './SiteLogo';
// import MiniCart from './miniCart';
// import AccountBtn from './Account/AccountBtn';

const SiteHeader = async (
  {
    //siteSettings,
  },
) => {
  // if (!siteSettings) {
  //   return null;
  // }

  const headerData = await getCachedGlobal('header', 1)()

  return (
    <header className="flex flex-row items-center justify-between w-full border-b bg-white/30 backdrop-blur-lg sticky top-0 py-2 px-4 z-[1]">
      <section className="flex items-center gap-2">
        <Button size="small" variant="basic" startIcon={<MenuRoundedIcon />} />
        {/* 
        <SiteLogo
          siteSettings={siteSettings}
        /> */}
      </section>

      <section className="flex gap-2">
        {/* <MiniCart />
        <AccountBtn /> */}
      </section>
    </header>
  )
}

export default SiteHeader
