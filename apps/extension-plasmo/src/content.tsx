import { Login } from '@/features/auth/login';
import { Signup } from '@/features/auth/signup';
import { Toaster } from '@workspace/ui/components/sonner';
import cssText from 'data-text:~style.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useState } from 'react';

import { Home } from './home';
import { PageControls } from './popup';

export const config: PlasmoCSConfig = {
  matches: ['https://www.plasmo.com/*'],
};

export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

const PlasmoOverlay = () => {
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
};

export default PlasmoOverlay;
