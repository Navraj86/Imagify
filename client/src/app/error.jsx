'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorPage = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className='grid min-h-[70vh] place-items-center py-16 text-center'>
      <div className='max-w-md'>
        <span className='mx-auto grid size-12 place-items-center rounded-full border border-destructive/30 bg-destructive/10'>
          <TriangleAlert className='size-5 text-destructive' />
        </span>
        <h1 className='mt-5 text-2xl font-semibold tracking-tight text-white'>Something went wrong</h1>
        <p className='mt-2 text-muted-foreground'>Try again, or go back to the home page.</p>
        <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
          <Button size='xl' className='rounded-full' onClick={reset}><RotateCcw /> Try again</Button>
          <Button asChild size='xl' variant='outline' className='rounded-full'>
            <Link href='/'>Back home</Link>
          </Button>
        </div>
      </div>
    </section>
  )
};

export default ErrorPage;
