const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicPath(path: string) {
  if (!path || /^https?:\/\//i.test(path) || !path.startsWith("/")) return path;
  if (!basePath || path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}
