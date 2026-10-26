'use client';

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { m } from "motion/react";
import { ArrowRight, Check, Sparkles, WandSparkles } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { assets } from '@/assets/assets';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const showcase = [
    { image: assets.sample_img_1, prompt: 'Furry monster chef with a birthday cake' },
    { image: assets.sample_img_2, prompt: 'Cyclops monster studying by lamplight' },
];

const Header = () => {
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
    <section className='relative pb-24 pt-16 text-center sm:pt-24'>
        <m.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge asChild variant='outline' className='group h-auto gap-2 bg-white/4 py-1 pl-1 pr-3 text-xs font-normal text-zinc-300 backdrop-blur hover:border-white/20'>
                <Link href='/buy'>
                    <span className='rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 px-2 py-0.5 font-medium text-white'>Free</span>
                    5 credits when you sign up
                    <ArrowRight className='transition group-hover:translate-x-0.5' />
                </Link>
            </Badge>
        </m.div>

        <m.h1 className='mx-auto mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}>
            Turn text into{' '}
            <span className='text-gradient pr-2 font-serif font-normal italic'>images</span> in seconds
        </m.h1>

        <m.p className='mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            Describe what you want to see and Imagify generates it. Download the result as a high-resolution PNG.
        </m.p>

        <m.div className='mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <Button size='xl' onClick={onClickHandler} className='w-full rounded-full px-7 shadow-[0_8px_30px_-6px_rgba(217,70,239,0.45)] sm:w-auto'>
                <WandSparkles data-icon='inline-start' />
                {user ? 'Open studio' : 'Try it free'}
            </Button>
            <Button asChild size='xl' variant='outline' className='w-full rounded-full px-7 sm:w-auto'>
                <Link href='/buy'>See pricing</Link>
            </Button>
        </m.div>

        <m.ul className='mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.8 }}>
            {['5 free credits', 'No card needed', 'No subscription'].map((item) => (
                <li key={item} className='flex items-center gap-1.5'>
                    <Check className='size-4 text-fuchsia-300' />
                    {item}
                </li>
            ))}
        </m.ul>

        {/* Product preview */}
        <m.div className='relative mx-auto mt-20 max-w-5xl' initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}>
            {/* Glow behind the preview. Each blob uses closest-side so it fades to fully transparent inside its own box (no visible edges) */}
            <div aria-hidden className='pointer-events-none absolute -inset-x-16 -top-28 h-[30rem]'>
                <div className='absolute inset-y-0 left-0 w-3/5 bg-[radial-gradient(closest-side,rgb(124_58_237/0.30),transparent)]' />
                <div className='absolute inset-y-0 left-1/4 w-1/2 bg-[radial-gradient(closest-side,rgb(217_70_239/0.18),transparent)]' />
                <div className='absolute inset-y-8 right-0 w-1/2 bg-[radial-gradient(closest-side,rgb(251_191_36/0.12),transparent)]' />
            </div>

            <div className='glass relative rounded-2xl p-2 shadow-2xl shadow-black/60'>
                <div className='rounded-xl border border-white/5 bg-zinc-950/80 p-3 sm:p-5'>
                    <div className='flex items-center gap-1.5 pb-3 sm:pb-4'>
                        <span className='size-2.5 rounded-full bg-white/15' />
                        <span className='size-2.5 rounded-full bg-white/15' />
                        <span className='size-2.5 rounded-full bg-white/15' />
                        <span className='ml-3 text-xs text-zinc-500'>Imagify Studio</span>
                    </div>

                    <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-1.5 pl-4 text-left'>
                        <Sparkles className='size-4 shrink-0 text-fuchsia-300' />
                        <p className='flex-1 truncate text-sm text-zinc-300'>
                            A furry monster chef baking a birthday cake, Pixar style
                            <span className='ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-blink bg-zinc-300' />
                        </p>
                        <span className='hidden rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950 sm:inline-block'>Generate</span>
                    </div>

                    <div className='mt-3 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-5'>
                        {showcase.map((item) => (
                            <div key={item.prompt} className='group relative overflow-hidden rounded-xl border border-white/10'>
                                <Image src={item.image} alt={item.prompt} placeholder='blur' sizes='(min-width: 1024px) 480px, 50vw' className='aspect-square w-full object-cover transition duration-700 group-hover:scale-105' preload />
                                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-10 text-left sm:p-4 sm:pt-16'>
                                    <p className='truncate text-xs text-zinc-200 sm:text-sm'>{item.prompt}</p>
                                </div>
                                <span className='absolute right-3 top-3 hidden rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[11px] text-zinc-200 backdrop-blur sm:inline-block'>1024 × 1024</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </m.div>
    </section>
  )
};

export default Header;
