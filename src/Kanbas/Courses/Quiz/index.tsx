import React from "react";
import { Route, Routes } from "react-router-dom";
import QuizList from "./QuizList";
import QuizEditor from "./QuizEditor";
import QuizDetails from "./QuizDetail";
import QuizPreview from "./QuizPreview";

export default function Quiz() {
  return (
    <div id="wd-assignments">
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path=":qid/" element={<QuizDetails />} />
        <Route path=":qid/QuizEditor" element={<QuizEditor />} />
        <Route path=":qid/QuizPreview" element={<QuizPreview />} />
        <Route path="new" element={<QuizDetails />} />
      </Routes>
    </div>
  );
}
// export default function Quiz() {
//   return (
//     <div id="wd-quizzes">
//       <Routes>
//         <Route path="/Kanbas/Courses/:cid/Quizzes" element={<QuizList />} />
//         <Route path="/Kanbas/Courses/:cid/Quizzes/:qid" element={<QuizDetails />} />
//         <Route path="/Kanbas/Courses/:cid/Quizzes/:qid/QuizEditor" element={<QuizEditor />} />
//         <Route path="/Kanbas/Courses/:cid/Quizzes/:qid/QuizPreview" element={<QuizPreview />} />
//         <Route path="/Kanbas/Courses/:cid/Quizzes/new" element={<QuizDetails />} />
//       </Routes>
//     </div>
//   );
// }