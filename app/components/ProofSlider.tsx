"use client";
import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";

const photos = [1, 2, 3, 4];
const AUTO_DELAY = 3000;

export default function ProofSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth;
    el.scrollTo({ left: cardWidth * idx, behavior: "smooth" });
    setActive(idx);
  }, []);

  const next = useCallback(() => {
    setActive((prev) => {
      const nx = (prev + 1) % photos.length;
      const el = trackRef.current;
      if (el) el.scrollTo({ left: el.offsetWidth * nx, behavior: "smooth" });
      return nx;
    });
  }, []);

  // auto-slide
  useEffect(() => {
    timerRef.current = setInterval(next, AUTO_DELAY);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  // sync dot on manual swipe
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let scrollTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      // pause auto-slide on manual interaction
      if (timerRef.current) clearInterval(timerRef.current);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const idx = Math.round(el.scrollLeft / el.offsetWidth);
        setActive(Math.min(idx, photos.length - 1));
        // resume auto-slide
        timerRef.current = setInterval(next, AUTO_DELAY);
      }, 150);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer);
    };
  }, [next]);

  return (
    <>
      {/* Desktop: 4-column grid */}
      <div className="proof-grid">
        {photos.map((n) => (
          <div key={n} className="proof-card">
            <Image
              src={`/clients satisfied/${n}.jpeg`}
              alt={`Client satisfait ${n}`}
              width={360}
              height={640}
              className="proof-img"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Mobile: full-width auto-slide */}
      <div className="proof-slider-wrap">
        <div className="proof-track" ref={trackRef}>
          {photos.map((n) => (
            <div key={n} className="proof-slide">
              <Image
                src={`/clients satisfied/${n}.jpeg`}
                alt={`Client satisfait ${n}`}
                width={360}
                height={640}
                className="proof-img"
                unoptimized
              />
            </div>
          ))}
        </div>
        <div className="proof-dots" aria-label="Navigation photos">
          {photos.map((_, i) => (
            <button
              key={i}
              className={`proof-dot${active === i ? " active" : ""}`}
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                goTo(i);
                timerRef.current = setInterval(next, AUTO_DELAY);
              }}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
