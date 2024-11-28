import React, { useState } from "react";
import { useParams } from "react-router-dom";

interface Question {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  points: number;
  text: string;
  options?: string[];
  correctAnswer?: string | boolean;
  isEditing: boolean;
}

interface QuizQuestionsProps {
  onPointsUpdate: (points: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

const QuizQuestions: React.FC<QuizQuestionsProps> = ({
  onPointsUpdate,
  onSave,
  onCancel,
}) => {
  const { cid } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "MULTIPLE_CHOICE",
      points: 1,
      text: "",
      options: ["", ""],
      correctAnswer: "",
      isEditing: true,
    };
    setQuestions([...questions, newQuestion]);
    setTotalPoints((prev) => prev + 1);
  };

  const handleQuestionEdit = (
    questionId: string,
    field: string,
    value: any
  ) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
    );
  };

  const handlePointsChange = (questionId: string, newPoints: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, points: newPoints } : q
      )
    );
    const newTotal = questions.reduce(
      (sum, q) => sum + (q.id === questionId ? newPoints : q.points),
      0
    );
    setTotalPoints(newTotal);
    onPointsUpdate(newTotal);
  };

  const QuestionEditor = ({ question }: { question: Question }) => (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex justify-content-between mb-3">
        <select
          className="form-select w-25"
          value={question.type}
          onChange={(e) =>
            handleQuestionEdit(question.id, "type", e.target.value)
          }
        >
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="FILL_BLANK">Fill in the Blank</option>
        </select>
        <div className="d-flex align-items-center">
          <input
            type="number"
            className="form-control w-75 me-2"
            value={question.points}
            onChange={(e) =>
              handlePointsChange(question.id, parseInt(e.target.value))
            }
          />
          <span>pts</span>
        </div>
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Question Text"
          value={question.text}
          onChange={(e) =>
            handleQuestionEdit(question.id, "text", e.target.value)
          }
          rows={3}
        />
      </div>

      {question.type === "MULTIPLE_CHOICE" && (
        <div className="mb-3">
          {question.options?.map((option, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="radio"
                name={`question-${question.id}`}
                className="me-2"
                checked={question.correctAnswer === option}
                onChange={() =>
                  handleQuestionEdit(question.id, "correctAnswer", option)
                }
              />
              <input
                type="text"
                className="form-control"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...(question.options || [])];
                  newOptions[index] = e.target.value;
                  handleQuestionEdit(question.id, "options", newOptions);
                }}
              />
            </div>
          ))}
          <button
            className="btn btn-secondary mt-2"
            onClick={() => {
              const newOptions = [...(question.options || []), ""];
              handleQuestionEdit(question.id, "options", newOptions);
            }}
          >
            Add Option
          </button>
        </div>
      )}

      {question.type === "TRUE_FALSE" && (
        <div className="mb-3">
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name={`question-${question.id}`}
              checked={question.correctAnswer === true}
              onChange={() =>
                handleQuestionEdit(question.id, "correctAnswer", true)
              }
            />
            <label className="form-check-label">True</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name={`question-${question.id}`}
              checked={question.correctAnswer === false}
              onChange={() =>
                handleQuestionEdit(question.id, "correctAnswer", false)
              }
            />
            <label className="form-check-label">False</label>
          </div>
        </div>
      )}

      {question.type === "FILL_BLANK" && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Correct Answer"
            value={(question.correctAnswer as string) || ""}
            onChange={(e) =>
              handleQuestionEdit(question.id, "correctAnswer", e.target.value)
            }
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-3">
        <button className="btn btn-secondary" onClick={addNewQuestion}>
          + New Question
        </button>
      </div>

      {questions.map((question) => (
        <QuestionEditor key={question.id} question={question} />
      ))}

      <div className="d-flex justify-content-between mt-4">
        <div>Total Points: {totalPoints}</div>
        <div>
          <button className="btn btn-light me-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;
