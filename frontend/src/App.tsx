import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useWriteContract } from "wagmi";
import { scrollSepolia } from "viem/chains";
import { CONTRACTS } from "./lib/config";
import { credentialVerifierAbi } from "./lib/abi";
import { generateProof, toContractArgs } from "./lib/proof";
import "./App.css";

type Tab = "adult" | "balance";

export default function App() {
  const { address, chainId, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();

  const [tab, setTab] = useState<Tab>("adult");
  const [birthdate, setBirthdate] = useState("20000115");
  const [currentYear, setCurrentYear] = useState("2026");
  const [balance, setBalance] = useState("10000");
  const [threshold, setThreshold] = useState("5000");
  const [status, setStatus] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  const contractConfigured = CONTRACTS.credentialVerifier !== "0x";

  async function handleGenerateAndSubmit() {
    if (!isConnected) {
      setStatus("Connect wallet first");
      return;
    }
    if (chainId !== scrollSepolia.id) {
      await switchChain({ chainId: scrollSepolia.id });
    }
    if (!contractConfigured) {
      setStatus("Set VITE_CREDENTIAL_VERIFIER in .env after deploying contracts");
      return;
    }

    try {
      setGenerating(true);
      setStatus("Generating ZK proof locally...");

      const input =
        tab === "adult"
          ? { birthdate: Number(birthdate), currentYear: Number(currentYear) }
          : { balance: Number(balance), threshold: Number(threshold) };

      const circuit = tab === "adult" ? "is_adult" : "is_balance_above";
      const bundle = await generateProof(circuit, input);
      const args = toContractArgs(bundle);

      setStatus("Submitting proof to Scroll Sepolia...");
      const fn = tab === "adult" ? "verifyAdult" : "verifyBalance";
      const hash = await writeContractAsync({
        account: address,
        chain: scrollSepolia,
        address: CONTRACTS.credentialVerifier,
        abi: credentialVerifierAbi,
        functionName: fn,
        args: [args.pA, args.pB, args.pC, args.pub],
      });

      setStatus(`Success! Tx: ${hash}`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>L2 Privacy Credentials</h1>
        <p>Prove age or balance with zero-knowledge proofs on Scroll Sepolia</p>
      </header>

      <section className="card">
        {!isConnected ? (
          <button onClick={() => connect({ connector: connectors[0] })}>Connect MetaMask</button>
        ) : (
          <div className="wallet-row">
            <span>{address}</span>
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        )}
      </section>

      <section className="card tabs">
        <button className={tab === "adult" ? "active" : ""} onClick={() => setTab("adult")}>
          Is Adult
        </button>
        <button className={tab === "balance" ? "active" : ""} onClick={() => setTab("balance")}>
          Balance Above
        </button>
      </section>

      <section className="card">
        {tab === "adult" ? (
          <>
            <label>
              Birthdate (YYYYMMDD)
              <input value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
            </label>
            <label>
              Current Year (public)
              <input value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} />
            </label>
          </>
        ) : (
          <>
            <label>
              Balance (private)
              <input value={balance} onChange={(e) => setBalance(e.target.value)} />
            </label>
            <label>
              Threshold (public)
              <input value={threshold} onChange={(e) => setThreshold(e.target.value)} />
            </label>
          </>
        )}

        <button
          disabled={generating || isPending}
          onClick={handleGenerateAndSubmit}
          className="primary"
        >
          {generating || isPending ? "Working..." : "Generate Proof & Submit"}
        </button>

        {status && <p className="status">{status}</p>}
      </section>
    </div>
  );
}
