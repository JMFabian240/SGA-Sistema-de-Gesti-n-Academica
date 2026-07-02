import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './lib/trpc';
import { queryClient } from './lib/query-client';
import { router } from './router';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const token = useAuth(state => state.token);
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          // Pasamos el token en cada request
          headers() {
            return {
              Authorization: token ? `Bearer ${token}` : undefined,
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
