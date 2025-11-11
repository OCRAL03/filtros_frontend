import { buildUrl } from './api';

export async function getSubCategoriasByCategoria(categoria_id: number | string, options?: { signal?: AbortSignal }) {
  try {
    let url = buildUrl('/api/sub-categoria');
    if (categoria_id !== undefined && categoria_id !== null) {
      const qs = new URLSearchParams({ categoria_id: String(categoria_id) }).toString();
      url = `${url}?${qs}`;
    }
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: options?.signal,
    });
    if (!res.ok) {
      throw new Error("Error al obtener subcategorías");
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