import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssignments, createAssignment, deleteAssignment } from "../redux/actions/assignmentAction";

const AssignmentsList = () => {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector((state) => state.assignments);
  console.log({ assignments, loading, error },"jjjj")
  const [showModal, setShowModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", assessId: "" });

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleCreate = () => {
    dispatch(createAssignment(newAssignment));
    setShowModal(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteAssignment(id));
  };

  return (
    <div>
      <h2>Assignments</h2>
      <button onClick={() => setShowModal(true)}>Create Assignment</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assess ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments &&  assignments.map((assignment) => (
            <tr key={assignment._id}>
              <td>{assignment.title}</td>
              <td>{assignment.description}</td>
              <td>{assignment.assessId}</td>
              <td>
                <button onClick={() => window.location.href = `/assignment/${assignment.assessId}`}>View</button>
                <button onClick={() => handleDelete(assignment._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <h3>Create Assignment</h3>
          <input type="text" placeholder="Title" onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
          <input type="text" placeholder="Description" onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
          <input type="text" placeholder="Assess ID" onChange={(e) => setNewAssignment({ ...newAssignment, assessId: e.target.value })} />
          <button onClick={handleCreate}>Create</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AssignmentsList;
