import { api, REMOTE_SERVER } from "../../api";
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
export const fetchAllCourses = async () => {
  const { data } = await api.get(COURSES_API);
  return data;
};
export const deleteCourse = async (id: string) => {
  const { data } = await api.delete(`${COURSES_API}/${id}`);
  return data;
};
export const updateCourse = async (course: any) => {
  const { data } = await api.put(`${COURSES_API}/${course._id}`, course);
  return data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await api.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await api.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};
