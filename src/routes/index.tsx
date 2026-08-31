import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

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
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Mark video as loaded after a short delay
    const timer = setTimeout(() => setVideoLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-background">
      <h1 className="sr-only">Hindsight — Equity Research Terminal</h1>

      {/* Cinematic promo video background */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/hindsight-promo.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for terminal readability */}
        <div className="absolute inset-0 bg-background/85" />
      </div>

      {/* Terminal iframe - above the video */}
      <iframe
        src="/hindsight.html"
        title="Hindsight Equity Research Terminal"
        className="relative z-10 h-full w-full border-0"
      />
    </main>
  );
}
