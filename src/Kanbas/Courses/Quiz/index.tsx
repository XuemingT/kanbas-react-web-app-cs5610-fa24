import React from "react";
import { Route, Routes } from "react-router-dom";
import QuizList from "./QuizList";
import QuizEditor from "./QuizEditor";
import QuizDetails from "./quizDetails";
import QuizPreview from "./QuizPreview";

export default function Quiz() {
  return (
    <div id="wd-assignments">
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path=":aid" element={<QuizDetails />} />
        <Route path=":aid/QuizEditor" element={<QuizEditor />} />
        <Route path=":aid/QuizPreview" element={<QuizPreview />} />
        <Route path="new" element={<QuizDetails />} />
      </Routes>
    </div>
  );
}
