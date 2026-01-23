import "@/style.css";

import { Spinner } from '@workspace/ui/components/spinner';
import { authClient } from './lib/auth-client';
import { Hero } from './components/hero';
import { Home } from "./components/home";
import { useTheme } from './hooks/use-theme';

function IndexPopup() {
  const session = authClient.useSession();
  const { isLoading: themeLoading } = useTheme();

  if (session.isPending || themeLoading) {
    return (
      <div className="min-w-[400px] w-fit h-fit min-h-[500px] overflow-hidden bg-background text-foreground">
        <Spinner className="mx-auto mt-[50%] size-10" />
      </div>
    );
  }

  return (
    <div className="min-w-[400px] w-fit h-fit min-h-[500px] overflow-hidden bg-background text-foreground">
      {!session.data ? <Hero /> : <Home session={session.data} />}
    </div>
  );
}

export default IndexPopup;

