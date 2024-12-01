import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  addQuestionToQuiz,
  updateQuizQuestion,
  deleteQuizQuestion,
} from "./client";
import { Question, Quiz } from "./types";

interface QuizQuestionsProps {
  quizData: Quiz;
  onPointsUpdate: (points: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

const QuizQuestions: React.FC<QuizQuestionsProps> = ({
  quizData,
  onPointsUpdate,
  onSave,
  onCancel,
}) => {
  const { qid } = useParams();
  const [questions, setQuestions] = useState<Question[]>(
    quizData.questions || []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateTotalPoints();
  }, [questions]);

  const calculateTotalPoints = () => {
    const total = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    onPointsUpdate(total);
  };

  const addNewQuestion = async () => {
    try {
      setLoading(true);
      const newQuestion: Partial<Question> = {
        type: "MULTIPLE_CHOICE",
        points: 1,
        question: "",
        options: ["Option 1", "Option 2"],
        correctAnswer: null,
      };

      const addedQuestion = await addQuestionToQuiz(qid as string, newQuestion);
      setQuestions([...questions, addedQuestion]);
    } catch (error) {
      setError("Failed to add question");
      console.error("Error adding question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionEdit = async (
    questionId: string,
    field: keyof Question,
    value: any
  ) => {
    try {
      setLoading(true);
      const updatedQuestion = await updateQuizQuestion(
        qid as string,
        questionId,
        { [field]: value }
      );

      setQuestions(
        questions.map((q) =>
          q._id === questionId ? { ...q, ...updatedQuestion } : q
        )
      );
    } catch (error) {
      setError("Failed to update question");
      console.error("Error updating question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionDelete = async (questionId: string) => {
    try {
      setLoading(true);
      await deleteQuizQuestion(qid as string, questionId);
      setQuestions(questions.filter((q) => q._id !== questionId));
    } catch (error) {
      setError("Failed to delete question");
      console.error("Error deleting question:", error);
    } finally {
      setLoading(false);
    }
  };

  const QuestionEditor = ({ question }: { question: Question }) => (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex justify-content-between mb-3">
        <select
          className="form-select w-25"
          value={question.type}
          onChange={(e) =>
            handleQuestionEdit(question._id, "type", e.target.value)
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
              handleQuestionEdit(
                question._id,
                "points",
                parseInt(e.target.value) || 0
              )
            }
            min="0"
          />
          <span>pts</span>
          <button
            className="btn btn-danger ms-3"
            onClick={() => handleQuestionDelete(question._id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Question Text"
          value={question.question}
          onChange={(e) =>
            handleQuestionEdit(question._id, "question", e.target.value)
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
                name={`question-${question._id}`}
                className="me-2"
                checked={question.correctAnswer === option}
                onChange={() =>
                  handleQuestionEdit(question._id, "correctAnswer", option)
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
                  handleQuestionEdit(question._id, "options", newOptions);
                }}
              />
              {index > 1 && (
                <button
                  className="btn btn-link text-danger"
                  onClick={() => {
                    const newOptions = question.options?.filter(
                      (_, i) => i !== index
                    );
                    handleQuestionEdit(question._id, "options", newOptions);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            className="btn btn-secondary mt-2"
            onClick={() => {
              const newOptions = [...(question.options || []), ""];
              handleQuestionEdit(question._id, "options", newOptions);
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
              name={`question-${question._id}`}
              checked={question.correctAnswer === "true"}
              onChange={() =>
                handleQuestionEdit(question._id, "correctAnswer", "true")
              }
            />
            <label className="form-check-label">True</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name={`question-${question._id}`}
              checked={question.correctAnswer === "false"}
              onChange={() =>
                handleQuestionEdit(question._id, "correctAnswer", "false")
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
              handleQuestionEdit(question._id, "correctAnswer", e.target.value)
            }
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <button
          className="btn btn-secondary"
          onClick={addNewQuestion}
          disabled={loading}
        >
          {loading ? "Adding..." : "+ New Question"}
        </button>
      </div>

      {questions.map((question) => (
        <QuestionEditor key={question._id} question={question} />
      ))}

      <div className="d-flex justify-content-between mt-4">
        <div>
          Total Points: {questions.reduce((sum, q) => sum + (q.points || 0), 0)}
        </div>
        <div>
          <button
            className="btn btn-light me-2"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onSave}
            disabled={loading}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;
