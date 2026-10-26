'use client';

import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const navLinks = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Studio', href: '/result' },
  { label: 'Pricing', href: '/buy' },
];

const AuthSkeleton = () => (
  <div className='flex items-center gap-2'>
    <Skeleton className='hidden h-9 w-28 rounded-full sm:block' />
    <Skeleton className='size-9 rounded-full' />
  </div>
);

// Split out of the initial bundle: the account menu only matters when signed in, the sheet only on mobile
const AccountMenu = dynamic(() => import('@/components/AccountMenu'), { ssr: false, loading: AuthSkeleton });
const MobileMenu = dynamic(() => import('@/components/MobileMenu'), {
  ssr: false,
  loading: () => <span aria-hidden className='size-9 md:hidden' />,
});

const Navbar = () => {
  const { user, authLoading, openAuth } = useContext(AppContext);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn('sticky top-0 z-40 border-b transition-colors duration-300', scrolled ? 'border-white/10 bg-background/70 backdrop-blur-xl' : 'border-transparent')}>
      <nav className='mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
        <Logo />

        <div className='hidden items-center gap-1 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn('rounded-full px-3 py-1.5 text-sm transition', pathname === link.href ? 'bg-white/5 text-white' : 'text-muted-foreground hover:text-white')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-2'>
          {authLoading ?
            <AuthSkeleton />
          : user ?
            <AccountMenu />
          :
            <>
              <Button variant='ghost' className='hidden h-9 rounded-full px-4 sm:inline-flex' onClick={() => openAuth('Login')}>Sign in</Button>
              <Button className='h-9 rounded-full px-4' onClick={() => openAuth('Sign Up', '/result')}>Get started</Button>
            </>
          }

          <MobileMenu links={navLinks} />
        </div>
      </nav>
    </header>
  )
};

export default Navbar;
