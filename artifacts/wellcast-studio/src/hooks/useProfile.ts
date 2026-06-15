import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { Profile } from "@/lib/subscription";

interface UseProfileResult {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfile(): UseProfileResult {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("Session:", session?.user?.id);

    if (sessionError || !session?.user?.id) {
      console.log("No session found");
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    console.log("Profile result:", data);
    console.log("Profile error:", fetchError);

    if (fetchError || !data) {
      console.error("Profile fetch failed:", fetchError);
      // Return permissive default so user isn't blocked
      setProfile({
        id: session.user.id,
        email: session.user.email ?? undefined,
        subscription_status: "trialing",
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } else {
      setProfile(data as Profile);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}
