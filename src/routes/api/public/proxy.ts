import { createFileRoute } from "@tanstack/react-router";

/* Same-origin fetch relay for sources that don't send CORS headers.
 * Allowlisted on purpose — an open proxy on your own domain is a liability. */
const ALLOW = [
  "screener.in",
  "query1.finance.yahoo.com",
  "query2.finance.yahoo.com",
  "news.google.com",
];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300",
};

async function handleGet({ request }: { request: Request }) {
  const target = new URL(request.url).searchParams.get("url");
  if (!target)
    return new Response("Add a ?url= parameter.", { status: 400, headers: cors });

  let host: string;
  try {
    const u = new URL(target);
    if (u.protocol !== "https:") throw new Error("https only");
    host = u.hostname;
  } catch {
    return new Response("That isn't a valid https URL.", { status: 400, headers: cors });
  }

  if (!ALLOW.some((d) => host === d || host.endsWith("." + d)))
    return new Response(`This proxy doesn't serve ${host}.`, { status: 403, headers: cors });

  try {
    const r = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Hindsight/1.0)",
        "Accept-Language": "en-IN,en;q=0.9",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok)
      return new Response(`Upstream returned ${r.status}.`, { status: 502, headers: cors });
    const body = await r.text();
    return new Response(body, {
      status: 200,
      headers: {
        ...cors,
        "Content-Type": r.headers.get("content-type") || "text/plain; charset=utf-8",
      },
    });
  } catch (e) {
    const timedOut = e instanceof Error && e.name === "TimeoutError";
    return new Response(timedOut ? "Upstream timed out." : "Couldn't reach upstream.", {
      status: 504,
      headers: cors,
    });
  }
}

export const Route = createFileRoute("/api/public/proxy")({
  server: {
    handlers: {
      GET: handleGet,
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
    },
  },
});
