import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UploadCSV.css";
import { bulkUploadCSV } from "../redux/actions/submissionAction";

const UploadCSVModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.uploadSubmission
  );

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      dispatch(bulkUploadCSV(file));
    }
  };

  if (!isOpen) return null; // Prevents rendering if modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <br/>
        <h2>Upload Bulk Submissions (CSV)</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
         
        <a href="/sample.csv" target="_blank" download>Download Sample CSV</a><br/>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
        {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default UploadCSVModal;
