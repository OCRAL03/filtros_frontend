import path from 'path';
import fs from 'fs/promises';

export const runtime = 'nodejs';

function getMimeType(ext) {
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
    case '.jfif':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

function safeDecode(segment) {
  try {
    return decodeURIComponent(decodeURIComponent(segment));
  } catch {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const basePath = '/assets/productos/';
    let rel = url.pathname.startsWith(basePath)
      ? url.pathname.slice(basePath.length)
      : url.pathname.replace(/^\/+/, '');

    const segments = rel.split('/').filter(Boolean);
    const decodedSegments = segments.map(safeDecode);
    const filePath = path.join(process.cwd(), 'assets', 'productos', ...decodedSegments);

    const buffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = getMimeType(ext);

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    return new Response('Not Found', { status: 404 });
  }
}