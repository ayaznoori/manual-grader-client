import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAssignments,
  createAssignment,
  deleteAssignment,
  updateAssignment,
} from "../redux/actions/assignmentAction";
import Cookies from "js-cookie"; 
import {  createRubric } from "../redux/actions/rubricActions";
import { Navigate, useNavigate } from "react-router-dom";
import "./AssignmentList.css"; // Ensure this file is included in your project
import RubricModal from "../components/RubricModal";
import { fetchSubmissionsAll } from "../redux/actions/submissionAction";
import UploadCSVModal from "../components/UploadCSV";
const AssignmentsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId=Cookies.get('userid');
  const role=Cookies.get('role');
  const { assignments, loading, error } = useSelector((state) => state.assignments);
  const { rubrics } = useSelector((state) => state.rubrics);
  const [showModal, setShowModal] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", assessId: "",batch:"",section:"",evaluationType:"",evaluationDate:"" });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const { submissions } = useSelector((state) => state.submissions);
  const [isModalOpen, setModalOpen] = useState(false);
    // State to manage the modal visibility and the selected assignment's assessId
  const [selectedAssignId, setSelectedAssignId] = useState(null);

  const isAdmin = role === "admin" || role === "super_admin"; // Check if user is admin 
  // Filter assignments: Admin sees all, Users see only assigned ones
  const filteredAssignments = isAdmin
    ? assignments
    : assignments.filter((assignment) =>
        submissions.some((sub) => sub.assessId === assignment.assessId && sub.gradedBy === userId)
      );
      useEffect(() => {
        dispatch(fetchSubmissionsAll());
        dispatch(fetchAssignments());
      }, [dispatch]);

  const handleCreate = () => {
    dispatch(createAssignment(newAssignment));
    setShowModal(null);
  };

  const handleEdit = () => {
    dispatch(updateAssignment(selectedAssignment._id, selectedAssignment));
    setShowModal(null);
  };


  const handleManageRubrics = (assignment) => {
    // Open the modal by setting selectedAssignId to the clicked assessId
    setSelectedAssignId(assignment);
  };
  const closeModal = () => {
    // Close the modal by resetting selectedAssignId to null
    setSelectedAssignId(null);
  };
  // Function to determine assignment status
  const getStatus = (assignment, submissions) => {
    const today = new Date();
    const evaluationDate = new Date(assignment.evaluationDate);
    const hasRubrics = assignment.rubrics && assignment.rubrics.length > 0;
    const assignmentSubmissions = submissions.filter(sub => sub.assessId === assignment.assessId);

    const submissionsReceived = assignmentSubmissions.length > 0;
    const allSubmissionsGraded = assignmentSubmissions.length > 0 && assignmentSubmissions.every(sub => sub.status === "Graded");
    const someSubmissionsGraded = assignmentSubmissions.some(sub => sub.status === "Graded");
    const allSubmissionsAssigned = assignmentSubmissions.length > 0 && assignmentSubmissions.every(sub => sub.gradedBy);
    const someSubmissionsAssigned = assignmentSubmissions.some(sub => sub.gradedBy);

    if (!hasRubrics) return "Rubrics not defined";
    
    if (today < evaluationDate) return "Upcoming Evaluation";
    
    if (!submissionsReceived) return "Submissions Pending";

    if (submissionsReceived && today >= evaluationDate && !someSubmissionsAssigned) return "Submissions Received";

    if (someSubmissionsAssigned && !allSubmissionsAssigned) return "Grading Assigned";

    if (allSubmissionsAssigned && !allSubmissionsGraded) return "Grading Pending";

    if (allSubmissionsGraded) return "Grading Complete";

    return "Unknown Status";
};

  
  return (
    <div style={{paddingTop:"50px"}}>
      <h2>Assignments</h2>
      {isAdmin && (
        <div className="admin-actions">
          <button onClick={() => setShowModal("create")}>Create Assignment</button>
          <button onClick={() =>  navigate("/register")}>Create User</button>
          <button onClick={() => setModalOpen(true)}>Upload Bulk Submission</button>
          <UploadCSVModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
     <div className="submissions-container">
      <table className="submissions-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Batch</th>
            <th>Section</th>
            <th>Evaluation Type</th>
            <th>Evaluation Date</th>
            <th>Assess ID</th>
            <th>Status</th>
            <th>View</th>
              {isAdmin && <th>Edit</th>}
              {isAdmin && <th>Rubrics</th>}
              {isAdmin && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {filteredAssignments &&
            filteredAssignments.map((assignment)=>{
              const status = getStatus(assignment, submissions); 
              const statusClass = status.toLowerCase().replace(/\s+/g, "-");
              return <tr key={assignment._id}>
                <td>{assignment.title}</td>
                <td>{assignment.description}</td>
                <td>{assignment.batch}</td>
                <td>{assignment.section}</td>
                <td>{assignment.evaluationType}</td>
                <td>{new Date(assignment.evaluationDate).toLocaleDateString("hi-IN")}</td>
                <td>{assignment.assessId}</td>
                <td className={`status-${statusClass}`}>{status}</td>  
                <td>
                  <button onClick={() => navigate(`/assignment/${assignment.assessId}`)}>View</button>
                </td>
               {/* These buttons are only visible to admins */}
               {isAdmin && (
                    <>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowModal("edit");
                          }}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleManageRubrics(assignment)}>Manage Rubrics</button>
                      </td>
                      <td>
                        <button onClick={() => dispatch(deleteAssignment(assignment._id))}>Delete</button>
                      </td>
                    </>
                  )}
              </tr>
            })}
        </tbody>
      </table>
      </div>
      {/* Generic Modal */}
      {selectedAssignId && (
        <RubricModal
          assessmentID={selectedAssignId._id}
          assessId={selectedAssignId.assessId}
          closeModal={closeModal}
        />
      )}
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(null)}>X</button>

            {showModal === "create" && (
              <>
                <h3>Create Assignment</h3>
                <input type="text" placeholder="Title" onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                <input type="text" placeholder="Description" onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
                <input type="text" placeholder="Assess ID" onChange={(e) => setNewAssignment({ ...newAssignment, assessId: e.target.value })} />
                <input type="text" placeholder="Batch" onChange={(e) => setNewAssignment({ ...newAssignment, batch: e.target.value })} />
                <input type="text" placeholder="Section" onChange={(e) => setNewAssignment({ ...newAssignment, section: e.target.value })} />
                <input type="text" placeholder="Evaluation Type" onChange={(e) => setNewAssignment({ ...newAssignment, evaluationType: e.target.value })} />
                <input type="date" placeholder="Evaluation Date" onChange={(e) => setNewAssignment({ ...newAssignment, evaluationDate: e.target.value })} />
                <button onClick={handleCreate}>Create</button>
              </>
            )}

            {showModal === "edit" && selectedAssignment && (
              <>
                <h3>Edit Assignment</h3>
                <input type="text" value={selectedAssignment?.title} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, title: e.target.value })} />
                <input type="text" value={selectedAssignment?.description} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, description: e.target.value })} />
                <input type="text" value={selectedAssignment?.batch} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, batch: e.target.value })} />
                <input type="text" value={selectedAssignment?.section} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, section: e.target.value })} />
                <input type="text" value={selectedAssignment?.evaluationType} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, evaluationType: e.target.value })} />
                <input type="date" value={selectedAssignment?.evaluationDate} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, evaluationDate: e.target.value })} />
                <input type="text" value={selectedAssignment?.assessId} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, assessId: e.target.value })} />
                <button onClick={handleEdit}>Update</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsList;
