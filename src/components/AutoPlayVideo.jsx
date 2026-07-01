"use client";
import { useEffect, useRef } from "react";

const AutoPlayVideo = ({ src, className = "", controls = true, loop = true }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in viewport - play it
            video.play().catch((error) => {
              // Auto-play was prevented, which is fine
              console.log("Auto-play prevented:", error);
            });
          } else {
            // Video is out of viewport - pause it
            video.pause();
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of video is visible
      }
    );

    observer.observe(video);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      controls={controls}
      loop={loop}
      muted // Required for auto-play in most browsers
      playsInline // Required for iOS
      className={className}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default AutoPlayVideo;

