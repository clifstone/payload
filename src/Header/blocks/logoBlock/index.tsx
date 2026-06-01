import Link from 'next/link'
const probe: any = require('probe-image-size')

export const getImageSize = async (url: string) => {
  try {
    const result = await probe(url)
    return {
      width: result.width,
      height: result.height,
    }
  } catch (e) {
    console.error('Image size probe failed:', e)
    return {
      width: 640,
      height: 360,
    }
  }
}

export const getAspectRatio = async (url: string) => {
  const { width, height } = await getImageSize(url)
  if (!width || !height) return '1/1'
  console.log(url)
  console.log(width, height)
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

  const divisor = gcd(width, height)
  const ratioWidth = width / divisor
  const ratioHeight = height / divisor

  return `${ratioWidth}/${ratioHeight}`
}

const LogoBlock = async ({ image }: any) => {
  if (!image?.url) return null

  const fullUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${image.url}`
  const aspect = await getAspectRatio(fullUrl)
  const imgSize = await getImageSize(fullUrl)

  return (
    <figure className="flex-grow flex" style={{ aspectRatio: aspect }}>
      <Link href="/" className="flex-grow block">
        <img
          src={image.url}
          alt={image.alt || 'Logo'}
          className=""
          width={'auto'}
          height={'100%'}
          style={{ aspectRatio: aspect }}
        />
      </Link>
    </figure>
  )
}

export default LogoBlock
