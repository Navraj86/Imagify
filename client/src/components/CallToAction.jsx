'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { m } from 'motion/react';
import { WandSparkles } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';
import { fadeUp } from '@/lib/motion';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
    const { user, openAuth } = useContext(AppContext);
    const router = useRouter();
    const onClickHandler = () => {
        if (user) {
            router.push('/result');
        } else {
            openAuth('Sign Up', '/result');
        }
    }

  return (
    <section className='py-24'>
        <m.div {...fadeUp} className='gradient-border relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-16 text-center sm:px-16 sm:py-24'>
            <div aria-hidden className='absolute inset-0 bg-grid opacity-60 mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]' />
            <div aria-hidden className='absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgb(192_38_211/0.30),transparent)]' />

            <Image src={assets.sample_img_2} alt='' className='absolute -left-10 top-10 hidden w-44 -rotate-12 rounded-2xl border border-white/10 opacity-50 shadow-2xl lg:block' />
            <Image src={assets.sample_img_1} alt='' className='absolute -right-10 bottom-10 hidden w-44 rotate-12 rounded-2xl border border-white/10 opacity-50 shadow-2xl lg:block' />

            <div className='relative'>
                <h2 className='mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl'>
                    Ready to make <span className='font-serif font-normal italic text-gradient pr-1'>something?</span>
                </h2>
                <p className='mx-auto mt-5 max-w-md text-muted-foreground'>
                    {user ? 'Your credits are waiting in the studio.' : 'Sign up and get 5 free credits. No card needed.'}
                </p>
                <Button size='xl' onClick={onClickHandler} className='mt-10 rounded-full px-8 shadow-[0_8px_30px_-6px_rgba(217,70,239,0.45)]'>
                    <WandSparkles data-icon='inline-start' />
                    {user ? 'Open studio' : 'Try it free'}
                </Button>
            </div>
        </m.div>
    </section>
  )
};

export default CallToAction;
