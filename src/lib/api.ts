export async function httpGet<T>(path: string): Promise<T> {
  let url = path;
  if (typeof window !== "undefined") {
    const here = new URL(window.location.href);
    const passthrough = new URLSearchParams();
    if (here.searchParams.get("fail")) passthrough.set("fail", "1");
    if (here.searchParams.get("empty")) passthrough.set("empty", "1");
    const qs = passthrough.toString();
    if (qs) url += (path.includes("?") ? "&" : "?") + qs;
  }
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {}
    throw new Error(msg);
  }
  return (await res.json()) as T;
}
