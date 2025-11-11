import { buildUrl } from './api';

export async function getTiposProductoBySubCategoria(subcategoria_id: number | string, options?: { signal?: AbortSignal }) {
  try {
    let url = buildUrl('/api/tipo-producto');
    if (subcategoria_id !== undefined && subcategoria_id !== null) {
      const qs = new URLSearchParams({ subcategoria_id: String(subcategoria_id) }).toString();
      url = `${url}?${qs}`;
    }
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: options?.signal,
    });
    if (!res.ok) {
      throw new Error("Error al obtener tipos de producto");
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