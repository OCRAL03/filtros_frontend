import { buildUrl } from './api';

export type Tienda = {
  idTienda: number;
  nombre: string;
};

export async function getTiendas() {
  const res = await fetch(buildUrl('/api/tienda'));
  if (!res.ok) {
    throw new Error(`Error al cargar tiendas: ${res.status}`);
  }
  const data = await res.json();
  return data as Tienda[];
}