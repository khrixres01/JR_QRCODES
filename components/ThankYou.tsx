/* eslint-disable @next/next/no-img-element */
import { thankYou } from "@/lib/content";

export default function ThankYou() {
  return (
    <>
      <div className="section thanks-section">
        <img
          className="thanks-card"
          src="/art/thank-you.webp"
          alt={thankYou.alt}
          width={1100}
          height={1563}
        />
        {/* The card's words are inside the image, so repeat them for screen readers. */}
        <p className="sr-only">{thankYou.message}</p>
      </div>
      <div className="pad" />
    </>
  );
}
