import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getUserPrompts } from '@/lib/prompt-service';
import { getUserByEmail } from '@/lib/user-service';

export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const user = await getUserByEmail(session.user?.email || '');
        
        if (!user) {
            return new Response(JSON.stringify({ prompts: [] }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Get user prompts
        const prompts = await getUserPrompts(user.id!);
        
        return new Response(JSON.stringify({ prompts }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch prompts' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
} 