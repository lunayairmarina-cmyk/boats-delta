import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Admin credentials from environment variables
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        if (username === adminUsername && password === adminPassword) {
            const cookieStore = await cookies();
            const isProduction = process.env.NODE_ENV === 'production';
            
            cookieStore.set('admin_session', 'true', {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Invalid request' }, 
            { status: 400 }
        );
    }
}
