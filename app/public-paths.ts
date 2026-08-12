const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicPath(path: string) {
  if (!path || /^https?:\/\//i.test(path) || !path.startsWith("/")) return path;
  // Assets in Next's `public` directory are served from the site root.  Some
  // legacy exports also carry a literal `/public/` segment, so normalise it
  // here to keep local preview and GitHub Pages on the same URL shape.
  const normalizedPath = path.startsWith("/public/") ? path.slice(7) : path;
  if (!basePath || normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)) return normalizedPath;
  return `${basePath}${normalizedPath}`;
}
