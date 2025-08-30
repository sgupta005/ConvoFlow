'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
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

    if (result.success && result.data)
      router.push(`/workspace/${result.data.id}/dashboard`);
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter workspace name"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be the name of your workspace.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          Create workspace
        </Button>
      </form>
    </Form>
  );
}
