"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DashboardPermissions } from "@/types/permissions";
import { getMyPermissions } from "@/api/permissionsApi";

type PermissionsContextType = {
  permissions: DashboardPermissions | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissions] = useState<DashboardPermissions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPerms = async () => {
    setLoading(true);
    const data = await getMyPermissions();
    setPermissions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPerms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissions, loading, refresh: fetchPerms }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
};

