import { useSelector, useDispatch } from "react-redux";
import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useState } from "react";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import { useParams } from "react-router-dom";
import ModuleControlButtons from "./ModuleControlButtons";
import FacultyOnly from "../../Account/FacultyOnly";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");

  // Ensure modules is retrieved as an array from Redux
  const modules = useSelector(
    (state: any) => state.modulesReducer.modules || []
  );

  const dispatch = useDispatch();

  // Function to add a new module
  const addNewModule = () => {
    dispatch(addModule({ name: moduleName, course: cid })); // Dispatch Redux action
    setModuleName(""); // Clear the input
  };

  return (
    <div className="wd-modules">
      <FacultyOnly>
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={addNewModule}
        />
      </FacultyOnly>
      <br />
      <br />
      <ul className="mt-2 list-group rounded-0">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <li
              key={module._id}
              className="wd-module list-group-item p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {!module.editing && module.name}
                {module.editing && (
                  <input
                    className="form-control w-50 d-inline-block"
                    defaultValue={module.name}
                    onChange={(e) =>
                      dispatch(
                        updateModule({ ...module, name: e.target.value })
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        dispatch(updateModule({ ...module, editing: false }));
                      }
                    }}
                  />
                )}
                <FacultyOnly>
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={(moduleId) =>
                      dispatch(deleteModule(moduleId))
                    }
                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                  />
                </FacultyOnly>
              </div>
              <ul className="wd-lessons list-group rounded-0">
                {module.lessons &&
                  module.lessons.map((lesson: any) => (
                    <li
                      key={lesson._id}
                      className="wd-lesson list-group-item p-3 ps-1"
                    >
                      <BsGripVertical className="me-2 fs-3" />
                      {lesson.name}
                      <LessonControlButtons />
                    </li>
                  ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
}
