import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSubmissions } from "../redux/actions/submissionAction"; // Create this action
import { useParams } from "react-router-dom";

const SubmissionsList = () => {
  const { assessId } = useParams();
  const dispatch = useDispatch();
  const { submissions, loading, error } = useSelector((state) => state.submissions);

  useEffect(() => {
    dispatch(fetchSubmissions(assessId));
  }, [dispatch, assessId]);

  return (
    <div>
      <h2>Submissions for Assessment: {assessId}</h2>
      <button onClick={() => alert("Assign IA logic here")}>Assign IA</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Submission ID</th>
            <th>Student Code</th>
            <th>Submitted At</th>
            <th>Submission Link</th>
            <th>Graded By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {submissions && submissions.map((submission) => (
            <tr key={submission.submissionId}>
              <td>{submission.submissionId}</td>
              <td>{submission.studentCode}</td>
              <td>{new Date(submission.submittedAt).toLocaleString()}</td>
              <td><a href={submission.submissionLink} target="_blank" rel="noopener noreferrer">View</a></td>
              <td>{submission.gradedBy ? submission.gradedBy : "Not Assigned"}</td>
              <td>{submission.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsList;
