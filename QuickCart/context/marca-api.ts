import { buildUrl } from './api';

export async function getMarcas(options?: { signal?: AbortSignal }) {
  try {
    const res = await fetch(buildUrl("/api/marca"), {
      method: "GET",
      cache: "no-store",
      signal: options?.signal,
    });
    if (!res.ok) {
      throw new Error("Error al obtener marcas");
    }
    const data = await res.json();
    return data;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return undefined as any;
    }
    throw error;
  }
}