"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BadgeMessage } from "@/types";

export default function BadgeListener() {
  const router = useRouter();

  useEffect(() => {
    // WebSocket connection URL
    const wsUrl = "ws://localhost:8000";
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    // Function to connect to WebSocket
    const connectWebSocket = () => {
      console.log("Connecting to NFC Reader WebSocket...");

      // Create a new WebSocket connection
      ws = new WebSocket(wsUrl);

      // Connection opened
      ws.onopen = () => {
        console.log("Connected to NFC Reader WebSocket");
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      // Connection closed
      ws.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        ws = null;

        // Only attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts})`);

          if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
          }

          reconnectTimeout = setTimeout(connectWebSocket, delay);
        }
      };

      // Connection error
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Message received
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Received message:", message);

          // Handle badge message
          if (message.type === "badge" && message.id) {
            const badgeMessage = message as BadgeMessage;
            console.log(`Badge detected: ${badgeMessage.id}`);

            // Navigate to team-info page with the badge ID
            const badgeId = badgeMessage.id;
            router.push(`/team-info/${badgeId}`);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    };

    // Initial connection
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close(1000, "Component unmounted");
      }

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [router]);

  // This component doesn't render anything visible
  return null;
}
