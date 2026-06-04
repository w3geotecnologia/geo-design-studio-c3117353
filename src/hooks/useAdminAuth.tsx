import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AdminAuthContextValue = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const checkIsAdmin = async (user: User | null): Promise<boolean> => {
  if (!user?.email) return false;
  const email = user.email.toLowerCase();
  const { data, error } = await supabase
    .from("admins")
    .select("id, email, user_id")
    .or(`user_id.eq.${user.id},email.eq.${email}`)
    .limit(1);
  if (error || !data || data.length === 0) return false;
  // vincula user_id se ainda não estiver vinculado
  const row = data[0];
  if (!row.user_id) {
    await supabase.from("admins").update({ user_id: user.id }).eq("id", row.id);
  }
  return true;
};

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const evaluate = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
    const ok = await checkIsAdmin(nextSession?.user ?? null);
    setIsAdmin(ok);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void evaluate(nextSession);
    });

    supabase.auth.getSession().then(({ data }) => {
      void evaluate(data.session);
    });

    return () => listener.subscription.unsubscribe();
  }, [evaluate]);

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) return { error: error.message };

    const ok = await checkIsAdmin(data.user);
    if (!ok) {
      await supabase.auth.signOut();
      return { error: "Usuário não autorizado como administrador." };
    }
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  const refreshAdmin = useCallback(async () => {
    const ok = await checkIsAdmin(user);
    setIsAdmin(ok);
  }, [user]);

  const value = useMemo(
    () => ({ user, session, isAdmin, isLoading, signIn, signOut, refreshAdmin }),
    [user, session, isAdmin, isLoading, refreshAdmin],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
};
