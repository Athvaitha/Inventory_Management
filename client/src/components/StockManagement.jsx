"use client";
import React, { useState } from "react";
import { useSharedData } from "../../../app/page";

export default function StockManagement() {
  const { items } = useSharedData();
  const [searchTerm, setSearchTerm] = useState("");

  const stockItems = items.map((item) => ({
    productId: item.id,
    itemName: item.name,
    quantity: item.stock,
    minStock: item.minStock,
    purchasePrice: item.purchasePrice,
    stockPrice: item.totalPrice
  }));

  const filteredItems = stockItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = stockItems.filter((item) => item.quantity <= item.minStock);

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="page-title">Stock Management</h2>
          <p className="page-subtitle">Monitor your inventory levels and stock values</p>
        </div>
        {lowStockItems.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 40,
              background: "#fff3cd",
              border: "1px solid #ffeeba",
              borderRadius: 8,
              padding: "1em",
              color: "#856404",
              minWidth: 220,
              zIndex: 10
            }}
          >
            <strong>Low Stock Alert</strong>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {lowStockItems.map((item) => (
                <li key={item.productId}>
                  <span style={{ fontWeight: "bold" }}>{item.productId}</span>: {item.itemName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="search-add-container" style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search stock items..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Min Stock</th>
              <th>Purchase Price</th>
              <th>Stock Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.productId} className={item.quantity <= item.minStock ? "low-stock" : ""}>
                <td
                  style={{
                    color: item.quantity <= item.minStock ? "#dc3545" : "inherit",
                    fontWeight: item.quantity <= item.minStock ? "bold" : "normal"
                  }}
                >
                  {item.productId}
                </td>
                <td>{item.itemName}</td>
                <td
                  style={{
                    color: item.quantity <= item.minStock ? "#dc3545" : "inherit",
                    fontWeight: item.quantity <= item.minStock ? "bold" : "normal"
                  }}
                >
                  {item.quantity}
                </td>
                <td>{item.minStock}</td>
                <td>{item.purchasePrice.toFixed(2)}</td>
                <td>{item.stockPrice.toFixed(2)}</td>
                <td>
                  <span
                    className={`status-badge ${
                      item.quantity <= item.minStock ? "status-low" : "status-normal"
                    }`}
                  >
                    {item.quantity <= item.minStock ? "Low Stock" : "Normal"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffeaa7"
        }}
      >
        <h4 style={{ color: "#856404", marginBottom: "0.5rem" }}>Stock Alert Information</h4>
        <p style={{ color: "#856404", fontSize: "0.9rem" }}>
          Items highlighted in red have quantities at or below their minimum stock levels and require restocking.
        </p>
      </div>
    </div>
  );
}
