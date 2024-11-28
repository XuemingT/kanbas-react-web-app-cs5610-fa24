import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface QuizDetails {
  quizType: string;
  points: number;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  attempts: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableFrom: string;
  until: string;
}

export default function QuizDetails() {
  const navigate = useNavigate();
  const { cid } = useParams();

  const [quiz, setQuiz] = React.useState<QuizDetails>({
    quizType: "Graded Quiz",
    points: 29,
    assignmentGroup: "QUIZZES",
    shuffleAnswers: false,
    timeLimit: 30,
    multipleAttempts: false,
    attempts: 1,
    showCorrectAnswers: "Immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "Sep 21 at 1pm",
    availableFrom: "Sep 21 at 11:40am",
    until: "Sep 21 at 1pm",
  });

  const handlePreview = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/QuizDetails/QuizPreview`);
  };

  const handleEdit = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/QuizDetails/QuizEditor`);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Q1 - HTML</h2>
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
                <td>{quiz.dueDate}</td>
                <td>Everyone</td>
                <td>{quiz.availableFrom}</td>
                <td>{quiz.until}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
