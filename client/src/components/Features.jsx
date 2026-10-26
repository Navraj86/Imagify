'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import { Coins, Download, Palette, ShieldCheck, Zap } from 'lucide-react';
import { assets } from '@/assets/assets';
import { fadeUp } from '@/lib/motion';
import SectionHeading from '@/components/SectionHeading';
import { Card } from '@/components/ui/card';

const features = [
  { icon: Zap, title: 'Fast', text: 'Most images are ready in a few seconds.' },
  { icon: Palette, title: 'Style presets', text: 'Pick Photo, 3D, Anime, Watercolor or Cinematic, or describe a style in your prompt.' },
  { icon: Download, title: 'PNG downloads', text: 'Every image downloads as a 1024 × 1024 PNG.' },
  { icon: Coins, title: 'Pay as you go', text: 'No subscription. One credit is one image, and you buy more when you need them.' },
  { icon: ShieldCheck, title: 'No charge for failures', text: 'If a generation fails, you keep your credit.' },
];

const Features = () => {
  return (
    <section id='features' className='scroll-mt-24 py-24'>
        <m.div {...fadeUp}>
          <SectionHeading
            eyebrow='Features'
            title={<>What you <span className='font-serif font-normal italic text-gradient pr-1'>get</span></>}
          />
        </m.div>

        <div className='mt-16 grid gap-4 md:grid-cols-3'>
          <m.div {...fadeUp} className='md:col-span-2 md:row-span-2'>
            <Card className='group relative h-full gap-0 py-0 md:min-h-[26rem]'>
              <Image src={assets.sample_img_1} alt='AI generated monster chef with a birthday cake' placeholder='blur' sizes='(min-width: 768px) 700px, 100vw' className='h-80 w-full object-cover transition duration-700 group-hover:scale-105 md:absolute md:inset-0 md:h-full' />
              <div className='relative bg-linear-to-t from-black via-black/80 to-transparent p-6 sm:p-8 md:absolute md:inset-x-0 md:bottom-0 md:pt-32'>
                <h3 className='max-w-md text-2xl font-semibold tracking-tight text-white'>Describe anything</h3>
                <p className='mt-3 max-w-lg text-sm leading-relaxed text-zinc-300'>Characters, products, portraits, places. If you can put it into words, you can generate it.</p>
              </div>
            </Card>
          </m.div>

          {features.map(({ icon: Icon, title, text }, index) => (
            <m.div key={title} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.08 }}>
              <Card className='h-full gap-0 p-6 transition hover:bg-white/5 hover:ring-white/20'>
                <Icon className='size-5 text-fuchsia-200' />
                <h3 className='mt-4 font-medium text-white'>{title}</h3>
                <p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>{text}</p>
              </Card>
            </m.div>
          ))}
        </div>
    </section>
  )
};

export default Features;
