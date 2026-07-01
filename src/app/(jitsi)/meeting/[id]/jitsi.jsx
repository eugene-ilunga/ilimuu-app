"use client";
import { useEffect, useRef } from "react";

export default function JitsiRoom({ roomName, userName, isModerator }) {
  const containerRef = useRef(null);
  const appId = process.env.NEXT_PUBLIC_JITSI_APP_ID;

  useEffect(() => {
    const loadJitsi = async () => {
      const res = await fetch("/api/jitsi-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, isModerator, roomName }),
      });

      const { token } = await res.json();
      if (!token) {
        console.error("JWT token not received");
        return;
      }

      const domain = "8x8.vc";
      const options = {
        roomName: `${appId}/${roomName}`,
        parentNode: containerRef.current,
        userInfo: { displayName: userName },
        jwt: token,
        configOverwrite: {
          prejoinPageEnabled: true,
          startWithAudioMuted: true,
          startWithVideoMuted: true,
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      // Auto-enable lobby if moderator
      api.addEventListener('videoConferenceJoined', () => {
        if (isModerator) {
          api.executeCommand('toggleLobby'); // Enable lobby when moderator joins
        }
      });
    };

    if (window.JitsiMeetExternalAPI) {
      loadJitsi();
    } else {
      const script = document.createElement("script");
      script.src = `https://8x8.vc/${appId}/external_api.js`;
      script.async = true;
      script.onload = loadJitsi;
      document.body.appendChild(script);
    }
  }, [roomName, userName, isModerator]);

  return <div ref={containerRef} style={{ height: "100vh", width: "100%" }} />;
}
