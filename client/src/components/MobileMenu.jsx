'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, LogOut, Menu } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const MenuButton = (props) => (
  <Button variant='ghost' size='icon-lg' className='rounded-full md:hidden' aria-label='Open menu' {...props}>
    <Menu />
  </Button>
);

const MobileMenu = ({ links }) => {
  const { user, openAuth, logout, credit } = useContext(AppContext);
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuButton />
      </SheetTrigger>
      <SheetContent side='right' className='w-80 border-white/10'>
        <SheetHeader>
          <SheetTitle><Logo /></SheetTitle>
          <SheetDescription className='sr-only'>Site navigation</SheetDescription>
        </SheetHeader>
        <div className='grid gap-1 px-4'>
          {links.map((link) => (
            <SheetClose asChild key={link.label}>
              <Link href={link.href} className={cn('rounded-lg px-3 py-2.5 text-base transition hover:bg-white/5', pathname === link.href ? 'bg-white/5 text-white' : 'text-zinc-300')}>
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </div>
        <Separator className='mx-4 w-auto' />
        <div className='grid gap-2 px-4'>
          {user ?
            <>
              <SheetClose asChild>
                <Button asChild variant='outline' className='h-11 w-full justify-start rounded-xl'>
                  <Link href='/buy'>
                    <Coins className='text-amber-300' />
                    {credit === false ? '…' : credit} <span className='text-muted-foreground'>credits · Buy more</span>
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant='ghost' className='h-11 w-full justify-start rounded-xl text-destructive hover:text-destructive' onClick={logout}>
                  <LogOut /> Log out
                </Button>
              </SheetClose>
            </>
          :
            <>
              <SheetClose asChild>
                <Button size='xl' className='w-full rounded-xl' onClick={() => openAuth('Sign Up', '/result')}>Get started free</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant='outline' size='xl' className='w-full rounded-xl' onClick={() => openAuth('Login')}>Sign in</Button>
              </SheetClose>
            </>
          }
        </div>
      </SheetContent>
    </Sheet>
  )
};

export default MobileMenu;
