import Link from 'next/link';
import { ArrowLeft, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Page not found',
};

const NotFound = () => {
  return (
    <section className='grid min-h-[70vh] place-items-center py-16 text-center'>
      <div>
        <p className='font-serif text-8xl italic text-gradient pr-2 sm:text-9xl'>404</p>
        <h1 className='mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl'>Page not found</h1>
        <p className='mt-3 text-muted-foreground'>The link may be broken, or the page may have moved.</p>
        <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
          <Button asChild size='xl' className='rounded-full'>
            <Link href='/'><ArrowLeft /> Back home</Link>
          </Button>
          <Button asChild size='xl' variant='outline' className='rounded-full'>
            <Link href='/result'><WandSparkles /> Open studio</Link>
          </Button>
        </div>
      </div>
    </section>
  )
};

export default NotFound;
