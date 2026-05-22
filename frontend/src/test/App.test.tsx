import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../App";

vi.mock("wagmi", () => ({
  useAccount: () => ({ isConnected: false }),
  useConnect: () => ({ connect: vi.fn(), connectors: [{ id: "injected" }] }),
  useDisconnect: () => ({ disconnect: vi.fn() }),
  useSwitchChain: () => ({ switchChain: vi.fn() }),
  useWriteContract: () => ({ writeContractAsync: vi.fn(), isPending: false }),
}));

describe("App", () => {
  it("renders connect wallet and proof tabs", () => {
    render(<App />);
    expect(screen.getByText("L2 Privacy Credentials")).toBeInTheDocument();
    expect(screen.getByText("Connect MetaMask")).toBeInTheDocument();
    expect(screen.getByText("Is Adult")).toBeInTheDocument();
    expect(screen.getByText("Balance Above")).toBeInTheDocument();
  });
});
