import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { getToken } from './authApi';
import { DashboardPermissions } from '@/types/permissions';

export const getMyPermissions = async (): Promise<DashboardPermissions | null> => {
  const token = getToken();

  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return null;
  }

  try {
    const res = await fetch(`${config.apiBaseUrl}/admin/me/permissions/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // 403 means no staff or no perms; surface a friendly message
      if (res.status === 403) {
        toast.error("You don’t have access to admin permissions.", { position: "bottom-right" });
        return null;
      }
      throw new Error("Failed to fetch permissions");
    }

    const data: DashboardPermissions = await res.json();
    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    toast.error(message, { position: "bottom-right" });
    return null;
  }
};

