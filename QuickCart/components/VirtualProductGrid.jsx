"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * VirtualProductGrid
 * - Virtualiza una grilla de cards en filas de altura fija.
 * - Calcula columnas en función del ancho del viewport (breakpoints simples).
 * - Renderiza sólo las filas visibles con overscan para suavizar.
 */
export default function VirtualProductGrid({
  items = [],
  renderItem,
  rowHeight = 320,
  overscan = 2,
}) {
  const containerRef = useRef(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0, top: 0 });
  const [mounted, setMounted] = useState(false);

  const columns = useMemo(() => {
    const w = viewport.width || (typeof window !== "undefined" ? window.innerWidth : 1024);
    if (w >= 1280) return 5; // xl
    if (w >= 1024) return 4; // lg
    if (w >= 768) return 3;  // md
    return 2;                // base
  }, [viewport.width]);

  const rowCount = Math.max(1, Math.ceil(items.length / columns));
  const totalHeight = rowCount * rowHeight;

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const h = window.innerHeight || 800;
      const w = window.innerWidth || 1024;
      const rect = containerRef.current?.getBoundingClientRect();
      setViewport({ width: w, height: h, top: rect?.top || 0 });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startRow = useMemo(() => {
    // posición del viewport relativa al contenedor
    const relTop = (viewport.top < 0) ? -viewport.top + scrollY : scrollY;
    const topVisible = relTop - 64; // margen de seguridad
    return Math.max(0, Math.floor(topVisible / rowHeight));
  }, [scrollY, viewport.top, rowHeight]);

  const visibleRowCount = Math.ceil((viewport.height || 800) / rowHeight);
  const endRow = Math.min(rowCount - 1, startRow + visibleRowCount + overscan);
  const firstRow = Math.max(0, startRow - overscan);

  const topSpacer = firstRow * rowHeight;
  const bottomSpacer = Math.max(0, totalHeight - topSpacer - (endRow - firstRow + 1) * rowHeight);

  const visibleRows = [];
  if (mounted) {
    for (let row = firstRow; row <= endRow; row++) {
      const rowItems = [];
      for (let col = 0; col < columns; col++) {
        const idx = row * columns + col;
        if (idx >= items.length) break;
        const item = items[idx];
        // Pasar el índice absoluto para facilitar claves únicas en el consumidor
        rowItems.push(renderItem(item, idx));
      }
      visibleRows.push(
        <div
          key={`row-${row}`}
          style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "1.5rem", height: `${rowHeight}px` }}
        >
          {rowItems}
        </div>
      );
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {mounted ? (
        <>
          <div style={{ height: `${topSpacer}px` }} />
          {visibleRows}
          <div style={{ height: `${bottomSpacer}px` }} />
        </>
      ) : null}
    </div>
  );
}