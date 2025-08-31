"use client";

import React, { useState } from "react";
import { useSharedData } from "../../../app/page";
import BarcodeGenerator from "./BarcodeGenerator";

export default function ItemManagement() {
  const { vendors, items, setItems } = useSharedData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    materialType: "",
    vendorName: "",
    image: "",
    purchasePrice: 0,
    stock: 0,
    minStock: 0,
    dateOfPurchase: "",
    phoneNumber: "",
    mailId: ""
  });

  const generateProductId = () => {
    const nextNumber = items.length + 1;
    return `IM001VP${nextNumber.toString().padStart(4, "0")}`;
  };

  const validatePhoneNumber = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phoneNumber)) {
      alert("Invalid phone number! It must start with 6-9 and contain 10 digits.");
      return;
    }

    if (!validateEmail(formData.mailId)) {
      alert("Invalid email address!");
      return;
    }

    const totalPrice = formData.stock * formData.purchasePrice;

    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? { ...formData, id: editingItem.id, totalPrice }
            : item
        )
      );
    } else {
      const newItem = {
        ...formData,
        id: generateProductId(),
        totalPrice
      };
      setItems([...items, newItem]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      materialType: "",
      vendorName: "",
      image: "",
      purchasePrice: 0,
      stock: 0,
      minStock: 0,
      dateOfPurchase: "",
      phoneNumber: "",
      mailId: ""
    });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      materialType: item.materialType,
      vendorName: item.vendorName,
      image: item.image,
      purchasePrice: item.purchasePrice,
      stock: item.stock,
      minStock: item.minStock,
      dateOfPurchase: item.dateOfPurchase,
      phoneNumber: item.phoneNumber || "",
      mailId: item.mailId || ""
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Item Management</h2>
        <p className="page-subtitle">Manage your textile inventory items</p>
      </div>

      <div className="search-add-container">
        <input
          type="text"
          placeholder="Search items..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Item
        </button>
      </div>

      <div className="cards-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{item.name}</h3>
                <p className="card-id">{item.id}</p>
              </div>
              <div className="card-actions">
                <button className="btn btn-secondary btn-small" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-small" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>

            {item.image && <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />}

            <BarcodeGenerator itemId={item.id} itemName={item.name} />

            <div className="card-body">
              <div className="card-field">
                <div className="field-label">Material Type</div>
                <div className="field-value">{item.materialType}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Vendor</div>
                <div className="field-value">{item.vendorName}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Purchase Price</div>
                <div className="field-value">{item.purchasePrice.toFixed(2)}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Stock</div>
                <div className="field-value">{item.stock} units</div>
              </div>
              <div className="card-field">
                <div className="field-label">Min Stock</div>
                <div className="field-value">{item.minStock} units</div>
              </div>
              <div className="card-field">
                <div className="field-label">Total Price</div>
                <div className="field-value">{item.totalPrice.toFixed(2)}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Purchase Date</div>
                <div className="field-value">{item.dateOfPurchase}</div>
              </div>
              {item.phoneNumber && (
                <div className="card-field">
                  <div className="field-label">Phone</div>
                  <div className="field-value">{item.phoneNumber}</div>
                </div>
              )}
              {item.mailId && (
                <div className="card-field">
                  <div className="field-label">Email</div>
                  <div className="field-value">{item.mailId}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? "Edit Item" : "Add New Item"}</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Material Type</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.materialType}
                  onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vendor Name</label>
                <select
                  className="form-input"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  required
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.companyName}>
                      {vendor.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="e.g., 9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.mailId}
                  onChange={(e) => setFormData({ ...formData, mailId: e.target.value })}
                  placeholder="e.g., vendor@mail.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Picture Upload</label>
                <input type="file" className="file-input" accept="image/*" onChange={handleImageUpload} />
                {formData.image && (
                  <img src={formData.image || "/placeholder.svg"} alt="Preview" className="image-preview" />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Purchase Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formData.purchasePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, purchasePrice: Math.max(0, parseFloat(e.target.value) || 0) })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min Stock</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minStock: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Purchase</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dateOfPurchase}
                  onChange={(e) => setFormData({ ...formData, dateOfPurchase: e.target.value })}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
