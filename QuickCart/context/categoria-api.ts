import { buildUrl } from './api';

export async function getCategorias(options?: { signal?: AbortSignal }) {
  try {
    // Usar endpoint público según backend NestJS
    const res = await fetch(buildUrl("/api/categoria/"), {
      method: "GET",
      cache: "no-store",
      signal: options?.signal,
    });
    if (!res.ok) {
      throw new Error("Error al obtener categorías");
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