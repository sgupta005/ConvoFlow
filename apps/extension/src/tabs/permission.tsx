import "@/style.css";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Mic, CheckCircle, XCircle } from "lucide-react";
import { Logo } from "@/components/logo";

function PermissionPage() {
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied'>('idle');

  async function requestPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setStatus('granted');

      // Close tab after a short delay
      setTimeout(() => {
        window.close();
      }, 2000);
    } catch (error) {
      setStatus('denied');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute top-8 left-12">
        <Logo />
      </div>
      <div className="max-w-md w-full p-8 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <Mic className="size-8" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Microphone Permission Required
          </h1>
          <p className="text-muted-foreground">
            To record audio from your meetings, ConvoFlow needs permission to access your microphone.
          </p>
        </div>

        {status === 'idle' && (
          <Button onClick={requestPermission} className="w-full cursor-pointer font-semibold" size="lg">
            Allow Microphone Access
          </Button>
        )}

        {status === 'granted' && (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>Permission granted! You can close this tab.</span>
          </div>
        )}

        {status === 'denied' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              <span>Permission denied. Please try again.</span>
            </div>
            <Button onClick={requestPermission} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Your privacy is important. Audio is only recorded when you explicitly start a recording session.
        </p>
      </div>
    </div>
  );
}

export default PermissionPage;
