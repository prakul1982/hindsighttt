import { createFileRoute } from "@tanstack/react-router";

const title = "Hindsight · Equity Research Terminal";
const description =
  "Self-hosted equity research terminal: fundamentals, 52-week rails, margin cascades and EPS surprises for US and India listings — bring your own API keys.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      <h1 className="sr-only">Hindsight — Equity Research Terminal</h1>
      <iframe
        src="/hindsight.html"
        title="Hindsight Equity Research Terminal"
        className="h-full w-full border-0"
      />
    </main>
  );
}
