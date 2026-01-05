'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { toast } from '@workspace/ui/components/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  createWorkspaceSchema,
  type CreateWorkspaceSchema,
} from '@workspace/contracts';
import { createWorkspaceAction } from '../actions';

export function CreateWorkspaceForm({ userId }: { userId: string }) {
  const router = useRouter();

  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      image: '',
      userId,
    },
  });

  async function onSubmit(values: CreateWorkspaceSchema) {
    const result = await createWorkspaceAction(values);

    if (result.success && result.data) {
      toast.success('Workspace created successfully!');
      router.push(`/workspace/${result.data.id}/dashboard`);
    } else {
      toast.error(result.error);
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <form
      id="create-workspace-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="create-workspace-form-name">Name</FieldLabel>
            <Input
              {...field}
              id="create-workspace-form-name"
              aria-invalid={fieldState.invalid}
              placeholder="Workspace name"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        Create workspace
      </Button>
    </form>
  );
}
