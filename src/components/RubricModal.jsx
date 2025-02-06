import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRubrics, createRubric, editRubric, deleteRubric } from "../redux/actions/rubricActions";
import './RubricModel.css'

const RubricModal = ({assessmentID, assessId, closeModal }) => {
  const dispatch = useDispatch();
  const { rubrics, loading, error } = useSelector((state) => state.rubrics);
  const [newRubric, setNewRubric] = useState({ criteria: "", marks: "" });
  const [editingRubric, setEditingRubric] = useState(null);
  console.log(assessmentID, assessId);
  useEffect(() => {
    dispatch(fetchRubrics(assessId));
  }, [dispatch, assessId]);

  const handleAddRubric = () => {
    if (newRubric.criteria && newRubric.marks) {
      dispatch(createRubric(assessmentID,newRubric));
      setNewRubric({ criteria: "", marks: "" }); // Clear inputs
    }
  };

  const handleEditRubric = (rubric) => {
    setEditingRubric(rubric);
    setNewRubric({ criteria: rubric.criteria, marks: rubric.marks });
  };

  const handleUpdateRubric = () => {
    if (editingRubric) {
      dispatch(editRubric(editingRubric._id, newRubric.criteria, newRubric.marks));
      setEditingRubric(null);
      setNewRubric({ criteria: "", marks: "" });
    }
  };

  const handleDeleteRubric = (rubricId) => {
    dispatch(deleteRubric(rubricId));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Manage Rubrics</h3>
        {loading && <p>Loading rubrics...</p>}
        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          placeholder="Criteria"
          value={newRubric.criteria}
          onChange={(e) => setNewRubric({ ...newRubric, criteria: e.target.value })}
        />
        <input
          type="number"
          placeholder="Marks"
          value={newRubric.marks}
          onChange={(e) => setNewRubric({ ...newRubric, marks: e.target.value })}
        />
        <button onClick={editingRubric ? handleUpdateRubric : handleAddRubric}>
          {editingRubric ? "Update Rubric" : "Add Rubric"}
        </button>

        <div className="rubrics-table-container">
          <h4>Existing Rubrics</h4>
          <table className="rubrics-table">
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rubrics.map((rubric) => (
                <tr key={rubric._id}>
                  <td>{rubric.criteria}</td>
                  <td>{rubric.marks}</td>
                  <td>
                    <button onClick={() => handleEditRubric(rubric)}>Edit</button>
                    <button onClick={() => handleDeleteRubric(rubric._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default RubricModal;
