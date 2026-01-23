import { Button } from "@workspace/ui/components/button"
import { BadgeCheck } from "lucide-react"
import { Logo } from "./logo"

export function Hero() {
  return (
    <div className="flex flex-col h-full min-h-[500px] p-8">
      <Logo />
      <div className="flex flex-col gap-6 flex-1 justify-center">
        <div>
          <h2 className='text-2xl font-bold'>Record Your Meetings With One Click</h2>
          <p className='text-muted-foreground text-sm mt-2'>
            Google Meet and Zoom supported.
          </p>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <BadgeCheck className="text-primary" />
            <p>Start recording only when you choose.</p>
          </div>
          <div className='flex items-center gap-2'>
            <BadgeCheck className="text-primary" />
            <p>Secure cloud storage.</p>
          </div>
          <div className='flex items-center gap-2'>
            <BadgeCheck className="text-primary" />
            <p>Auto transcripts.</p>
          </div>
        </div>
        <Button className="w-full cursor-pointer" onClick={() => chrome.tabs.create({ url: `${process.env.PLASMO_PUBLIC_BACKEND_URL}/login` })}>Get Started</Button>
      </div>
    </div>
  )
}

