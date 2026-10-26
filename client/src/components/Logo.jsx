import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const Logo = () => {
  return (
    <Link href='/' className='flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring'>
      <span className='grid size-8 place-items-center rounded-lg bg-linear-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-500/25'>
        <Sparkles className='size-4 text-white' strokeWidth={2.25} />
      </span>
      <span className='text-lg font-semibold tracking-tight text-white'>Imagify</span>
    </Link>
  )
};

export default Logo;
