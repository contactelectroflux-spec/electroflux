"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  }

  return (
    <div className="demo-video-wrap reveal-scale">
      <video
        ref={videoRef}
        className="demo-video"
        src="https://www.dropbox.com/scl/fi/jvn00a1c7571pfiutk8t2/YouCut_20260510_143938098.mp4?rlkey=mc90ms1y2mby17a9g8n3i2gl7&st=ixoc8s38&dl=1"
        autoPlay
        muted
        loop
        playsInline
        aria-label="Démo atlasibo IPTV"
      />
      <button
        className="demo-sound-btn"
        onClick={toggleMute}
        aria-label={muted ? "Activer le son" : "Couper le son"}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        {muted ? "Son" : "Muet"}
      </button>
    </div>
  );
}
