const VideoPlayer = ({ src, onClose }) => {
    let videoId;
  
    try {
      const url = new URL(src);
      if (url.hostname.includes("youtube.com")) {
        videoId = url.searchParams.get("v");
      } else if (url.hostname === "youtu.be") {
        videoId = url.pathname.slice(1);
      }
    } catch (err) {
      console.error("Invalid YouTube URL", err);
      return (
        <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
          <p className="text-red-500">Invalid YouTube URL</p>
        </div>
      );
    }
  
    if (!videoId) {
      return (
        <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
          <p className="text-red-500">Could not parse video ID</p>
        </div>
      );
    }
  
    // Use privacy-enhanced mode and add parameters to minimize branding
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&fs=1&iv_load_policy=3&cc_load_policy=0&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;
  
    return (
      <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800/50" style={{ paddingTop: "56.25%" }}>
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="Video Player"
          style={{
            filter: 'brightness(1.02) contrast(1.02)',
          }}
        ></iframe>
        {/* Subtle corner accent for custom feel */}
        <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-gray-900/20 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none bg-gradient-to-tl from-transparent via-transparent to-gray-900/20 opacity-50"></div>
      </div>
    );
  };
export default VideoPlayer;  