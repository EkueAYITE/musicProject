'use client';

import { useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-black aspect-video">
      <video
        ref={videoRef}
        controls
        poster={poster}
        className="w-full h-full"
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  );
}
