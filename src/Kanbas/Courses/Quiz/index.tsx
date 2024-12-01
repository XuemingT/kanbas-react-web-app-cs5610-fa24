import React from "react";
import { Route, Routes } from "react-router-dom";
import QuizList from "./QuizList";
import QuizEditor from "./QuizEditor";
import QuizDetails from "./QuizDetail";
import QuizPreview from "./QuizPreview";

export default function Quiz() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/:qid/edit" element={<QuizEditor />} />
        <Route path="/:qid" element={<QuizDetails />} />
        <Route path="/:qid/edit" element={<QuizEditor />} />
        <Route path="/:qid/preview" element={<QuizPreview />} />
      </Routes>
    </div>
  );
}
