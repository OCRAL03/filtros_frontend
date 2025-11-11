export function getApiBaseUrl() {
  // Base pública para llamadas absolutas si fuera necesario
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
}

export function buildUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  // En cliente (browser) usar ruta relativa para aprovechar rewrites de Next
  // También se puede forzar con NEXT_PUBLIC_USE_RELATIVE_API=1
  const useRelative = (typeof window !== 'undefined') || process.env.NEXT_PUBLIC_USE_RELATIVE_API === '1';
  if (useRelative) {
    return p;
  }
  const base = getApiBaseUrl().replace(/\/$/, '');
  return `${base}${p}`;
}
