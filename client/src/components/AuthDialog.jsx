'use client';

import { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Eye, EyeOff, LoaderCircle, Lock, Mail, Sparkles, User } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { getErrorMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Field = ({ id, label, icon: Icon, hint, children, ...props }) => (
  <div className='grid gap-2'>
    <Label htmlFor={id} className='text-zinc-300'>{label}</Label>
    <div className='relative'>
      <Icon className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
      <Input id={id} className='h-11 rounded-xl pl-10 pr-11' required {...props} />
      {children}
    </div>
    {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
  </div>
);

const AuthDialog = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showLogin, setShowLogin, authMode: state, setAuthMode: setState, backendUrl, completeAuth } = useContext(AppContext);
  const isLogin = state === 'Login';

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = isLogin
        ? await axios.post(backendUrl + '/api/user/login', { email, password })
        : await axios.post(backendUrl + '/api/user/register', { name, email, password });

      if (data.success) {
        completeAuth(data);
        setPassword('');
        toast.success(isLogin ? `Welcome back, ${data.user.name}!` : 'Account created! You have 5 free credits.');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setLoading(false);
  }

  return (
    <Dialog open={showLogin} onOpenChange={setShowLogin}>
      <DialogContent className='gradient-border gap-0 rounded-2xl bg-zinc-950 p-8 ring-0 shadow-2xl shadow-fuchsia-950/40 sm:max-w-md'>
        <DialogHeader className='items-center text-center'>
          <span className='grid size-11 place-items-center rounded-xl bg-linear-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-500/25'>
            <Sparkles className='size-5 text-white' />
          </span>
          <DialogTitle className='mt-3 text-2xl font-semibold tracking-tight'>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </DialogTitle>
          <DialogDescription>
            {isLogin ? 'Sign in to your account.' : 'New accounts get 5 free credits. No card needed.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={state} onValueChange={setState} className='mt-6'>
          <TabsList className='h-10 w-full rounded-xl group-data-horizontal/tabs:h-10'>
            <TabsTrigger value='Login' className='rounded-lg'>Sign in</TabsTrigger>
            <TabsTrigger value='Sign Up' className='rounded-lg'>Sign up</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={onSubmitHandler} className='mt-6 grid gap-4'>
          {!isLogin &&
            <Field id='name' label='Full name' icon={User} onChange={e => setName(e.target.value)} value={name} type='text' placeholder='Jane Doe' autoComplete='name' />
          }
          <Field id='email' label='Email' icon={Mail} onChange={e => setEmail(e.target.value)} value={email} type='email' placeholder='you@example.com' autoComplete='email' />
          <Field
            id='password'
            label='Password'
            icon={Lock}
            onChange={e => setPassword(e.target.value)}
            value={password}
            type={showPassword ? 'text' : 'password'}
            placeholder={isLogin ? 'Your password' : 'Create a password'}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            minLength={isLogin ? undefined : 8}
            hint={isLogin ? null : 'At least 8 characters.'}
          >
            <Button type='button' variant='ghost' size='icon-sm' onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'} className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground'>
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </Field>

          <Button type='submit' size='xl' disabled={loading} className='mt-2 w-full rounded-xl'>
            {loading && <LoaderCircle className='animate-spin' />}
            {isLogin ? 'Sign in' : 'Create account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
};

export default AuthDialog;
