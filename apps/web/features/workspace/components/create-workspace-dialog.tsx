'use client';

import * as React from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Dialog, DialogHeader, DialogContent, DialogClose, DialogFooter, DialogDescription, DialogTitle } from '@workspace/ui/components/dialog';
import { Field, FieldError, FieldLabel, FieldGroup } from '@workspace/ui/components/field';
import { Spinner } from '@workspace/ui/components/spinner';
import { toast } from '@workspace/ui/components/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import {
  createWorkspaceSchema,
  type CreateWorkspaceSchema,
} from '@workspace/contracts';
import { createWorkspaceAction } from '../actions';

export function CreateWorkspaceDialog({ userId, showDialog, setShowDialog }: {
  userId: string,
  showDialog: boolean,
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {

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
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          id="create-workspace-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Provide a name for your new workspace. Click create when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3">
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
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>{isLoading ? <Spinner /> : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

