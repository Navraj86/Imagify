'use client';

import { m } from 'motion/react';
import { stepsData } from '@/assets/assets';
import { fadeUp } from '@/lib/motion';
import SectionHeading from '@/components/SectionHeading';
import { Card } from '@/components/ui/card';

const Steps = () => {
  return (
    <section id='how-it-works' className='scroll-mt-24 py-24'>
        <m.div {...fadeUp}>
            <SectionHeading
              eyebrow='How it works'
              title={<>From prompt to <span className='font-serif font-normal italic text-gradient pr-1'>picture</span></>}
              subtitle='Three steps. No design experience needed.'
            />
        </m.div>

        <ol className='relative mt-16 grid gap-4 md:grid-cols-3'>
            <div aria-hidden className='absolute left-[16%] right-[16%] top-12 hidden h-px bg-linear-to-r from-transparent via-white/15 to-transparent md:block' />
            {stepsData.map((item, index) => {
                const Icon = item.icon;
                return (
                    <m.li key={item.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.12 }}>
                        <Card className='h-full gap-0 p-6 transition hover:bg-white/5 hover:ring-white/20 sm:p-8'>
                            <div className='flex items-center justify-between'>
                                <span className='grid size-12 place-items-center rounded-xl border border-white/10 bg-linear-to-b from-white/10 to-white/2'>
                                    <Icon className='size-5 text-fuchsia-200' />
                                </span>
                                <span className='font-mono text-sm text-zinc-600'>0{index + 1}</span>
                            </div>
                            <h3 className='mt-6 text-lg font-medium text-white'>{item.title}</h3>
                            <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>{item.description}</p>
                        </Card>
                    </m.li>
                )
            })}
        </ol>
    </section>
  )
};

export default Steps;
