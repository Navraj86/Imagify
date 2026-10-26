'use client';

import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LazyMotion, domAnimation } from 'motion/react';
import { AppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Most visitors never open the sign-in dialog, so its code (dialog, tabs, form) loads on first use
const AuthDialog = dynamic(() => import('@/components/AuthDialog'), { ssr: false });

const App = ({ children }) => {
  const { showLogin } = useContext(AppContext);
  const [authRequested, setAuthRequested] = useState(false);

  // Keep the dialog mounted after the first open so its close animation still plays
  if (showLogin && !authRequested) {
    setAuthRequested(true);
  }

  // Fetch the dialog's code once the page is idle, so opening it later feels instant
  useEffect(() => {
    const prefetch = () => import('@/components/AuthDialog');
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(prefetch, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className='relative isolate flex min-h-screen flex-col overflow-x-clip'>
        {/* Ambient background: masked grid + soft color glows (gradients, not blur filters, so scrolling stays cheap) */}
        <div aria-hidden className='pointer-events-none fixed inset-0 -z-10'>
          <div className='absolute inset-0 bg-grid mask-[radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]' />
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-5%,rgb(124_58_237/0.22),transparent_70%),radial-gradient(circle_at_100%_55%,rgb(192_38_211/0.10),transparent_35%),radial-gradient(circle_at_0%_100%,rgb(245_158_11/0.06),transparent_35%)]' />
        </div>

        <Navbar />
        {authRequested && <AuthDialog />}
        <main className='mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6'>
          {children}
        </main>
        <Footer />
      </div>
    </LazyMotion>
  )
};

export default App;
