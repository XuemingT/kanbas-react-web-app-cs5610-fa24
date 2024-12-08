import Labs from "./Labs";
import Kanbas from "./Kanbas";
import store from "./Kanbas/store";
import { Provider } from "react-redux";

import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Landing from "./Landing";
export default function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <div>
          <Routes>
            {" "}
            {/* <Route path="/" element={<Navigate to="Kanbas" />} /> */}
            <Route path="/" element={<Navigate to="Landing" />} />
            <Route path="/Landing" element={<Landing />} />
            <Route path="/Labs/*" element={<Labs />} />
            <Route path="/Kanbas/*" element={<Kanbas />} />
          </Routes>
        </div>{" "}
      </Provider>
    </HashRouter>
  );
}
