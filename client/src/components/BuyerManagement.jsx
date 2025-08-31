import React, { useState } from "react";

export default function BuyerManagement() {
  const [buyers, setBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    contact: "",
    mailId: "",
    address: "",
    state: "",
    itemsDelivered: "",
    addedDate: "",
  });
  const [errors, setErrors] = useState({});

  const generateBuyerId = () => {
    const nextNumber = buyers.length + 1;
    return `BID${nextNumber.toString().padStart(4, "0")}`;
  };

  const validateForm = () => {
    let newErrors = {};

    // Contact validation: starts with 6-9 and contains exactly 10 digits
    if (!/^[6-9]\d{9}$/.test(formData.contact)) {
      newErrors.contact = "Contact must start with 6-9 and contain exactly 10 digits.";
    }

    // Email validation: basic pattern check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mailId)) {
      newErrors.mailId = "Enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const itemsArray = formData.itemsDelivered
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    if (editingBuyer) {
      setBuyers(
        buyers.map((buyer) =>
          buyer.id === editingBuyer.id
            ? { ...formData, id: editingBuyer.id, itemsDelivered: itemsArray }
            : buyer
        )
      );
    } else {
      const newBuyer = {
        ...formData,
        id: generateBuyerId(),
        itemsDelivered: itemsArray,
      };
      setBuyers([...buyers, newBuyer]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      ownerName: "",
      contact: "",
      mailId: "",
      address: "",
      state: "",
      itemsDelivered: "",
      addedDate: "",
    });
    setEditingBuyer(null);
    setShowModal(false);
    setErrors({});
  };

  const handleEdit = (buyer) => {
    setFormData({
      companyName: buyer.companyName,
      ownerName: buyer.ownerName,
      contact: buyer.contact,
      mailId: buyer.mailId,
      address: buyer.address,
      state: buyer.state,
      itemsDelivered: buyer.itemsDelivered.join(", "),
      addedDate: buyer.addedDate,
    });
    setEditingBuyer(buyer);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this buyer?")) {
      setBuyers(buyers.filter((buyer) => buyer.id !== id));
    }
  };

  const filteredBuyers = buyers.filter(
    (buyer) =>
      buyer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Buyer Management</h2>
        <p className="page-subtitle">Manage your textile buyers</p>
      </div>

      <div className="search-add-container">
        <input
          type="text"
          placeholder="Search buyers..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Buyer
        </button>
      </div>

      <div className="cards-grid">
        {filteredBuyers.map((buyer) => (
          <div key={buyer.id} className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{buyer.companyName}</h3>
                <p className="card-id">{buyer.id}</p>
              </div>
              <div className="card-actions">
                <button className="btn btn-secondary btn-small" onClick={() => handleEdit(buyer)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-small" onClick={() => handleDelete(buyer.id)}>
                  Delete
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="card-field">
                <div className="field-label">Owner Name</div>
                <div className="field-value">{buyer.ownerName}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Contact</div>
                <div className="field-value">{buyer.contact}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Email</div>
                <div className="field-value">{buyer.mailId}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Address</div>
                <div className="field-value">{buyer.address}</div>
              </div>
              <div className="card-field">
                <div className="field-label">State</div>
                <div className="field-value">{buyer.state}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Items Delivered</div>
                <div className="field-value">{buyer.itemsDelivered.join(", ")}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Added Date</div>
                <div className="field-value">{buyer.addedDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingBuyer ? "Edit Buyer" : "Add New Buyer"}</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
                {errors.contact && <p className="error-text">{errors.contact}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email ID</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.mailId}
                  onChange={(e) => setFormData({ ...formData, mailId: e.target.value })}
                  required
                />
                {errors.mailId && <p className="error-text">{errors.mailId}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Items Delivered (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.itemsDelivered}
                  onChange={(e) => setFormData({ ...formData, itemsDelivered: e.target.value })}
                  placeholder="Cotton Fabric, Silk Thread, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Added Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.addedDate}
                  onChange={(e) => setFormData({ ...formData, addedDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBuyer ? "Update Buyer" : "Add Buyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
