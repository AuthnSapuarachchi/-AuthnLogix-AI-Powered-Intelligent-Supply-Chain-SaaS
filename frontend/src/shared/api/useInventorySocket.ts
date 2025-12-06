import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useQueryClient } from '@tanstack/react-query';

export const useInventorySocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socketUrl = import.meta.env.DEV 
        ? 'http://localhost:8080/ws' 
        : '/ws'; // Nginx will handle the proxy
    // 1. Create the Client
    const client = new Client({
      // We use SockJS factory because standard WS might be blocked by some firewalls
      webSocketFactory: () => new SockJS(socketUrl),
      onConnect: () => {
        console.log("🟢 Connected to WebSocket");

        // 2. Subscribe to the Topic
        client.subscribe('/topic/inventory', (message) => {
          if (message.body === 'REFRESH_NEEDED') {
            console.log("⚡ Real-time Update Received! Refetching...");
            
            // 3. Invalidate Queries (Force Refresh)
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
          }
        });
      },
      onStompError: (frame) => {
        console.error('🔴 Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    // 4. Activate Connection
    client.activate();

    // 5. Cleanup on Unmount
    return () => {
      client.deactivate();
    };
  }, [queryClient]);
};