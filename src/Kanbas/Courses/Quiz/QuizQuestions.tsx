import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  findQuizById,
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
  onQuestionsUpdate: (questions: Question[]) => void;
}

interface QuestionEditorProps {
  question: Question;
  onEdit: (questionId: string, field: keyof Question, value: any) => void;
  onDelete: (questionId: string) => void;
  loading: boolean;
}

const QuestionEditor: React.FC<QuestionEditorProps> = React.memo(
  ({ question, onEdit, onDelete, loading }) => {
    const handleTextChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        onEdit(question._id, "question", value);
      },
      [question._id, onEdit]
    );

    const handleOptionChange = useCallback(
      (index: number, value: string) => {
        const newOptions = [...(question.options || [])];
        newOptions[index] = value;
        onEdit(question._id, "options", newOptions);
      },
      [question._id, question.options, onEdit]
    );

    return (
      <div className="border rounded p-3 mb-3">
        <div className="d-flex justify-content-between mb-3">
          <select
            className="form-select w-25"
            value={question.type}
            onChange={(e) => onEdit(question._id, "type", e.target.value)}
            disabled={loading}
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
                onEdit(question._id, "points", parseInt(e.target.value) || 0)
              }
              min="0"
              disabled={loading}
            />
            <span>pts</span>
            <button
              className="btn btn-danger ms-3"
              onClick={() => onDelete(question._id)}
              disabled={loading}
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
            onChange={handleTextChange}
            rows={3}
            disabled={loading}
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
                  onChange={() => onEdit(question._id, "correctAnswer", option)}
                  disabled={loading}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  disabled={loading}
                />
                {index > 1 && (
                  <button
                    className="btn btn-link text-danger"
                    onClick={() => {
                      const newOptions = question.options?.filter(
                        (_, i) => i !== index
                      );
                      onEdit(question._id, "options", newOptions);
                    }}
                    disabled={loading}
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
                onEdit(question._id, "options", newOptions);
              }}
              disabled={loading}
            >
              Add Option
            </button>
          </div>
        )}

        {question.type === "TRUE_FALSE" && (
          <div className="mb-3">
            {["true", "false"].map((value) => (
              <div key={value} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name={`question-${question._id}`}
                  checked={question.correctAnswer === value}
                  onChange={() => onEdit(question._id, "correctAnswer", value)}
                  disabled={loading}
                />
                <label className="form-check-label">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </label>
              </div>
            ))}
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
                onEdit(question._id, "correctAnswer", e.target.value)
              }
              disabled={loading}
            />
          </div>
        )}
      </div>
    );
  }
);

const QuizQuestions: React.FC<QuizQuestionsProps> = ({
  quizData,
  onPointsUpdate,
  onSave,
  onCancel,
  onQuestionsUpdate,
}) => {
  const { qid } = useParams();
  const [questions, setQuestions] = useState<Question[]>(
    quizData.questions || []
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const total = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    onPointsUpdate(total);
  }, [questions, onPointsUpdate]);

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
      if (addedQuestion) {
        const updatedQuestions = [...questions, addedQuestion];
        setQuestions(updatedQuestions);
        onQuestionsUpdate(updatedQuestions);
      }
    } catch (error) {
      setError("Failed to add question");
      console.error("Error adding question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionEdit = useCallback(
    async (questionId: string, field: keyof Question, value: any) => {
      // Immediately update local state for better UX
      const updatedQuestions = questions.map((q) =>
        q._id === questionId ? { ...q, [field]: value } : q
      );
      setQuestions(updatedQuestions);
      onQuestionsUpdate(updatedQuestions);

      // Then update the server
      try {
        await updateQuizQuestion(qid as string, questionId, { [field]: value });
      } catch (error) {
        console.error("Error updating question:", error);
        setError("Failed to save changes");
      }
    },
    [questions, qid, onQuestionsUpdate]
  );

  const handleQuestionDelete = useCallback(
    async (questionId: string) => {
      try {
        setLoading(true);
        await deleteQuizQuestion(qid as string, questionId);
        const updatedQuestions = questions.filter((q) => q._id !== questionId);
        setQuestions(updatedQuestions);
        onQuestionsUpdate(updatedQuestions);
      } catch (error) {
        setError("Failed to delete question");
        console.error("Error deleting question:", error);
      } finally {
        setLoading(false);
      }
    },
    [questions, qid, onQuestionsUpdate]
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
        <QuestionEditor
          key={question._id}
          question={question}
          onEdit={handleQuestionEdit}
          onDelete={handleQuestionDelete}
          loading={loading}
        />
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
