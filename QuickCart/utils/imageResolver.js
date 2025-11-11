import React from 'react';
import Image from 'next/image';

export function normalizeSrcWithFallback(token) {
  if (!token) return '';
  if (typeof token === 'object' && token !== null) {
    const maybeSrc = token.src || (Array.isArray(token) ? token[0] : undefined);
    if (typeof maybeSrc === 'string' && maybeSrc.trim()) {
      return maybeSrc.trim();
    }
  }
  const str = String(token).trim();
  if (!str) return '';
  if (/^https?:\/\//i.test(str)) return str;
  if (/^data:/i.test(str)) return str; 
  const stripAccents = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const canonicalize = (filename) => {
    const dot = filename.lastIndexOf('.');
    const name = dot >= 0 ? filename.slice(0, dot) : filename;
    const ext = dot >= 0 ? filename.slice(dot + 1) : '';
    const canonicalName = stripAccents(String(name))
      .toLowerCase()
      .replace(/-/g, '')
      .replace(/\s+/g, '');
    return ext ? `${canonicalName}.${ext}` : canonicalName;
  };
  // Si ya viene con ruta completa dentro de productos, úsala tal cual primero
  if (str.startsWith('/assets/productos/')) {
    return encodeURI(str.replace(/\\/g, '/'));
  }
  if (str.startsWith('/assets/')) return encodeURI(str);
  const basename = str
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .pop() || '';
  if (!basename) return '';
  return encodeURI(`/assets/productos/${basename}`);
}

export function ImageWithFallback({ src, alt, className, fallbackSrc = '/images/product-placeholder.svg', onError, ...props }) {
  const initial = normalizeSrcWithFallback(src || '');
  const [currentSrc, setCurrentSrc] = React.useState(initial);
  const [triedOld, setTriedOld] = React.useState(false);
  const [triedLogo, setTriedLogo] = React.useState(false);
  const [extIdx, setExtIdx] = React.useState(0);
  const [triedNoHyphen, setTriedNoHyphen] = React.useState(false);
  const [triedInsertHyphen, setTriedInsertHyphen] = React.useState(false);
  const [triedLowercase, setTriedLowercase] = React.useState(false);
  const [triedSpacesHyphen, setTriedSpacesHyphen] = React.useState(false);
  const [triedAccentless, setTriedAccentless] = React.useState(false);
  const { strict = true } = props;

  const altExts = ['png','jpg','jpeg','jfif','webp'];

  const stripAccents = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const splitPath = (cur) => {
    const lastSlash = cur.lastIndexOf('/');
    const dir = lastSlash >= 0 ? cur.slice(0, lastSlash + 1) : '';
    const file = lastSlash >= 0 ? cur.slice(lastSlash + 1) : cur;
    const dot = file.lastIndexOf('.');
    const name = dot >= 0 ? file.slice(0, dot) : file;
    const ext = dot >= 0 ? file.slice(dot + 1) : '';
    return { dir, name, ext };
  };

  // Reconstruye ruta codificando solo el nombre del archivo para evitar doble encoding
  const rebuildPath = (dir, rawName, ext) => {
    const cleanDir = (() => {
      try { return decodeURI(dir || ''); } catch { return dir || ''; }
    })();
    const namePart = encodeURIComponent(String(rawName || ''));
    return `${cleanDir}${namePart}${ext ? `.${ext}` : ''}`;
  };

  const swapExt = (path, nextExt) => {
    try {
      const url = String(path || '');
      const parts = url.split('?');
      const base = parts[0];
      const query = parts[1] ? `?${parts[1]}` : '';
      const lastSlash = base.lastIndexOf('/');
      const dir = lastSlash >= 0 ? base.slice(0, lastSlash + 1) : '';
      const file = lastSlash >= 0 ? base.slice(lastSlash + 1) : base;
      const dot = file.lastIndexOf('.');
      const name = dot >= 0 ? file.slice(0, dot) : file;
      return `${rebuildPath(dir, name, nextExt)}${query}`;
    } catch (_) {
      return path || '';
    }
  };

  const handleError = (e) => {
    if (strict) {
      if (!triedLogo) {
        setTriedLogo(true);
        setCurrentSrc(fallbackSrc || '/images/product-placeholder.svg');
      }
      if (typeof onError === 'function') onError(e);
      return;
    }

    // Probar variante sin guiones (ej: ETA-10 -> ETA10)
    if (!triedNoHyphen && currentSrc) {
      const cur = String(currentSrc);
      const { dir, name, ext } = splitPath(cur);
      const noHyphen = name.replace(/-/g, '');
      const candidate = rebuildPath(dir, noHyphen, ext);
      setTriedNoHyphen(true);
      setCurrentSrc(candidate);
      if (typeof onError === 'function') onError(e);
      return;
    }

    if (!triedInsertHyphen && currentSrc) {
      const cur = String(currentSrc);
      const { dir, name, ext } = splitPath(cur);
      if (!/-/.test(name) && /[A-Za-z]\d/.test(name)) {
        const withHyphen = name.replace(/([A-Za-z])(\d)/, '$1-$2');
        setTriedInsertHyphen(true);
        setCurrentSrc(rebuildPath(dir, withHyphen, ext));
        if (typeof onError === 'function') onError(e);
        return;
      }
    }

    if (!triedLowercase && currentSrc) {
      const cur = String(currentSrc);
      const { dir, name, ext } = splitPath(cur);
      setTriedLowercase(true);
      setCurrentSrc(rebuildPath(dir, name.toLowerCase(), ext));
      if (typeof onError === 'function') onError(e);
      return;
    }

    if (!triedSpacesHyphen && currentSrc) {
      const cur = String(currentSrc);
      const { dir, name, ext } = splitPath(cur);
      const replaced = name.replace(/\s+/g, '-');
      setTriedSpacesHyphen(true);
      setCurrentSrc(rebuildPath(dir, replaced, ext));
      if (typeof onError === 'function') onError(e);
      return;
    }

    if (!triedAccentless && currentSrc) {
      const cur = String(currentSrc);
      const { dir, name, ext } = splitPath(cur);
      setTriedAccentless(true);
      setCurrentSrc(rebuildPath(dir, stripAccents(name), ext));
      if (typeof onError === 'function') onError(e);
      return;
    }

    if (currentSrc) {
      const cur = String(currentSrc);
      const dot = cur.lastIndexOf('.');
      const curExt = dot >= 0 ? cur.slice(dot + 1).split(/[?#]/)[0].toLowerCase() : '';
      const candidates = altExts.filter((x) => x !== curExt);
      if (extIdx < Math.min(candidates.length, 3)) {
        const next = candidates[extIdx];
        setExtIdx(extIdx + 1);
        setCurrentSrc(swapExt(cur, next));
        if (typeof onError === 'function') onError(e);
        return;
      }
    }
  };

  return (
    <Image
      src={currentSrc || fallbackSrc || '/images/product-placeholder.svg'}
      alt={alt || 'Imagen'}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}