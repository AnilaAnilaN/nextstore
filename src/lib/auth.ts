import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import User from '@/models/User';

// Extend the built-in session and user types
declare module 'next-auth' {
    interface User {
        id: string;
        role?: string;
    }

    interface Session {
        user: {
            id: string;
            email?: string | null;
            name?: string | null;
            role?: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                await connectDB();

                // Try admin first
                const admin = await Admin.findOne({ email: credentials.email });
                if (admin) {
                    const isValid = await admin.comparePassword(credentials.password);
                    if (!isValid) throw new Error('Invalid credentials');

                    return {
                        id: admin._id.toString(),
                        email: admin.email,
                        name: admin.name,
                        role: admin.role || 'admin',
                    } as NextAuthUser;
                }

                // Try regular user
                const user = await User.findOne({ email: credentials.email }).select('+password');
                if (!user) {
                    throw new Error('Invalid credentials');
                }

                const isUserValid = await user.comparePassword(credentials.password);
                if (!isUserValid) {
                    throw new Error('Invalid credentials');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: 'user',
                } as NextAuthUser;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
