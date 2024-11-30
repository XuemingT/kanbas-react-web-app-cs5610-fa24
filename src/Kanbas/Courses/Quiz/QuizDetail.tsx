import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as db from "../../Database";
import { format, parseISO } from 'date-fns';

function formatDate(dateString: string) {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d 'at' h:mm a 'UTC'");
  } catch (error) {
    return "Invalid Date";
  }
}

export default function QuizDetails() {
  const navigate = useNavigate();
  const { cid, qid } = useParams<{ cid: string; qid: string }>();

  // Find the specific quiz based on course ID and quiz ID
  const quiz = db.quizzes.find(
    (quiz) => quiz._id === qid && quiz.course === cid
  );

  console.log("cid:", cid);
  console.log("qid:", qid);
  console.log("quiz:", quiz);
  if (!quiz) {
    return <div>Quiz not found</div>;
  }
  const handlePreview = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuizPreview`);
  };

  const handleEdit = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/QuizEditor`);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2> 
        <div>
          <button className="btn btn-secondary me-2" onClick={handlePreview}>
            Preview
          </button>
          <button className="btn btn-secondary" onClick={handleEdit}>
            Edit
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-8">
          <table className="table">
            <tbody>
              <tr>
                <td className="text-end" style={{ width: "200px" }}>
                  Quiz Type
                </td>
                <td>{quiz.quizType}</td>
              </tr>
              <tr>
                <td className="text-end">Points</td>
                <td>{quiz.points}</td>
              </tr>
              <tr>
                <td className="text-end">Assignment Group</td>
                <td>{quiz.assignmentGroup}</td>
              </tr>
              <tr>
                <td className="text-end">Shuffle Answers</td>
                <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end">Time Limit</td>
                <td>{quiz.timeLimit} Minutes</td>
              </tr>
              <tr>
                <td className="text-end">Multiple Attempts</td>
                <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end">View Responses</td>
                <td>Always</td>
              </tr>
              <tr>
                <td className="text-end">Show Correct Answers</td>
                <td>{quiz.showCorrectAnswers}</td>
              </tr>
              <tr>
                <td className="text-end">One Question at a Time</td>
                <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end">Require Respondus LockDown Browser</td>
                <td>No</td>
              </tr>
              <tr>
                <td className="text-end">Required to View Quiz Results</td>
                <td>No</td>
              </tr>
              <tr>
                <td className="text-end">Webcam Required</td>
                <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end">Lock Questions After Answering</td>
                <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>

          <table className="table mt-4">
            <thead>
              <tr>
                <th>Due</th>
                <th>For</th>
                <th>Available from</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(quiz.dueDate)}</td>
                <td>Everyone</td>
                <td>{formatDate(quiz.availableDate)}</td>
                <td>{formatDate(quiz.untilDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
