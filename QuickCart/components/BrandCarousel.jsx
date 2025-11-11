import React, { useState, useEffect, useRef } from "react";
import { getProductosFiltered } from "@/context/producto-api";

export default function BrandCarousel({
  brands = [],
  activeMarcaIds = [],
  onToggle,
  products = [],
  limit = 5,
  types = [],
  activeType,
  onSelectType,
  typesTheme = 'red',
}) {
  // Desactivar temporalmente el cómputo remoto de conteos por tipo
  const ENABLE_REMOTE_COUNTS = false;
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollerRef = useRef(null);
  const [typeCounts, setTypeCounts] = useState({});
  const isFetchingCountsRef = useRef(false);
  const lastTypesSigRef = useRef('');
  const [visibleStart, setVisibleStart] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    void el;
    const ac = new AbortController();
    const run = async () => {
      if (!ENABLE_REMOTE_COUNTS) {
        // Evita llamadas a la API que generan muchos logs cuando el backend no está disponible
        setTypeCounts({});
        return;
      }
      if (!Array.isArray(types) || types.length === 0) { setTypeCounts({}); return; }
      if (isFetchingCountsRef.current) return;
      // Evitar relanzar conteo si la firma de tipos no cambió
      const normalizeSoft = (s) => (s || "").toString().toLowerCase().trim();
      const sig = types.map(normalizeSoft).join('|');
      try {
        // Log #3: Inicio de conteo por tipo con firma
        console.log('[Diag][BrandCarousel] iniciar conteo', { cantidadTipos: types.length, firma: sig });
      } catch {}
      if (sig === lastTypesSigRef.current) return;
      lastTypesSigRef.current = sig;
      isFetchingCountsRef.current = true;
      try {
        const usp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        // Aceptar claves cortas y largas en la URL
        const c = (usp.get('c') || usp.get('categoria') || '').toLowerCase();
        const s = (usp.get('s') || usp.get('subcategoria') || '').toLowerCase();
        const q = (usp.get('q') || '').toLowerCase();
        const price_min = usp.get('price_min') || undefined;
        const price_max = usp.get('price_max') || undefined;
        const marcas = usp.getAll('marca_id')?.concat(usp.getAll('marca_id[]') || []) || [];
        const paramsBase = {
          categoria: c || undefined,
          subcategoria: s || undefined,
          q: q || undefined,
          price_min: price_min ? Number(price_min) : undefined,
          price_max: price_max ? Number(price_max) : undefined,
          marcas: marcas.length ? marcas.join(',') : undefined,
        };

        const next = {};
        for (const name of types) {
          const tipo = normalizeSoft(name);
          try {
            const data = await getProductosFiltered({ ...paramsBase, tipo }, { signal: ac.signal });
            let total = 0;
            if (Array.isArray(data)) total = data.length;
            else if (data?.paginacion?.total !== undefined) total = Number(data.paginacion.total) || 0;
            else if (Array.isArray(data?.productos)) total = data.productos.length;
            next[tipo] = total;
          } catch (err) {
            const msg = String(err?.message || '').toLowerCase();
            const aborted = err?.name === 'AbortError' || err?.code === 'ERR_CANCELED' || msg.includes('aborted');
            if (!aborted) {
              next[tipo] = 0;
            }
          }
        }
        if (!ac.signal.aborted) {
          try {
            if (process.env.NEXT_PUBLIC_DEBUG_FILTERS === '1') {
              console.log('[QuickCart][Filters] Type counts', next);
            }
          } catch {}
          try {
            console.log('[Diag][BrandCarousel] conteos establecidos', next);
          } catch {}
          setTypeCounts(next);
        }
      } finally {
        isFetchingCountsRef.current = false;
      }
    };
    const id = setTimeout(run, 150);
    return () => { clearTimeout(id); ac.abort(); };
  }, [types]);

  useEffect(() => {
    setVisibleStart(0);
  }, [types]);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    const handler = () => updateScrollState();
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const scrollBy = (dx) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: 'smooth' });
    setTimeout(updateScrollState, 200);
  };

  // Auto-avance cada 3 segundos
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (atEnd) {
        // Reiniciar al inicio si llegamos al final
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Avanzar una ventana
        scrollBy(320);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [types, products, brands]);

  return (
    <div className="w-full py-2 flex items-center gap-2 relative">
      <button
        type="button"
        aria-label="Desplazar izquierda"
        onClick={() => scrollBy(-320)}
        disabled={!canScrollLeft}
        className="shrink-0 px-2 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
      >
        ‹
      </button>
      {/* Scroll shadows */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent" />
      )}
      {canScrollRight && (
        <div className="pointer-events-none absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent" />
      )}
      <div ref={scrollerRef} className="flex-1 overflow-x-auto">
        <div className="flex items-center gap-2 w-max flex-nowrap">
          {(() => {
            const hasTypes = Array.isArray(types) && types.length > 0;
            if (hasTypes) {
              const normalized = (s) => (s || "").toString().toLowerCase().trim();
              const eligible = types.filter((name) => {
                const key = normalized(name);
                const cnt = typeCounts?.[key];
                if (typeof cnt !== 'number') return true;
                return cnt > 0;
              });
              const source = eligible.length ? eligible : types;
              const windowItems = source;
              const theme = String(typesTheme || 'blue').toLowerCase();
              const colors = {
                blue: {
                  active: 'bg-blue-600 text-white border-blue-600',
                  idle: 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50',
                  badgeIdle: 'bg-gray-100 text-gray-700 border-gray-300',
                  badgeActive: 'bg-blue-500/40 text-white border-blue-500/50',
                },
                red: {
                  active: 'bg-brandRed-600 text-white border-brandRed-600 shadow-softRed',
                  idle: 'bg-white text-gray-700 border-gray-300 hover:bg-brandRed-50 hover:border-brandRed-300 hover:text-brandRed-700',
                  badgeIdle: 'bg-brandRed-50 text-brandRed-700 border-brandRed-200',
                  badgeActive: 'bg-brandRed-500/40 text-white border-brandRed-500/50',
                },
                orange: {
                  active: 'bg-orange-600 text-white border-orange-600',
                  idle: 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50',
                  badgeIdle: 'bg-orange-50 text-orange-700 border-orange-200',
                  badgeActive: 'bg-orange-500/40 text-white border-orange-500/50',
                }
              }[theme];
              return windowItems.map((name, idx) => {
                const isActive = (name || '').toLowerCase() === (activeType || '').toLowerCase();
                const tipoKey = (name || '').toLowerCase();
                const count = typeCounts?.[tipoKey];
                const baseCls = 'px-3 py-2 text-xs border rounded-md transition select-none cursor-pointer';
                const activeCls = colors.active;
                const idleCls = colors.idle;
                return (
                  <div
                    key={`${name}-${idx}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    onClick={() => onSelectType?.(name)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectType?.(name); } }}
                    className={`${baseCls} ${isActive ? activeCls : idleCls}`}
                  >
                    <span className="uppercase">{name}</span>
                    {typeof count === 'number' && (
                      <span className={`ml-2 text-[11px] ${isActive ? colors.badgeActive : colors.badgeIdle} px-2 py-0.5 border rounded`}>{count}</span>
                    )}
                  </div>
                );
              });
            }
            const isProducts = Array.isArray(products) && products.length > 0;
            const items = isProducts ? products.slice(0, limit) : brands;
            return items.map((item, idx) => {
              const id = isProducts ? (item?._id ?? idx) : (item?.idMarca ?? item?.id ?? item?._id ?? idx);
              const label = isProducts ? (item?.name ?? `Producto ${idx + 1}`) : (item?.nombre ?? item?.name ?? String(id));
              const active = !isProducts && activeMarcaIds.includes(String(id));
              const onClick = !isProducts ? (() => onToggle?.(id)) : undefined;
              return (
                <div
                  key={`${String(id)}-${idx}`}
                  role={!isProducts ? 'button' : undefined}
                  tabIndex={!isProducts ? 0 : undefined}
                  aria-pressed={!isProducts ? active : undefined}
                  onClick={onClick}
                  onKeyDown={(e) => { if (!isProducts && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick?.(); } }}
                  className={`px-3 py-2 text-xs border transition select-none ${active ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  {label}
                </div>
              );
            });
          })()}
        </div>
      </div>
      <button
        type="button"
        aria-label="Desplazar derecha"
        onClick={() => scrollBy(320)}
        disabled={!canScrollRight}
        className="shrink-0 px-2 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
      >
        ›
      </button>
    </div>
  );
}