'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coins, LogOut, WandSparkles } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LOW_CREDITS = 2;

// Signed-in part of the navbar. Loaded lazily, so logged-out visitors never download the menu/tooltip code.
const AccountMenu = () => {
  const { user, logout, credit } = useContext(AppContext);
  const router = useRouter();
  const low = credit !== false && credit <= LOW_CREDITS;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant='outline' className={cn('hidden h-9 rounded-full px-3.5 sm:inline-flex', low && 'border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/15')}>
            <Link href='/buy'>
              <Coins className='text-amber-300' />
              {credit === false ? <Skeleton className='h-3.5 w-5' /> : credit}
              <span className='text-muted-foreground'>credits</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{low ? 'Running low on credits' : 'Buy more credits'}</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label='Account menu' className='rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring'>
            <Avatar className='size-9'>
              <AvatarFallback className='bg-linear-to-br from-violet-500 to-fuchsia-500 font-semibold uppercase text-white'>
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuLabel className='font-normal'>
            <p className='text-xs text-muted-foreground'>Signed in as</p>
            <p className='truncate text-sm font-medium text-foreground'>{user.name}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => router.push('/result')}>
              <WandSparkles /> Open studio
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push('/buy')}>
              <Coins /> Buy credits
              <span className='ml-auto text-xs text-muted-foreground'>{credit === false ? '' : credit}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onSelect={logout}>
            <LogOut /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
};

export default AccountMenu;
