import Lab1 from "./lab1";
import { Route, Routes, Navigate } from "react-router";
import TOC from "./TOC";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";
import Lab4 from "./Lab4";
export default function Labs() {
  return (
    <div>
      <h1> Labs </h1>
      <h1> Xueming Tang</h1>
      <h2>Section1</h2>
      <h2>
        <a
          href="https://github.com/XuemingT/kanbas-react-web-app-cs5610-fa24/tree/a1"
          target="blank"
        >
          code for a1
        </a>
      </h2>
      <h2>
        <a
          href="https://github.com/XuemingT/kanbas-react-web-app-cs5610-fa24/tree/a2"
          target="blank"
        >
          code for a2
        </a>
      </h2>
      <h2>
        <a
          href="https://github.com/XuemingT/kanbas-react-web-app-cs5610-fa24/tree/a3/src"
          target="blank"
        >
          code for a3
        </a>
      </h2>
      <h2>
        <a
          href="https://github.com/XuemingT/kanbas-react-web-app-cs5610-fa24/tree/a4/src"
          target="blank"
        >
          code for a4
        </a>
      </h2>
      <TOC />
      <Routes>
        {/* <Route path="/" element={<Navigate to="Lab1" />} />{" "} */}
        <Route path="Lab1" element={<Lab1 />} />
        <Route path="Lab2" element={<Lab2 />} />
        <Route path="Lab3/*" element={<Lab3 />} />
        <Route path="Lab4/*" element={<Lab4 />} />
      </Routes>{" "}
    </div>
  );
}
