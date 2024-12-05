import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Add this
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { Quiz } from "./types"; // Add this
import { createQuiz } from "./client"; // Add this

interface QuizControlButtonProps {
  onSearch: (term: string) => void;
}

export default function QuizControlButton({
  onSearch,
}: QuizControlButtonProps) {
  const navigate = useNavigate();
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { currentUser} = useSelector((state: any) => state.accountReducer);



  const handleAddQuiz = async () => {
    try {
      // Create a default quiz
      const defaultQuiz: Partial<Quiz> = {
        title: "New Quiz",
        description: "",
        course: cid,
        status: "draft",
        quizType: "Graded Quiz",
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        attempts: 1,
        showCorrectAnswers: "After Submission",
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: new Date().toISOString(),
        availableFrom: new Date().toISOString(),
        until: new Date().toISOString(),
        questions: [],
      };

      // Create the quiz through the API
      const newQuiz = await createQuiz(cid as string, defaultQuiz);

      // Navigate to the quiz editor for the new quiz
      navigate(`/Kanbas/Courses/${cid}/Quizzes/${newQuiz._id}/edit`);
    } catch (error) {
      console.error("Error creating new quiz:", error);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex">
        <div className="input-group me-2">
          <span className="input-group-text">
            <HiMagnifyingGlass />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        {currentUser.role === "FACULTY" && (
          <button className="btn btn-danger" onClick={handleAddQuiz}>
            <FaPlus className="me-2" />
            Quiz
          </button>
        )}
      </div>

      <button className="btn btn-light">
        <IoEllipsisVertical />
      </button>
      

    </div>
  );
}
