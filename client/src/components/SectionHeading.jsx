import { Badge } from '@/components/ui/badge';

const SectionHeading = ({ eyebrow, title, subtitle, as: Heading = 'h2' }) => {
  return (
    <div className='mx-auto max-w-2xl text-center'>
      <Badge variant='outline' className='h-7 gap-2 bg-white/3 px-3 text-xs uppercase tracking-widest text-zinc-400'>
        <span className='size-1.5 rounded-full bg-fuchsia-400' />
        {eyebrow}
      </Badge>
      <Heading className='mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl'>{title}</Heading>
      {subtitle && <p className='mt-4 text-pretty text-base text-muted-foreground sm:text-lg'>{subtitle}</p>}
    </div>
  )
};

export default SectionHeading;
