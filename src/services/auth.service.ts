import { supabase } from '@/lib/supabase';
import { User } from '@/types/flashcard';

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export async function signup({ email, password, displayName }: SignupData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) throw error;

  // Create user profile in profiles table
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        display_name: displayName,
        study_streak: 0,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Don't throw - user is created, profile can be updated later
    }
  }

  return data;
}

/**
 * Sign in a user
 */
export async function login({ email, password }: LoginData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the current user
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) return null;

  // Fetch user profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    // Return basic user info if profile fetch fails
    return {
      id: authUser.id,
      email: authUser.email || '',
      displayName: authUser.user_metadata?.display_name || 'User',
      studyStreak: 0,
      createdAt: new Date(authUser.created_at),
    };
  }

  return {
    id: profile.id,
    email: profile.email,
    displayName: profile.display_name,
    avatar: profile.avatar_url,
    bio: profile.bio,
    studyStreak: profile.study_streak || 0,
    createdAt: new Date(profile.created_at),
  };
}

/**
 * Update user profile
 */
export async function updateProfile(updates: Partial<User>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: updates.displayName,
      avatar_url: updates.avatar,
      bio: updates.bio,
      study_streak: updates.studyStreak,
    })
    .eq('id', user.id);

  if (error) throw error;
}




