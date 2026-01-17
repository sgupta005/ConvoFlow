'use client';

import { Button } from '@workspace/ui/components/button';
import { authClient } from '@/lib/auth-client';

export function LoginWithGoogle() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => authClient.signIn.social({ provider: 'google' })}
    >
      <img src="/google-logo.png" alt="Google logo" width={20} height={20} />
      Login with Google
    </Button>
  );
}
