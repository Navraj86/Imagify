'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { m } from 'motion/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Check, CircleCheck, Coins, FlaskConical, LoaderCircle, ShieldCheck, WandSparkles } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { plans } from '@/assets/assets';
import { getErrorMessage, isAuthError } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { fadeUp } from '@/lib/motion';
import { getCheckoutLogo, loadRazorpay, RAZORPAY_KEY, RAZORPAY_TEST_MODE } from '@/lib/razorpay';
import { cn } from '@/lib/utils';
import SectionHeading from '@/components/SectionHeading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const faqs = [
  {
    q: 'What is a credit?',
    a: 'One credit generates one image. New accounts start with 5 free credits so you can try Imagify before buying.',
  },
  {
    q: 'Am I charged if a generation fails?',
    a: 'No. A credit is only deducted after an image is generated successfully.',
  },
  {
    q: 'Do my credits expire?',
    a: 'No. Purchased credits stay in your account until you use them.',
  },
  {
    q: 'Is this a subscription?',
    a: 'No. Every plan is a one-time purchase. Buy another pack whenever you need more credits.',
  },
  {
    q: 'How do payments work?',
    a: 'Checkout is handled securely by Razorpay. Imagify never sees or stores your card details.',
  },
];

const TestModeNotice = () => (
  <div className='mx-auto mt-10 flex max-w-2xl gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-left text-sm'>
    <FlaskConical className='mt-0.5 size-4 shrink-0 text-amber-300' />
    <div className='text-amber-100/80'>
      <p className='font-medium text-amber-200'>Test mode: no real money is charged</p>
      <p className='mt-1'>
        Choose <span className='font-medium text-amber-100'>Netbanking</span>, pick any bank, then click <span className='font-medium text-amber-100'>Success</span> on Razorpay&apos;s demo bank page.
        Indian test cards from{' '}
        <a href='https://razorpay.com/docs/payments/payments/test-card-details/' target='_blank' rel='noreferrer' className='underline underline-offset-2 hover:text-amber-100'>Razorpay&apos;s docs</a>{' '}
        also work. International cards are declined unless they&apos;re enabled in your Razorpay dashboard.
      </p>
    </div>
  </div>
);

const Pricing = () => {
  const { user, showLogin, credit, setCredit, backendUrl, loadCreditsData, handleRequestError, token, openAuth } = useContext(AppContext);
  const [payingPlan, setPayingPlan] = useState(null);     // plan whose checkout is opening or open
  const [pendingPlan, setPendingPlan] = useState(null);   // plan picked before signing in
  const [verifying, setVerifying] = useState(false);
  const [purchase, setPurchase] = useState(null);         // { plan, creditBalance } once credits are added
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const paymentFailedRef = useRef(false);
  const startCreatingRef = useRef(null);

  // Warm up the checkout script and logo so the first click opens Razorpay straight away
  useEffect(() => {
    loadRazorpay().catch(() => {});
    getCheckoutLogo();
  }, []);

  const verifyPayment = async (response, plan) => {
    setVerifying(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/user/verify-razor', response, {
        headers: {
          token: token
        }
      })

      if (data.success) {
        if (typeof data.creditBalance === 'number') setCredit(data.creditBalance);
        else loadCreditsData();
        setPurchase({ plan, creditBalance: data.creditBalance });
        setPurchaseOpen(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (isAuthError(error)) {
        handleRequestError(error);
      } else {
        // The customer may have been charged, so give them something to quote to support
        toast.error("We couldn't confirm your payment", {
          description: `${getErrorMessage(error)} Payment ID: ${response.razorpay_payment_id}. If credits don't appear, contact support with this ID.`,
          duration: Infinity,
        });
      }
    } finally {
      setVerifying(false);
      setPayingPlan(null);
    }
  }

  const startCheckout = async (plan) => {
    setPayingPlan(plan.id);
    paymentFailedRef.current = false;

    try {
      const [Razorpay, image, { data }] = await Promise.all([
        loadRazorpay(),
        getCheckoutLogo(),
        axios.post(backendUrl + '/api/user/pay-razor', { planId: plan.id }, {
          headers: {
            token: token
          }
        }),
      ]);

      if (!data.success) {
        toast.error(data.message);
        setPayingPlan(null);
        return;
      }

      const rzp = new Razorpay({
        key: RAZORPAY_KEY,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Imagify',
        description: `${plan.id} plan · ${plan.credits.toLocaleString()} credits`,
        image,
        order_id: data.order.id,
        prefill: { name: data.user?.name, email: data.user?.email },
        notes: { plan: plan.id },
        theme: { color: '#a855f7' },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setPayingPlan(null);
            // After a failure the reason was already shown; only a plain close needs this
            if (!paymentFailedRef.current) {
              toast('Checkout closed', { description: 'No payment was made.' });
            }
          },
        },
        handler: (response) => verifyPayment(response, plan),
      });

      rzp.on('payment.failed', ({ error }) => {
        paymentFailedRef.current = true;
        toast.error('Payment failed', {
          description: error?.description || 'Please try again or use another payment method.',
        });
      });

      rzp.open();
    } catch (error) {
      setPayingPlan(null);
      if (axios.isAxiosError(error)) {
        handleRequestError(error);
      } else {
        toast.error("Couldn't open the payment window", { description: 'Check your connection and try again.' });
      }
    }
  }

  const onBuy = (plan) => {
    if (!user) {
      setPendingPlan(plan);
      openAuth('Sign Up');
      return;
    }
    startCheckout(plan);
  }

  // Continue to checkout once the user signs in; forget the choice if they close the dialog instead
  useEffect(() => {
    if (!pendingPlan) return;
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingPlan(null);
      startCheckout(pendingPlan);
    } else if (!showLogin) {
      setPendingPlan(null);
    }
  }, [user, showLogin, pendingPlan]);

  const busy = payingPlan !== null || verifying;

  return (
    <section className='py-16 sm:py-24'>
      <m.div {...fadeUp}>
        <SectionHeading
          as='h1'
          eyebrow='Pricing'
          title={<>Buy <span className='font-serif font-normal italic text-gradient pr-1'>credits</span></>}
          subtitle='One-time payments, no subscription. Credits never expire.'
        />
        {user && credit !== false &&
          <p className='mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Coins className='size-4 text-amber-300' /> Your balance: <span className='font-medium text-white'>{credit} credits</span>
          </p>
        }
      </m.div>

      {RAZORPAY_TEST_MODE && <TestModeNotice />}

      <div className='mx-auto mt-16 grid max-w-5xl items-center gap-6 md:grid-cols-3'>
        {plans.map((item, index) => (
          <m.div key={item.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.1 }}>
            <Card className={cn('relative gap-0 overflow-visible p-8', item.popular ? 'gradient-border bg-zinc-950 shadow-2xl shadow-fuchsia-950/50 ring-0 md:py-12' : '')}>
              {item.popular && (
                <>
                  <div aria-hidden className='absolute inset-x-0 top-0 h-32 rounded-t-xl bg-linear-to-b from-fuchsia-500/10 to-transparent' />
                  <Badge className='absolute -top-3 left-1/2 h-6 -translate-x-1/2 bg-linear-to-r from-violet-500 to-fuchsia-500 px-3 text-white shadow-lg shadow-fuchsia-500/30'>Most popular</Badge>
                </>
              )}

              <h2 className='relative text-lg font-medium text-white'>{item.id}</h2>
              <p className='relative mt-1 text-sm text-muted-foreground'>{item.desc}</p>

              <p className='relative mt-8 flex items-baseline gap-1.5'>
                <span className='text-5xl font-semibold tracking-tight text-white'>{formatPrice(item.price)}</span>
                <span className='text-sm text-muted-foreground'>one-time</span>
              </p>

              <ul className='relative mt-8 space-y-3 text-sm text-zinc-300'>
                {[
                  `${item.credits.toLocaleString()} image credits`,
                  `${formatPrice(item.price / item.credits, { decimals: 2 })} per image`,
                  'High-resolution PNG downloads',
                  'Credits never expire',
                ].map((feature) => (
                  <li key={feature} className='flex items-center gap-3'>
                    <Check className='size-4 shrink-0 text-fuchsia-300' />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                size='xl'
                variant={item.popular ? 'default' : 'outline'}
                disabled={busy}
                onClick={() => onBuy(item)}
                className='relative mt-10 w-full rounded-full'
              >
                {payingPlan === item.id && <LoaderCircle className='animate-spin' />}
                {payingPlan === item.id
                  ? 'Opening checkout…'
                  : `Buy for ${formatPrice(item.price)}`}
              </Button>
            </Card>
          </m.div>
        ))}
      </div>

      <p className='mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
        <ShieldCheck className='size-4' /> Secure payments powered by Razorpay
      </p>

      <m.div {...fadeUp} className='mx-auto mt-24 max-w-2xl'>
        <h2 className='text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl'>Questions</h2>
        <Accordion type='single' collapsible className='mt-8'>
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q} className='border-white/10'>
              <AccordionTrigger className='py-5 text-base hover:no-underline'>{faq.q}</AccordionTrigger>
              <AccordionContent className='text-muted-foreground'>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </m.div>

      {/* Shown between Razorpay closing and the backend confirming; can't be dismissed */}
      <Dialog open={verifying}>
        <DialogContent showCloseButton={false} onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()} className='gap-0 rounded-2xl p-8 text-center sm:max-w-sm'>
          <LoaderCircle className='mx-auto size-8 animate-spin text-fuchsia-300' />
          <DialogHeader className='mt-4 items-center'>
            <DialogTitle className='text-lg'>Confirming your payment</DialogTitle>
            <DialogDescription>This takes a few seconds. Please keep this page open.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
        <DialogContent
          className='gradient-border gap-0 rounded-2xl bg-zinc-950 p-8 text-center ring-0 sm:max-w-sm'
          onOpenAutoFocus={(e) => { e.preventDefault(); startCreatingRef.current?.focus(); }}
        >
          <span className='mx-auto grid size-12 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10'>
            <CircleCheck className='size-6 text-emerald-300' />
          </span>
          <DialogHeader className='mt-4 items-center'>
            <DialogTitle className='text-xl'>Payment successful</DialogTitle>
            <DialogDescription>
              {purchase && `${purchase.plan.credits.toLocaleString()} credits were added to your account.`}
            </DialogDescription>
          </DialogHeader>
          {typeof purchase?.creditBalance === 'number' &&
            <p className='mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 py-3 text-sm text-muted-foreground'>
              <Coins className='size-4 text-amber-300' /> New balance: <span className='font-medium text-white'>{purchase.creditBalance.toLocaleString()} credits</span>
            </p>
          }
          <Button asChild size='xl' className='mt-6 w-full rounded-full'>
            <Link ref={startCreatingRef} href='/result' onClick={() => setPurchaseOpen(false)}><WandSparkles /> Start creating</Link>
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  )
};

export default Pricing;
