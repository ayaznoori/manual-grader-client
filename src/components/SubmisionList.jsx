import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSubmissions, updateSubmission } from "../redux/actions/submissionAction";
import { fetchRubrics } from "../redux/actions/rubricActions";
import { useParams } from "react-router-dom";
import "./Submission.css";
import AssignIAModal from "./AssignIAModal";
import { fetchIAs } from "../redux/actions/iaActions";

const SubmissionsList = () => {
  const { assessId } = useParams();
  const dispatch = useDispatch();

  const { submissions, loading, error } = useSelector((state) => state.submissions);
  const { rubrics } = useSelector((state) => state.rubrics);
  const [showIAModal, setShowIAModal] = useState(false);
  const [selectedRubrics, setSelectedRubrics] = useState({});
  const { ias } = useSelector((state) => state.ia)
  useEffect(() => {
    dispatch(fetchSubmissions(assessId));
    dispatch(fetchRubrics(assessId));
    dispatch(fetchIAs());
  }, [dispatch, assessId]);

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
  const handleSubmitGrading = (submissionId) => {
    const selected = selectedRubrics[submissionId] || [];
    const totalMarksObtained = calculateTotalMarksObtained({
      rubricsSelected: selected,
    });

    dispatch(updateSubmission(submissionId, {
      rubricsSelected: selected,
      totalMarks: totalMarksObtained,
      status: "Graded",
    }));
  };
  const totalGraded = submissions.filter((s) => s.status === "Graded").length;
  const totalPending = submissions.filter((s) => s.status === "Pending").length;
  const totalAssigned = submissions.filter((s) => s.gradedBy).length;
  const totalUnassigned = submissions.length - totalAssigned;

  return (
    <div style={{paddingTop:"100px"}}>
      <h2>Submissions for Assessment: {assessId}</h2>
      <div className="submissions-container">
        <div className="submission-stats">
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
        </div>

        <button onClick={() => setShowIAModal(true)}>Assign IA</button>
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
                <th>Submission Link</th>
                <th>Graded By I.A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                <th>Status</th>
                <th>Total Marks</th>
                <th>Marks Obtained</th>
                {rubrics && rubrics.map((rubric) => (
                  <th style={{ textAlign: "center" }} key={rubric._id}>{rubric.criteria}<br />{rubric.marks}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions &&
                submissions.map((submission) => (

                  <tr key={submission.submissionId}>
                    <td>{submission.submissionId}</td>
                    <td>{submission.studentCode}</td>
                    <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                    <td>
                      <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </td>
                    <td className="graded-by"><select value={submission.gradedBy ? submission.gradedBy.name : "Not Assigned"}>
                      {ias && ias?.map((ele) => {
                        return <option key={ias._id}>{ele.name}</option>
                      })
                      }
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
                    <td>
                      <button onClick={() => handleSubmitGrading(submission.submissionId)}>Submit</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsList;
