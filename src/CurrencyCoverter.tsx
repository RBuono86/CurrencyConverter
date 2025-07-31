import React, { useState, useEffect } from "react";

const CURRENCY_API_URL = "https://open.er-api.com/v6/latest/";

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "INR",
  "BRL",
];

const CurrencyConverter: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchRate() {
      try {
        setError("");
        setRate(null);
        const res = await fetch(`${CURRENCY_API_URL}${fromCurrency}`);
        const data = await res.json();
        if (data.result === "success") {
          const rate = data.rates[toCurrency];
          if (!rate) throw new Error("Invalid currency");
          setRate(rate);
        } else {
          throw new Error("Failed to fetch rates");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      }
    }
    fetchRate();
  }, [fromCurrency, toCurrency]);

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h2>Currency Converter</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          Amount:
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ marginLeft: 8, width: 100 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          From:
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          To:
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {rate !== null && (
          <p>
            {amount} {fromCurrency} = {(amount * rate).toFixed(4)} {toCurrency}
          </p>
        )}
        {rate === null && !error && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default CurrencyConverter;
