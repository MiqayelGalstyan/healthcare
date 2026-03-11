const AVATARS_BUCKET = "avatars";

export function getPublicAvatarUrl(
  path: string | null | undefined,
): string | null {
  if (!path || typeof path !== "string" || path.trim() === "") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return null;

  const normalized = path.startsWith("/") ? path.slice(1) : path;
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${AVATARS_BUCKET}/${normalized}`;
}
