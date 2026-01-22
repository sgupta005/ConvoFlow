import { MoreVertical, LogOut, SquareTerminal, Mic, MicOff, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@workspace/ui/components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";

import type { Session } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";

import { Logo } from "./logo"
import { useRecording } from "@/hooks/use-recording";


export function Home({ session }: { session: Session }) {
  const {
    isRecording,
    isLoading,
    error,
    canRecord,
    startRecording,
    stopRecording,
    clearError,
    refreshTabStatus,
  } = useRecording();

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6">
      <div className="flex items-center justify-between mb-6">
        <Logo />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={session.user?.image || undefined} />
                <AvatarFallback>
                  {session.user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{session.user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => chrome.tabs.create({ url: 'http://localhost:3000/dashboard' })}>
              <SquareTerminal />
              <span>Open Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={async () => await authClient.signOut()}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Recording Controls */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!canRecord && !isRecording && (
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">No meeting detected</p>
              <p className="text-sm mt-1">
                Open a Google Meet or Zoom meeting tab to start recording.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={refreshTabStatus}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check again
            </Button>
          </div>
        )}

        {(canRecord || isRecording) && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                className={`w-24 h-24 rounded-full transition-all duration-300 ${isRecording ? 'animate-pulse' : ''
                  }`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
              >
                {isRecording ? (
                  <MicOff className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </Button>
              {isRecording && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
              )}
            </div>

            <div className="text-center">
              <p className="text-lg font-medium">
                {isLoading
                  ? 'Please wait...'
                  : isRecording
                    ? 'Recording in progress'
                    : 'Ready to record'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isRecording
                  ? 'Click to stop recording'
                  : 'Click to start recording your meeting'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span
            className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : canRecord ? 'bg-green-500' : 'bg-yellow-500'
              }`}
          />
          <span>
            {isRecording
              ? 'Recording'
              : canRecord
                ? 'Ready'
                : 'Waiting for meeting'}
          </span>
        </div>
      </div>
    </div>
  );
}
