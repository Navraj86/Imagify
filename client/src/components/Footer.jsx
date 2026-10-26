import Link from 'next/link';
import Logo from '@/components/Logo';

const Footer = () => {
  return (
    <footer className='mt-12 border-t border-white/10'>
      <div className='mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]'>
        <div>
          <Logo />
          <p className='mt-4 max-w-xs text-sm text-muted-foreground'>Text to image generation with pay-as-you-go credits.</p>
        </div>

        <div>
          <p className='text-sm font-medium text-white'>Product</p>
          <ul className='mt-4 space-y-3 text-sm text-muted-foreground'>
            <li><Link href='/result' className='transition hover:text-white'>Studio</Link></li>
            <li><Link href='/buy' className='transition hover:text-white'>Pricing</Link></li>
          </ul>
        </div>

        <div>
          <p className='text-sm font-medium text-white'>Explore</p>
          <ul className='mt-4 space-y-3 text-sm text-muted-foreground'>
            <li><Link href='/#how-it-works' className='transition hover:text-white'>How it works</Link></li>
            <li><Link href='/#features' className='transition hover:text-white'>Features</Link></li>
          </ul>
        </div>
      </div>

      <div className='border-t border-white/5'>
        <p className='mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-500 sm:px-6'>© {new Date().getFullYear()} Imagify · Made by Navraj. All rights reserved.</p>
      </div>
    </footer>
  )
};

export default Footer;
