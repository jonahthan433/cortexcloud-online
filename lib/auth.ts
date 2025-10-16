import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma, getUserByEmail, createUser } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    // Temporarily disabled until OAuth credentials are configured
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   authorization: {
    //     params: {
    //       prompt: 'consent',
    //       access_type: 'offline',
    //       response_type: 'code',
    //       scope: 'openid email profile https://www.googleapis.com/auth/calendar',
    //     },
    //   },
    // }),
    
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),
    
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await getUserByEmail(credentials.email);

        if (!user) {
          throw new Error('User not found');
        }

        // Check if user has a password hash (credentials-based user)
        if (!user.password_hash) {
          throw new Error('Please sign in with OAuth provider');
        }

        // Verify password
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth providers are currently disabled
      // if (account?.provider === 'google' || account?.provider === 'github') {
      //   const existingUser = await getUserByEmail(user.email!);
      //   
      //   if (!existingUser) {
      //     // Create new user
      //     await createUser({
      //       email: user.email!,
      //       name: user.name || undefined,
      //     });
      //   }
      // }
      
      return true;
    },

    async session({ session, token }) {
      if (session?.user) {
        const dbUser = await getUserByEmail(session.user.email!);
        
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.subscriptionTier = dbUser.subscription_tier;
          session.user.trialStarted = dbUser.trial_started;
          session.user.trialExpiresAt = dbUser.trial_expires_at?.toISOString();
        }
      }
      
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      
      return token;
    },
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    newUser: '/dashboard',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: string;
      subscriptionTier: string;
      trialStarted: boolean;
      trialExpiresAt?: string;
    };
  }

  interface User {
    role?: string;
    subscriptionTier?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
  }
}


