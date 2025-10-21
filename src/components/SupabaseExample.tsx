'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

/**
 * Example component demonstrating Supabase client usage
 * This is a client component that fetches data from Supabase
 */
export default function SupabaseExample() {
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Simple health check - fetch auth session
        const { data, error: authError } = await supabase.auth.getSession();

        if (authError) {
          throw authError;
        }

        setConnected(true);
        setError(null);
      } catch (err) {
        console.error('Supabase connection error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to connect to Supabase'
        );
        setConnected(false);
      } finally {
        setLoading(false);
      }
    }

    checkConnection();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">
          Checking Supabase connection...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
          Supabase Connection Error
        </h3>
        <p className="text-red-600 dark:text-red-300 text-sm mb-2">{error}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Make sure you have set up your .env.local file with valid Supabase
          credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
      <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
        Supabase Connected
      </h3>
      <p className="text-green-600 dark:text-green-300 text-sm">
        Successfully connected to Supabase! You can now use the Supabase client
        to interact with your database.
      </p>
    </div>
  );
}
