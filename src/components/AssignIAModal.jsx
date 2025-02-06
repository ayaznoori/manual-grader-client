import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchIAs, assignIAs } from "../redux/actions/iaActions";
import "./AssignIAModal.css";

const AssignIAModal = ({ assessId, closeModal }) => {
  const dispatch = useDispatch();
  const { ias, loading, error } = useSelector((state) => state.ia);
  const [iaAssignments, setIaAssignments] = useState([{ iaId: "", count: 0 }]);
 
  useEffect(() => {
    dispatch(fetchIAs());
  }, [dispatch]);

  // Handle IA selection
  const handleIAChange = (index, iaId) => {
    setIaAssignments((prev) => {
      const updated = [...prev];
      updated[index].iaId = iaId;
      return updated;
    });
  };

  // Handle submission count input
  const handleCountChange = (index, count) => {
    setIaAssignments((prev) => {
      const updated = [...prev];
      updated[index].count = count > 0 ? count : 0;
      return updated;
    });
  };

  // Add another IA selection field
  const addMoreIA = () => {
    setIaAssignments([...iaAssignments, { iaId: "", count: 0 }]);
  };

  // Remove an IA selection field
  const removeIA = (index) => {
    setIaAssignments((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit the IA assignment
  const handleSubmit = () => {
    const validAssignments = iaAssignments.filter((item) => item.iaId && item.count > 0);
    if (validAssignments.length === 0) {
      alert("Please select at least one IA with a valid count.");
      return;
    }
    dispatch(assignIAs(assessId, validAssignments));
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Assign I.A</h3>

        {loading && <p>Loading IAs...</p>}
        {error && <p className="error-text">{error}</p>}
        <table className="ia-table">
          <thead>
            <tr>
              <th>Select IA</th>
              <th>Submissions to Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {iaAssignments.map((assignment, index) => (
              <tr key={index}>
                <td>
                  <select value={assignment.iaId} onChange={(e) => handleIAChange(index, e.target.value)}>
                    <option value="">Select IA</option>
                    {ias && ias.map((ia) => (
                      <option key={ia._id} value={ia._id}>{ia.name} ({ia.email})</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={assignment.count}
                    onChange={(e) => handleCountChange(index, parseInt(e.target.value))}
                  />
                </td>
                <td>
                  {iaAssignments.length > 1 && (
                    <button className="remove-btn" onClick={() => removeIA(index)}>Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-more-btn" onClick={addMoreIA}>+ Add More</button>

        <div className="modal-actions">
          <button onClick={closeModal}>Cancel</button>
          <button onClick={handleSubmit}>Assign</button>
        </div>
      </div>
    </div>
  );
};

export default AssignIAModal;
