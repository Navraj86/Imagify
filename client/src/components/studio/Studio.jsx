'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { m } from 'motion/react';
import { toast } from 'sonner';
import { Coins, Copy, Download, History, ImagePlus, LoaderCircle, Lock, RotateCcw, Shuffle, WandSparkles } from 'lucide-react';
import { assets, plans, promptIdeas, stylePresets } from '@/assets/assets';
import { formatPrice } from '@/lib/format';
import { AppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Typical generation time; only drives the progress bar
const ESTIMATED_SECONDS = 10;
const MAX_PROMPT_LENGTH = 1000;

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'image';

const StudioHeader = ({ credit }) => (
  <div className='flex flex-wrap items-end justify-between gap-4'>
    <div>
      <p className='text-sm font-medium text-fuchsia-300'>Studio</p>
      <h1 className='mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl'>
        Create an <span className='font-serif font-normal italic text-gradient pr-1'>image</span>
      </h1>
    </div>
    {credit !== undefined &&
      <Badge asChild variant='outline' className='h-9 gap-2 rounded-full px-4 text-sm font-normal'>
        <Link href='/buy'>
          <Coins className='size-4! text-amber-300' />
          {credit === false ? '…' : credit} credits left
        </Link>
      </Badge>
    }
  </div>
);

const StudioSkeleton = () => (
  <div className='py-12 sm:py-16'>
    <Skeleton className='h-4 w-16' />
    <Skeleton className='mt-3 h-9 w-72' />
    <div className='mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]'>
      <Skeleton className='h-128 rounded-2xl' />
      <Skeleton className='aspect-square rounded-2xl' />
    </div>
  </div>
);

const SignInGate = ({ openAuth }) => (
  <m.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='grid min-h-[70vh] place-items-center py-16'>
    <Card className='w-full max-w-lg items-center gap-0 p-8 text-center sm:p-10'>
      <div className='flex -space-x-6'>
        <Image src={assets.sample_img_1} alt='' className='size-20 -rotate-6 rounded-2xl border border-white/10 shadow-xl' />
        <Image src={assets.sample_img_2} alt='' className='size-20 rotate-6 rounded-2xl border border-white/10 shadow-xl' />
      </div>
      <span className='mt-6 grid size-10 place-items-center rounded-full border border-white/10 bg-white/5'>
        <Lock className='size-4 text-zinc-300' />
      </span>
      <h1 className='mt-4 text-2xl font-semibold tracking-tight text-white'>Sign in to generate images</h1>
      <p className='mt-2 text-muted-foreground'>You need an account to use the studio. New accounts get 5 free credits.</p>
      <div className='mt-8 flex w-full flex-col gap-3 sm:flex-row'>
        <Button size='xl' className='flex-1 rounded-full' onClick={() => openAuth('Sign Up', '/result')}>Create account</Button>
        <Button size='xl' variant='outline' className='flex-1 rounded-full' onClick={() => openAuth('Login', '/result')}>Sign in</Button>
      </div>
    </Card>
  </m.div>
);

// Owns the progress timer so its ticks re-render only this overlay, not the whole form
const GeneratingOverlay = ({ overImage }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 200);
    return () => clearInterval(timer);
  }, []);

  const progress = Math.min(95, (elapsed / ESTIMATED_SECONDS) * 100);

  return (
    <div className={cn('absolute inset-0 grid place-items-center overflow-hidden', overImage ? 'bg-black/50' : 'bg-zinc-950')} role='status' aria-live='polite'>
      <div className='absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/10 to-transparent' />
      <div className='relative w-56 text-center'>
        <LoaderCircle className='mx-auto size-8 animate-spin text-fuchsia-300' />
        <p className='mt-3 text-sm text-zinc-200'>Generating your image…</p>
        <Progress value={progress} className='mt-4 h-1.5 bg-white/10 *:data-[slot=progress-indicator]:bg-linear-to-r *:data-[slot=progress-indicator]:from-violet-500 *:data-[slot=progress-indicator]:via-fuchsia-500 *:data-[slot=progress-indicator]:to-amber-400' />
        <p className='mt-2 text-xs tabular-nums text-muted-foreground'>{Math.floor(elapsed)}s</p>
      </div>
    </div>
  )
};

const Workspace = () => {
  const { credit, generateImage, history } = useContext(AppContext);

  const [input, setInput] = useState('');
  const [style, setStyle] = useState('none');
  const [image, setImage] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [Loading, setLoading] = useState(false);
  const promptRef = useRef(null);
  const canvasRef = useRef(null);

  const outOfCredits = credit === 0;
  const canGenerate = !Loading && !outOfCredits && input.trim().length > 0;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!canGenerate) return;

    const prompt = input.trim();
    const suffix = stylePresets.find(preset => preset.id === style)?.suffix;

    setLoading(true);

    // On stacked (mobile) layouts the canvas sits below the form, so bring it into view
    if (window.matchMedia('(max-width: 1023px)').matches) {
      canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const result = await generateImage(suffix ? `${prompt}, ${suffix}` : prompt);
    if (result) {
      setImage(result);
      setImagePrompt(prompt);
    }
    setLoading(false);
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form.requestSubmit();
    }
  }

  const surpriseMe = () => {
    const options = promptIdeas.filter(idea => idea !== input);
    setInput(options[Math.floor(Math.random() * options.length)]);
    promptRef.current?.focus();
  }

  const newPrompt = () => {
    setInput('');
    promptRef.current?.focus();
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(imagePrompt);
      toast.success('Prompt copied');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  }

  const selectFromHistory = (item) => {
    setImage(item.image);
    setImagePrompt(item.prompt);
  }

  return (
    <m.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='py-12 sm:py-16'>
      <StudioHeader credit={credit} />

      <div className='mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]'>
        <Card className='gap-0 p-5 sm:p-6'>
          <form onSubmit={onSubmitHandler} className='flex h-full flex-col'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='prompt' className='text-sm text-white'>Prompt</Label>
              <Button type='button' variant='ghost' size='sm' onClick={surpriseMe} className='text-muted-foreground'>
                <Shuffle /> Surprise me
              </Button>
            </div>
            <Textarea
              id='prompt'
              ref={promptRef}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              value={input}
              rows={6}
              maxLength={MAX_PROMPT_LENGTH}
              autoFocus
              placeholder='Describe what you want to generate…'
              className='mt-3 min-h-36 resize-none rounded-xl bg-black/30 p-4 text-sm leading-relaxed dark:bg-black/30'
            />
            <div className='mt-2 flex justify-between gap-4 text-xs text-muted-foreground'>
              <span><kbd className='font-sans'>Enter</kbd> to generate · <kbd className='font-sans'>Shift + Enter</kbd> for a new line</span>
              <span className={cn('tabular-nums', input.length > MAX_PROMPT_LENGTH * 0.9 && 'text-amber-300')}>{input.length}/{MAX_PROMPT_LENGTH}</span>
            </div>

            <p className='mt-6 text-xs font-medium uppercase tracking-widest text-muted-foreground'>Style</p>
            <ToggleGroup type='single' variant='outline' size='sm' value={style} onValueChange={v => v && setStyle(v)} className='mt-3 w-full flex-wrap' aria-label='Image style'>
              {stylePresets.map((preset) => (
                <ToggleGroupItem key={preset.id} value={preset.id} className='rounded-full px-3 data-[state=on]:border-fuchsia-400/50 data-[state=on]:bg-fuchsia-500/15 data-[state=on]:text-white'>
                  {preset.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <p className='mt-6 text-xs font-medium uppercase tracking-widest text-muted-foreground'>Ideas</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {promptIdeas.map((idea) => (
                <button type='button' key={idea} onClick={() => setInput(idea)} className='rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-left text-xs text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white'>
                  {idea}
                </button>
              ))}
            </div>

            <div className='mt-8 lg:mt-auto lg:pt-8'>
              {outOfCredits ?
                <div className='rounded-xl border border-amber-400/30 bg-amber-400/10 p-4'>
                  <p className='text-sm font-medium text-amber-200'>You&apos;re out of credits</p>
                  <p className='mt-1 text-sm text-amber-100/70'>Buy more to keep generating. Plans start at {formatPrice(plans[0].price)} for {plans[0].credits} images.</p>
                  <Button asChild size='lg' className='mt-4 w-full rounded-full'>
                    <Link href='/buy'><Coins /> Buy credits</Link>
                  </Button>
                </div>
                :
                <>
                  <Button type='submit' size='xl' disabled={!canGenerate} className='w-full rounded-full shadow-[0_8px_30px_-6px_rgba(217,70,239,0.45)]'>
                    {Loading ? <LoaderCircle className='animate-spin' /> : <WandSparkles />}
                    {Loading ? 'Generating…' : 'Generate image'}
                  </Button>
                  <p className='mt-3 text-center text-xs text-muted-foreground'>1 credit per image. Failed generations are free.</p>
                </>
              }
            </div>
          </form>
        </Card>

        <div>
          <Card ref={canvasRef} className='relative aspect-square scroll-mt-24 gap-0 py-0'>
            {/* Exactly one of: loading view, generated image, or empty state */}
            {image &&
              <Image src={image} alt={imagePrompt || 'Generated image'} fill sizes='(min-width: 1024px) 600px, 100vw' className={cn('object-cover transition duration-500', Loading && 'scale-[1.02] opacity-30 blur-md')} />
            }

            {Loading ?
              <GeneratingOverlay overImage={!!image} />
            : !image &&
              <div className='absolute inset-0 grid place-items-center bg-grid bg-size-[32px_32px]'>
                <div className='px-6 text-center'>
                  <span className='mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/5'>
                    <ImagePlus className='size-6 text-zinc-400' />
                  </span>
                  <p className='mt-4 text-sm font-medium text-zinc-300'>Your image will appear here</p>
                  <p className='mt-1 text-xs text-muted-foreground'>Write a prompt and press Generate.</p>
                </div>
              </div>
            }
          </Card>

          {image && !Loading &&
            <div className='mt-4 flex gap-2'>
              <Button asChild size='xl' className='flex-1 rounded-full'>
                <a href={image} download={`imagify-${slugify(imagePrompt)}.png`}>
                  <Download /> Download
                </a>
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type='button' variant='outline' size='xl' onClick={copyPrompt} className='rounded-full px-4' aria-label='Copy prompt'>
                    <Copy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy prompt</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type='button' variant='outline' size='xl' onClick={newPrompt} className='rounded-full px-4' aria-label='Start a new prompt'>
                    <RotateCcw />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New prompt</TooltipContent>
              </Tooltip>
            </div>
          }
        </div>
      </div>

      {history.length > 0 &&
        <div className='mt-12'>
          <div className='flex items-center gap-2'>
            <History className='size-4 text-muted-foreground' />
            <h2 className='text-sm font-medium text-white'>Recent generations</h2>
            <span className='text-xs text-muted-foreground'>· cleared when you refresh</span>
          </div>
          <div className='mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6'>
            {history.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    type='button'
                    onClick={() => selectFromHistory(item)}
                    aria-label={`Show: ${item.prompt}`}
                    className={cn('relative aspect-square overflow-hidden rounded-xl border transition hover:opacity-90', image === item.image ? 'border-fuchsia-400 ring-2 ring-fuchsia-400/30' : 'border-white/10')}
                  >
                    <Image src={item.image} alt='' fill sizes='160px' className='object-cover' />
                  </button>
                </TooltipTrigger>
                <TooltipContent className='max-w-64'>{item.prompt}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      }
    </m.section>
  )
};

const Studio = () => {
  const { user, authLoading, openAuth } = useContext(AppContext);

  if (authLoading) return <StudioSkeleton />;
  if (!user) return <SignInGate openAuth={openAuth} />;
  return (
    <TooltipProvider delayDuration={200}>
      <Workspace />
    </TooltipProvider>
  );
};

export default Studio;
