import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, injected } from "wagmi";
import { scrollSepolia } from "viem/chains";
import App from "./App";
import "./index.css";

const config = createConfig({
  chains: [scrollSepolia],
  connectors: [injected()],
  transports: {
    [scrollSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
