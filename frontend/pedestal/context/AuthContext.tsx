import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextProps {
    session: any | null;
    profile: any | null;
    loading: boolean;
    profileLoading: boolean;
    onboardingCompleted: boolean;
    signIn: (email: string, password: string) => Promise<{ error?: string }>;
    signUp: (email: string, password: string, displayName?: string) => Promise<{ data?: any, error?: string }>;
    signInWithGoogle: () => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);

    const fetchProfile = async (uid: string) => {
        setProfileLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('auth_uid', uid)
                .maybeSingle();

            if (data) {
                setProfile(data);
            } else if (error) {
                console.warn('Error fetching profile:', error);
            }
        } catch (e) {
            console.error('Auth Profile Fetch Error:', e);
        } finally {
            setProfileLoading(false);
        }
    };

    // Initialize session from Supabase
    useEffect(() => {
        const init = async () => {
            const { data: { session: storedSession } } = await supabase.auth.getSession();
            setSession(storedSession);
            if (storedSession?.user?.id) {
                await fetchProfile(storedSession.user.id);
            }
            setLoading(false);
        };
        init();
    }, []);

    // Listen for auth state changes
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            setSession(newSession);
            if (newSession?.user?.id) {
                await fetchProfile(newSession.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message };
    };

    const signUp = async (email: string, password: string, displayName?: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                }
            }
        });

        if (data?.user && !error) {
            // Also ensure profile exists with the name
            try {
                await supabase.from('user_profiles').upsert({
                    auth_uid: data.user.id,
                    display_name: displayName || email.split('@')[0],
                    email: email,
                }, { onConflict: 'auth_uid' });
            } catch (e) {
                console.warn('Silent profile creation failed on signup:', e);
            }
        }

        return { data, error: error?.message };
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        return { error: error?.message };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const refreshProfile = async () => {
        if (session?.user?.id) {
            await fetchProfile(session.user.id);
        }
    };

    const onboardingCompleted = !!profile?.onboarding_completed;

    return (
        <AuthContext.Provider value={{
            session,
            profile,
            loading,
            profileLoading,
            onboardingCompleted,
            signIn,
            signUp,
            signInWithGoogle,
            signOut,
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
