import React, { useEffect, useRef, useState } from "react";

export default function InvoicePage() {
  const [billNo, setBillNo] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [items, setItems] = useState([]); // { barcode, name, qty, rate }
  const [manualCode, setManualCode] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    // Fetch buyers from your backend or localStorage here
    setBuyers([]);
  }, []);

  function handleBuyerChange(id) {
    setSelectedBuyer(id);
    const buyer = buyers.find((b) => b.id === id);
    setBuyerAddress(buyer ? buyer.address : "");
  }

  function handleScanned(barcode) {
    const code = String(barcode || "").trim();
    if (!code) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.barcode === code);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].qty += 1;
        return updated;
      }
      return [...prev, { barcode: code, name: "", qty: 1, rate: 0 }];
    });
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index, patch) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  const total = items.reduce((sum, item) => sum + (item.qty || 0) * (item.rate || 0), 0);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>VP Fashions</h1>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <label>Buyer: </label>
          <select value={selectedBuyer} onChange={(e) => handleBuyerChange(e.target.value)}>
            <option value="">Select Buyer</option>
            {buyers.map((b) => (
              <option key={b.id} value={b.id}>{b.companyName}</option>
            ))}
          </select>
          <textarea
            placeholder="Buyer address"
            value={buyerAddress}
            onChange={(e) => setBuyerAddress(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <div>
            <label>Bill No: </label>
            <input value={billNo} onChange={(e) => setBillNo(e.target.value)} />
          </div>
          <div>
            <label>Date: </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Scan or enter barcode"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleScanned(manualCode);
              setManualCode("");
            }
          }}
        />
        <button onClick={() => { handleScanned(manualCode); setManualCode(""); }}>Add</button>
      </div>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>PARTICULARS</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.barcode}>
              <td>{index + 1}</td>
              <td>
                <input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => updateItem(index, { name: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={item.qty}
                  onChange={(e) => updateItem(index, { qty: parseInt(e.target.value, 10) || 0 })}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateItem(index, { rate: parseFloat(e.target.value) || 0 })}
                />
              </td>
              <td>{(item.qty * item.rate).toFixed(2)}</td>
              <td>
                <button onClick={() => removeItem(index)}>Remove</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No items added</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: 20, textAlign: "right" }}>
        <strong>Total: </strong> {total.toFixed(2)}
      </div>

      <div style={{ marginTop: 20, textAlign: "right" }}>For VP Fashions</div>
    </div>
  );
}
