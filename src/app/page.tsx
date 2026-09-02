import HubClient from "@/components/HubClient";
import { ACTIVE } from "@/data/colleges";

export default function Home() {
  const reaches = ACTIVE.filter((c) => c.level === "Reach").length;
  const targets = ACTIVE.filter((c) => c.level === "Target").length;
  const safeties = ACTIVE.filter((c) => c.level === "Safety").length;

  return (
    <>
      <section className="hero">
        <p className="hero__overline">application season ’26 – ’27</p>
        <h1>
          The <em>Short</em> List.
        </h1>
        <p className="hero__sub">
          {ACTIVE.length} schools, ranked — {reaches} reaches, {targets}{" "}
          targets, {safeties} safeties. Aerospace up front, applied math riding
          shotgun. Click a card to fly to it; click a pin to find its card.
        </p>
      </section>
      <HubClient />
    </>
  );
}
