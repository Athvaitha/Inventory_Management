import React, { useState } from "react"
import PropTypes from "prop-types"

function VendorManagement({ vendors, setVendors }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    contact: "",
    mailId: "",
    address: "",
    state: "",
    gstNo: "",
    accountNo: "",
    addedDate: "",
  })

  const generateVendorId = () => {
    const nextNumber = vendors.length + 1
    return `VID${nextNumber.toString().padStart(4, "0")}`
  }

  const validateContact = (number) => /^[6-9]\d{9}$/.test(number)
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateContact(formData.contact)) {
      alert("Invalid contact number! Must start with 6-9 and contain exactly 10 digits.")
      return
    }

    if (!validateEmail(formData.mailId)) {
      alert("Invalid email address! Please enter a valid email.")
      return
    }

    if (editingVendor) {
      setVendors(
        vendors.map((vendor) =>
          vendor.id === editingVendor.id ? { ...formData, id: editingVendor.id } : vendor
        )
      )
    } else {
      const newVendor = {
        ...formData,
        id: generateVendorId(),
      }
      setVendors([...vendors, newVendor])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      companyName: "",
      ownerName: "",
      contact: "",
      mailId: "",
      address: "",
      state: "",
      gstNo: "",
      accountNo: "",
      addedDate: "",
    })
    setEditingVendor(null)
    setShowModal(false)
  }

  const handleEdit = (vendor) => {
    setFormData({
      companyName: vendor.companyName,
      ownerName: vendor.ownerName,
      contact: vendor.contact,
      mailId: vendor.mailId,
      address: vendor.address,
      state: vendor.state,
      gstNo: vendor.gstNo,
      accountNo: vendor.accountNo,
      addedDate: vendor.addedDate,
    })
    setEditingVendor(vendor)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((vendor) => vendor.id !== id))
    }
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Vendor Management</h2>
        <p className="page-subtitle">Manage your textile suppliers</p>
      </div>

      <div className="search-add-container">
        <input
          type="text"
          placeholder="Search vendors..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Vendor
        </button>
      </div>

      <div className="cards-grid">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{vendor.companyName}</h3>
                <p className="card-id">{vendor.id}</p>
              </div>
              <div className="card-actions">
                <button className="btn btn-secondary btn-small" onClick={() => handleEdit(vendor)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-small" onClick={() => handleDelete(vendor.id)}>
                  Delete
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="card-field">
                <div className="field-label">Owner Name</div>
                <div className="field-value">{vendor.ownerName}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Contact</div>
                <div className="field-value">{vendor.contact}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Email</div>
                <div className="field-value">{vendor.mailId}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Address</div>
                <div className="field-value">{vendor.address}</div>
              </div>
              <div className="card-field">
                <div className="field-label">State</div>
                <div className="field-value">{vendor.state}</div>
              </div>
              <div className="card-field">
                <div className="field-label">GST No</div>
                <div className="field-value">{vendor.gstNo}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Account No</div>
                <div className="field-value">{vendor.accountNo}</div>
              </div>
              <div className="card-field">
                <div className="field-label">Added Date</div>
                <div className="field-value">{vendor.addedDate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingVendor ? "Edit Vendor" : "Add New Vendor"}</h3>
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
                <label className="form-label">GST No</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.gstNo}
                  onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account No</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.accountNo}
                  onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
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
                  {editingVendor ? "Update Vendor" : "Add Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

VendorManagement.propTypes = {
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      companyName: PropTypes.string.isRequired,
      ownerName: PropTypes.string.isRequired,
      contact: PropTypes.string.isRequired,
      mailId: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      gstNo: PropTypes.string.isRequired,
      accountNo: PropTypes.string.isRequired,
      addedDate: PropTypes.string.isRequired,
    })
  ).isRequired,
  setVendors: PropTypes.func.isRequired,
}

export default VendorManagement
