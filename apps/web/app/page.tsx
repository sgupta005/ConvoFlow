import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserDefaultWorkspace } from '@workspace/db';
import { createWorkspaceAction } from '@/features/workspace/actions';
import { headers } from 'next/headers';

export default async function AuthRedirect() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect('/login');
    }

    // Check if user has a default workspace
    let defaultWorkspace = await getUserDefaultWorkspace(session.user.id);

    // Create default workspace if it doesn't exist (first-time user)
    if (!defaultWorkspace) {
        const result = await createWorkspaceAction({
            userId: session.user.id,
            name: 'My Workspace',
            isDefault: true,
        });

        if (result.success && result.data) {
            defaultWorkspace = result.data;
        } else {
            console.error('Failed to create default workspace');
            redirect('/login');
        }
    }

    // Redirect to the workspace dashboard
    if (defaultWorkspace) {
        redirect(`/workspace/${defaultWorkspace.id}/dashboard`);
    }
}
