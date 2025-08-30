'use client';

import { Button } from '@workspace/ui/components/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export function LoginWithGoogle() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => signIn('google')}
    >
      <Image src="/google-logo.png" alt="Google logo" width={20} height={20} />
      Login with Google
    </Button>
  );
}
