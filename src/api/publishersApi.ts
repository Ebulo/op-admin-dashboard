import { toast } from 'react-hot-toast';
import { config } from "@/config/config";
import { getToken } from './authApi';
import { Publisher } from '@/types/publisher';

const base = () => `${config.apiBaseUrl}/admin/publishers`;

export const listPublishers = async (search = ""): Promise<Publisher[]> => {
  const token = getToken();
  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return [];
  }

  const params = new URLSearchParams();
  if (search) params.append("search", search);

  try {
    const res = await fetch(`${base()}/?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch publishers");
    const data = await res.json();
    // Handle paginated or plain arrays
    if (Array.isArray(data)) return data as Publisher[];
    if (Array.isArray(data?.results)) return data.results as Publisher[];
    return (data?.data as Publisher[]) || [];
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Something went wrong";
    toast.error(msg, { position: "bottom-right" });
    return [];
  }
};

export const getPublisher = async (id: number): Promise<Publisher | null> => {
  const token = getToken();
  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return null;
  }
  try {
    const res = await fetch(`${base()}/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Failed to fetch publisher");
    return (await res.json()) as Publisher;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Something went wrong";
    toast.error(msg, { position: "bottom-right" });
    return null;
  }
};

export const createPublisher = async (payload: Omit<Publisher, 'id'>): Promise<Publisher | null> => {
  const token = getToken();
  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return null;
  }
  try {
    const res = await fetch(`${base()}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || 'Failed to create publisher');
    }
    const data = (await res.json()) as Publisher;
    toast.success('Publisher created', { position: 'bottom-right' });
    return data;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Something went wrong";
    toast.error(msg, { position: "bottom-right" });
    return null;
  }
};

export const updatePublisher = async (id: number, payload: Partial<Omit<Publisher, 'id'>>): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return false;
  }
  try {
    const res = await fetch(`${base()}/${id}/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || 'Failed to update publisher');
    }
    toast.success('Publisher updated', { position: 'bottom-right' });
    return true;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Something went wrong";
    toast.error(msg, { position: "bottom-right" });
    return false;
  }
};

export const deletePublisher = async (id: number): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    toast.error("Not authenticated. Please sign in.", { position: "bottom-right" });
    return false;
  }
  try {
    const res = await fetch(`${base()}/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || 'Failed to delete publisher');
    }
    toast.success('Publisher deleted', { position: 'bottom-right' });
    return true;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Something went wrong";
    toast.error(msg, { position: "bottom-right" });
    return false;
  }
};

