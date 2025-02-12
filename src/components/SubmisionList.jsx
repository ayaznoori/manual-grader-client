import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSubmissions, updateIA, updateSubmission } from "../redux/actions/submissionAction";
import { fetchRubrics } from "../redux/actions/rubricActions";
import { useParams } from "react-router-dom";
import "./Submission.css";
import AssignIAModal from "./AssignIAModal";
import { fetchIAs } from "../redux/actions/iaActions";
import Cookies from "js-cookie";

const SubmissionsList = () => {
  const { assessId } = useParams();
  const dispatch = useDispatch();
  const { submissions, loading, error } = useSelector((state) => state.submissions);
  const { rubrics } = useSelector((state) => state.rubrics);
  const [showIAModal, setShowIAModal] = useState(false);
  const [selectedRubrics, setSelectedRubrics] = useState({});
  const { ias } = useSelector((state) => state.ia);
  const [selectedIA, setSelectedIA] = useState({});
  const [remark,setRemark]=useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionToUpdate, setSubmissionToUpdate] = useState(null);

  const handleChangeIA = (submissionId, newIaId) => {
    setSelectedIA({ ...selectedIA, [submissionId]: newIaId });
    setSubmissionToUpdate({ submissionId, newIaId });
    setShowConfirmModal(true); // Open confirmation modal
  };

  const handleConfirmUpdate = () => {
    if (submissionToUpdate) {
      dispatch(updateIA(submissionToUpdate.submissionId, submissionToUpdate.newIaId));
      setShowConfirmModal(false);
    }
  };
  const role = Cookies.get('role');
  const userId = Cookies.get('userid');
  const filteredSubmissions = role === "admin" || role === "super-admin"
    ? submissions // Show all submissions
    : submissions.filter((s) => s?.gradedBy?._id === userId); // Show only assigned ones
  useEffect(() => {
    dispatch(fetchSubmissions(assessId));
    dispatch(fetchRubrics(assessId));
    dispatch(fetchIAs());
  }, [dispatch, assessId]);

  const isAdmin = role === "admin" || role === "super_admin"; // Check if user is admin 
  // Auto-fill selected rubrics from API data
  useEffect(() => {
    const preSelectedRubrics = {};
    submissions.forEach((submission) => {
      preSelectedRubrics[submission.submissionId] = submission.rubricsSelected.map(rubric => rubric.toString());
    });
    setSelectedRubrics(preSelectedRubrics);
  }, [submissions]);


  // Handle checkbox selection
  const handleRubricSelection = (submissionId, rubricId) => {
    setSelectedRubrics((prev) => {
      const updated = { ...prev };
      if (!updated[submissionId]) {
        updated[submissionId] = [];
      }
      const rubricIdStr = rubricId.toString();
      if (updated[submissionId].includes(rubricIdStr)) {
        updated[submissionId] = updated[submissionId].filter((id) => id !== rubricIdStr);
      } else {
        updated[submissionId].push(rubricIdStr);
      }
      return updated;
    });
  };


  // Calculate total marks obtained
  const calculateTotalMarksObtained = (submission) => {
    return submission.rubricsSelected.reduce((total, rubricId) => {
      const rubric = rubrics.find((r) => r._id === rubricId);
      return rubric ? total + rubric.marks : total;
    }, 0);
  };

  // Handle submission grading
  const handleSubmitGrading = async (submissionId) => {
    const selected = selectedRubrics[submissionId] || [];
    const totalMarksObtained = calculateTotalMarksObtained({
      rubricsSelected: selected,
    });
    await dispatch(updateSubmission(submissionId, {
      rubricsSelected: selected,
      totalMarks: totalMarksObtained,
      status: selected.length>0 ? "Graded" : "Pending",
      remark: remark
    }));
    // Fetch updated submissions after grading
    dispatch(fetchSubmissions(assessId));
  };

  const totalGraded = submissions.filter((s) => s.status === "Graded").length;
  const totalPending = submissions.filter((s) => s.status === "Pending").length;
  const totalAssigned = submissions.filter((s) => s.gradedBy).length;
  const totalUnassigned = submissions.length - totalAssigned;

  return (
    <div style={{ paddingTop: "100px" }}>
      <h2>Submissions for Assessment: {assessId}</h2>
      <div className="submissions-container">
        {isAdmin && <div className="submission-stats">
          <div className="stat graded">
            <p>Total Graded</p>
            <span>{totalGraded}</span>
          </div>
          <div className="stat pending">
            <p>Total Pending</p>
            <span>{totalPending}</span>
          </div>
          <div className="stat assigned">
            <p>Total Assigned</p>
            <span>{totalAssigned}</span>
          </div>
          <div className="stat unassigned">
            <p>Total Unassigned</p>
            <span>{totalUnassigned}</span>
          </div>
        </div>}

        {isAdmin && <button onClick={() => setShowIAModal(true)}>Assign IA</button>}
        {showIAModal && (
          <AssignIAModal
            assessId={assessId}
            closeModal={() => {
              console.log("Closing Modal...");
              setShowIAModal(false);
            }}
          />
        )}

        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="table-wrapper">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Submission ID</th>
                <th>Student Code</th>
                <th>Submitted At</th>
                <th>Submission Link 1</th>
                <th>Submission Link 2</th>
                <th>Submission Link 3</th>
                <th>Graded By I.A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                <th>Status</th>
                <th>Total Marks</th>
                <th>Marks Obtained</th>
                {rubrics && rubrics.map((rubric) => (
                  <th style={{ textAlign: "center" }} key={rubric._id}>{rubric.criteria}<br />{rubric.marks}</th>
                ))}
                <th>Add Remark (optional)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions && filteredSubmissions &&
                filteredSubmissions.map((submission) => (

                  <tr key={submission.submissionId}>
                    <td>{submission.submissionId}</td>
                    <td>{submission.studentCode}</td>
                    <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                    <td>
                      <a href={submission?.submissionLink1 || ""} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                    <td>
                      <a href={submission?.submissionLink2 || ""} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                    <td>
                      <a href={submission?.submissionLink3 || ""} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                    <td>
                      <select
                        disabled={!isAdmin}
                        value={selectedIA[submission.submissionId] || submission.gradedBy?._id || ""}
                        onChange={(e) => handleChangeIA(submission.submissionId, e.target.value)}
                      >
                        <option value="">Unassign IA</option>
                        {ias.map((ia) => (
                          <option key={ia._id} value={ia._id}>
                            {ia.name}
                          </option>
                        ))}

                      </select>
                    </td>
                    <td className={submission.status === 'Pending' ? 'status-pending' : 'status-completed'}>
                      {submission.status}
                    </td>
                    <td>{rubrics && rubrics.reduce((final, ele) => ele.marks + final, 0)}</td>
                    <td>{calculateTotalMarksObtained(submission)}</td>
                    {rubrics &&
                      rubrics.map((rubric) => (
                        <td key={rubric._id}>
                          <input
                            type="checkbox"
                            checked={
                              (selectedRubrics[submission.submissionId] || []).includes(rubric._id.toString())
                            }
                            onChange={() => handleRubricSelection(submission.submissionId, rubric._id)}
                          />

                        </td>
                      ))}
                      <td><textarea name="" id="" cols="20" rows="10" onChange={(e)=>setRemark(e.target.value)}></textarea></td>
                    <td>
                      <button onClick={() => handleSubmitGrading(submission.submissionId)}>Submit</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal">
            <div className="modal-content">
              <p>
                {submissionToUpdate?.newIaId
                  ? `Change IA for submission ${submissionToUpdate.submissionId}?`
                  : `Remove IA from submission ${submissionToUpdate.submissionId}?`}
              </p>
              <div className="modal-buttons">
                <button className="confirm-btn" onClick={handleConfirmUpdate}>Confirm</button>
                <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsList;
