'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Field, FieldContent, FieldLabel } from '@workspace/ui/components/field';

interface ActionItemCardProps {
  actionItem: {
    id: string;
    text: string;
    isCompleted?: boolean;
  };
  index: number;
}

export function ActionItemCard({ actionItem, index }: ActionItemCardProps) {
  return (
    <div className="group relative">

      <div className="flex gap-4 py-4 transition-colors hover:bg-muted/30 rounded-lg px-3 -mx-3">
        <Field orientation='horizontal'>
          <Checkbox id={actionItem.id} />
          <FieldContent className='flex flex-row items-center justify-between'>
            <FieldLabel htmlFor={actionItem.id}>
              {actionItem.text}
            </FieldLabel>
            <Badge variant="outline" className="shrink-0 text-[10px] font-normal px-2 py-0 h-5">
              #{index + 1}
            </Badge>
          </FieldContent>
        </Field>
      </div>
    </div >
  );
}
