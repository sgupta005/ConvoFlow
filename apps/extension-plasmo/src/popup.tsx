import "@/style.css";

import { Spinner } from '@workspace/ui/components/spinner';
import { authClient } from './lib/auth-client';
import { Hero } from './components/hero';
import { Home } from "./components/home";

function IndexPopup() {
  const session = authClient.useSession();

  return (
    <div className="min-w-[400px] w-fit h-fit min-h-[500px] overflow-hidden bg-background text-foreground">
      {session.isPending ? <Spinner className="mx-auto mt-[50%] size-10" /> :
        !session.data ? <Hero /> :
          <Home session={session.data} />
      }
    </div>
  );
}

export default IndexPopup;

