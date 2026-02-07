import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@workspace/ui/components/sonner";

export function useGenerate(meetingId: string) {
  const [isGenerating, setIsGenerating] = useState(false);

  const router = useRouter();

  const triggerGenerate = useCallback(async function () {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/meeting/${meetingId}/generate`, { method: 'POST' });
      const data = await res.json();
      if (!data.error) {
        router.refresh();
      } else {
        toast.error(data.error);
      }

    } catch (error) {
      console.error('Error generating:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [meetingId, router]);

  return { isGenerating, triggerGenerate };
}