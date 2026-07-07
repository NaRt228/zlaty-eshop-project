"use client";
import { useState } from "react";

export default function TestEmail() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setStatus("");
    setError("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "zlatyehsop@gmail.com",
          orderId: "TEST-12345",
          guestName: "Test User",
          guestPhone: "+420123456789",
          guestAddress: "Test Street 123, Prague, 12000, CZ",
          totalAmount: 999,
          items: [
            { name: "Testovací šperk 1", quantity: 1, price: 999 }
          ]
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("E-mail successfully sent! Status: " + res.status);
      } else {
        setError(`Failed to send: ${data.message || res.statusText} (Status: ${res.status})`);
      }
    } catch (err: any) {
      setError("Fetch error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-2xl font-light mb-6">Testování e-mailů</h1>
        
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-6 py-3 bg-white text-black font-semibold uppercase tracking-wider text-sm hover:bg-neutral-200 transition duration-300 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Odesílání..." : "Odeslat testovací e-mail"}
        </button>

        {status && (
          <div className="mt-6 p-4 bg-green-950/30 border border-green-800 text-green-400 text-sm rounded">
            {status}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-950/30 border border-red-800 text-red-400 text-sm rounded text-left overflow-auto max-h-40">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
