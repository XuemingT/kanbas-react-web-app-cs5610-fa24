import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import { useParams } from "react-router-dom";
import * as db from "../../Database";
export default function Modules() {
  const { cid } = useParams<{ cid: string }>();
  const modules = db.modules;

  const filteredModules = modules.filter((module) => module.course === cid);

  return (
    <div>
      <ModulesControls />
      <br />
      <br />
      <div>
        <ul id="wd-modules" className="mt-2 list-group rounded-0">
          {/* Map over filtered modules */}
          {filteredModules.length === 0 ? (
            <li>No modules available for this course</li>
          ) : (
            filteredModules.map((module) => (
              <li
                key={module._id}
                className="wd-module list-group-item p-0 mb-5 fs-5 border-gray"
              >
                <div className="wd-title p-3 ps-2 bg-secondary">
                  <BsGripVertical className="me-2 fs-3" />
                  {module.name}
                  <LessonControlButtons />
                </div>

                {/* Render lessons if they exist */}
                {module.lessons && (
                  <ul className="wd-lessons list-group rounded-0">
                    {module.lessons.map((lesson) => (
                      <li
                        key={lesson._id}
                        className="wd-lesson list-group-item p-3 ps-1"
                      >
                        {lesson.name}
                        <LessonControlButtons />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
