import '@/style.css';

import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { toast, Toaster } from "@workspace/ui/components/sonner"
import { useState } from 'react';

import { Login } from './features/auth/login';
import { Signup } from './features/auth/signup';
import { Home } from './home';
import { authClient } from './lib/auth-client';

function IndexPopup() {
  const [page, setPage] = useState<'home' | 'sign-in' | 'sign-up'>('home');

  return (
    <div className="min-w-[400px] w-fit h-fit min-h-[500px] overflow-hidden dark bg-background text-foreground">
      <Toaster />
      {page === 'home' && <Home setPage={setPage} />}
      {page === 'sign-in' && <Login setPage={setPage} />}
      {page === 'sign-up' && <Signup setPage={setPage} />}
      <PageControls setPage={setPage} page={page} />
    </div>
  );
}

export default IndexPopup;

export function PageControls({
  setPage,
  page,
}: {
  setPage: (page: 'home' | 'sign-in' | 'sign-up') => void;
  page: 'home' | 'sign-in' | 'sign-up';
}) {
  return (
    <div className="flex flex-col w-full gap-5 px-10 mt-5 h-fit">
      <Separator />
      <div className="flex justify-center gap-4">
        {page === 'home' && (
          <>
            <Button onClick={() => setPage('sign-in')}>Sign-in</Button>
            <Button onClick={() => setPage('sign-up')}>Sign-Up</Button>
            <Button
              onClick={() => {
                authClient.signOut().then((value) => {
                  if (value.error) {
                    toast.error(value.error.message)
                  } else {
                    toast.success("You've been signed out")
                  }
                });
              }}
            >
              Sign-Out
            </Button>
          </>
        )}
        {page === 'sign-in' && (
          <>
            <Button onClick={() => setPage('sign-up')}>Sign-Up</Button>
            <Button onClick={() => setPage('home')}>Home</Button>
          </>
        )}
        {page === 'sign-up' && (
          <>
            <Button onClick={() => setPage('sign-in')}>Sign-in</Button>
            <Button onClick={() => setPage('home')}>Home</Button>
          </>
        )}
      </div>
    </div>
  );
}
