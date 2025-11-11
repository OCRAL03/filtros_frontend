import { buildUrl } from './api';

export async function getProductos(options?: { signal?: AbortSignal }) {
  try {
    const res = await fetch(buildUrl('/api/producto'), {
      method: "GET",
      cache: "no-store",
      signal: options?.signal,
    });

    if (!res.ok) {
      throw new Error("Error al obtener productos");
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

function buildQuery(params: Record<string, any>): string {  
    const usp = new URLSearchParams();  
    Object.entries(params || {}).forEach(([key, val]) => {    
      if (val === undefined || val === null) return;  
      if (Array.isArray(val)) {  
        usp.set(key, val.map(String).join(','));  
      } else if (typeof val === 'object') {  
        Object.entries(val).forEach(([k, v]) => {   
            if (v === undefined || v === null) return;  
            usp.set(`${key}[${k}]`, String(v));
        }); 
        } else {  
        usp.set(key, String(val));  
      } 
    });  
    const qs = usp.toString();  
    return qs ? `?${qs}` : ''; 
}
export async function getProductosFiltered(params: Record<string, any>, options?: { signal?: AbortSignal }) {
  try {
    const qs = buildQuery(params);  
    const url = buildUrl(`/api/producto/filtro${qs}`);
    try {
      if (process.env.NEXT_PUBLIC_DEBUG_FILTERS === '1') {
        console.log('[QuickCart][Filters] API', { url, params });
      }
    } catch {}
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: options?.signal,
    });
    if (!res.ok) {
      throw new Error("Error al obtener productos filtrados");
    }
    const data = await res.json();
    return data;
  } catch (error: any) {
    // Silenciar abortos para evitar logs ruidosos en navegación/re-render
    if (error?.name === 'AbortError') {
      // devolver undefined para que el consumidor lo trate como lista vacía
      return undefined as any;
    }
    throw error;
  } 
}