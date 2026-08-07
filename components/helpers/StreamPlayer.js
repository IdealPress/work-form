import { useEffect, useRef } from "react";

// Don't ask canPlayType() whether HLS is playable: desktop Chrome answers
// "maybe" for application/vnd.apple.mpegurl and then fails with a
// MEDIA_ERR_SRC_NOT_SUPPORTED. Media Source Extensions decide instead — hls.js
// wherever MSE exists, and a native <video src> only where it doesn't (iOS).
const hasMediaSource = () =>
  typeof window !== "undefined" &&
  ("MediaSource" in window || "ManagedMediaSource" in window);

const streamType = (url) => {
  const path = url.split(/[?#]/)[0].toLowerCase();
  if (path.endsWith(".mpd")) return "dash";
  if (path.endsWith(".m3u8")) return "hls";
  return "file";
};

// Accepts "16:9" (what the CMS stores), "16 / 9" or "Auto".
const toAspectRatio = (ratio) => {
  if (!ratio || ratio.toLowerCase() === "auto") return undefined;
  return ratio.replace(":", " / ");
};

export default function StreamPlayer({
  src,
  poster,
  ratio,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const type = streamType(src);
    let cancelled = false;
    let destroy;

    // The autoplay attribute is evaluated during the element's own load
    // algorithm, which has already finished by the time MSE hands it a source —
    // so muted autoplay has to be asked for explicitly. Rejection is expected
    // when a browser declines it, and the poster stays up in that case.
    const tryPlay = () => {
      if (autoPlay) video.play().catch(() => {});
    };
    video.addEventListener("canplay", tryPlay);

    if (type === "dash") {
      // dashjs and hls.js are only fetched when a stream actually needs them,
      // and never on the server.
      import("dashjs").then(({ MediaPlayer }) => {
        if (cancelled) return;
        const player = MediaPlayer().create();
        player.initialize(video, src, autoPlay);
        destroy = () => player.destroy();
      });
    } else if (type === "hls" && hasMediaSource()) {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          video.src = src;
          return;
        }
        const hls = new Hls({ enableWorker: false });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;
          // Network and media stalls are usually recoverable; anything else
          // isn't, and leaving a dead instance running just burns requests.
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else hls.destroy();
        });
        destroy = () => hls.destroy();
      });
    } else {
      video.src = src;
    }

    return () => {
      cancelled = true;
      video.removeEventListener("canplay", tryPlay);
      destroy?.();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, autoPlay]);

  if (!src) return null;

  return (
    <div style={{ aspectRatio: toAspectRatio(ratio) }}>
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        preload="metadata"
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
}
