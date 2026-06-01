const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".ogg"];

function isVideo(src: string): boolean {
  const lower = src.toLowerCase();
  return videoExtensions.some((ext) => lower.endsWith(ext));
}

export function MediaViewer({
  src,
  alt = "",
  className = "",
  controls = true,
}: {
  src: string;
  alt?: string;
  className?: string;
  controls?: boolean;
}) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        controls={controls}
        className={className}
        preload="metadata"
      />
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
