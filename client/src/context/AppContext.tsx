"use client"
import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AppContextType, User } from "../types";
import { authService } from "@/app/page";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  
  async function fetchUser() {
    try {
     
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const { data } = await axios.get(`${authService}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
      setIsAuth(true);
      
    } catch (error) {
      console.log(error);
      setUser(null);
      setIsAuth(false);
      
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{ isAuth, loading, setIsAuth, setLoading, setUser, user }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be usedwithin appProvider");
  }
  return context;
};
