import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentAccount, getStoredAccount } from "../services/api";
import type { AccountUser } from "../services/api";

type AuthContextValue = {
  user: AccountUser | null;
  setUser: (user: AccountUser | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentAccount()
      .then((account) => {
        if (active) {
          setUser(account ?? getStoredAccount());
        }
      })
      .catch(() => {
        if (active) {
          setUser(getStoredAccount());
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}