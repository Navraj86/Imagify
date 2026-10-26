'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { testimonialsData } from '@/assets/assets';
import { fadeUp } from '@/lib/motion';
import SectionHeading from '@/components/SectionHeading';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const Testimonials = () => {
  return (
    <section className='py-24'>
        <m.div {...fadeUp}>
          <SectionHeading
            eyebrow='Testimonials'
            title={<>What people <span className='font-serif font-normal italic text-gradient pr-1'>say</span></>}
          />
        </m.div>

        <div className='mt-16 grid gap-4 md:grid-cols-3'>
          {testimonialsData.map((testimonial, index) => (
            <m.div key={index} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.1 }}>
              <Card className='h-full gap-0 p-6 transition hover:ring-white/20 sm:p-8'>
                <figure className='flex h-full flex-col'>
                  <Quote className='size-6 text-fuchsia-300/60' />
                  <blockquote className='mt-4 flex-1 text-pretty text-[15px] leading-relaxed text-zinc-300'>
                    {testimonial.text}
                  </blockquote>
                  <div className='mt-6 flex gap-0.5' aria-label={`${testimonial.stars} out of 5 stars`}>
                    {Array(5).fill('').map((_, starIndex) => (
                      <Star key={starIndex} className={starIndex < testimonial.stars ? 'size-4 fill-amber-400 text-amber-400' : 'size-4 text-zinc-700'} />
                    ))}
                  </div>
                  <figcaption className='mt-6 flex items-center gap-3 border-t border-white/10 pt-6'>
                    <Avatar className='size-10'>
                      <Image src={testimonial.image} alt={testimonial.name} className='size-full object-cover' />
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium text-white'>{testimonial.name}</p>
                      <p className='text-xs text-muted-foreground'>{testimonial.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Card>
            </m.div>
          ))}
        </div>
    </section>
  )
};

export default Testimonials;
