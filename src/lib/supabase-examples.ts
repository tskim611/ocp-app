/**
 * SUPABASE CLIENT USAGE EXAMPLES
 *
 * This file contains examples of how to use Supabase clients
 * in different Next.js contexts. Remove this file in production.
 */

// ============================================
// CLIENT COMPONENTS (use client directive)
// ============================================

/*
'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('your_table')
        .select('*');

      if (error) {
        console.error('Error:', error);
      } else {
        setData(data);
      }
    }

    fetchData();
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}
*/

// ============================================
// SERVER COMPONENTS
// ============================================

/*
import { createServerClient } from '@/lib/supabase-server';

export default async function ServerComponent() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('your_table')
    .select('*');

  if (error) {
    console.error('Error:', error);
    return <div>Error loading data</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
}
*/

// ============================================
// SERVER ACTIONS
// ============================================

/*
'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createItem(formData: FormData) {
  const supabase = await createServerClient();

  const name = formData.get('name') as string;

  const { data, error } = await supabase
    .from('your_table')
    .insert({ name })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/your-path');
  return data;
}
*/

// ============================================
// ROUTE HANDLERS (API Routes)
// ============================================

/*
import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('your_table')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from('your_table')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
*/

// ============================================
// AUTHENTICATION EXAMPLES
// ============================================

/*
// CLIENT-SIDE AUTH (Login)
'use client';

import { supabase } from '@/lib/supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error:', error);
    return null;
  }

  return data;
}

// CLIENT-SIDE AUTH (Sign Up)
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error:', error);
    return null;
  }

  return data;
}

// CLIENT-SIDE AUTH (Sign Out)
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error:', error);
  }
}

// SERVER-SIDE AUTH (Get User)
import { createServerClient } from '@/lib/supabase-server';

export async function getUser() {
  const supabase = await createServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error:', error);
    return null;
  }

  return user;
}
*/

// ============================================
// REAL-TIME SUBSCRIPTIONS (Client-side only)
// ============================================

/*
'use client';

import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export function useRealtimeSubscription() {
  useEffect(() => {
    const channel = supabase
      .channel('your_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'your_table' },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
*/

export {};
