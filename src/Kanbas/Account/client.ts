import { api, REMOTE_SERVER } from "../../api";
export const USERS_API = `${REMOTE_SERVER}/api/users`;

export const signin = async (credentials: any) => {
  const response = await api.post(
    `${USERS_API}/signin`,
    credentials
  );
  return response.data;
};
export const signup = async (user: any) => {
  const response = await api.post(`${USERS_API}/signup`, user);
  return response.data;
};
export const updateUser = async (user: any) => {
  const response = await api.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};
export const profile = async () => {
  const response = await api.post(`${USERS_API}/profile`);
  return response.data;
};
export const signout = async () => {
  const response = await api.post(`${USERS_API}/signout`);
  return response.data;
};
export const findMyCourses = async () => {
  const { data } = await api.get(
    `${USERS_API}/current/courses`
  );
  return data;
};

export const createCourse = async (course: any) => {
  const { data } = await api.post(
    `${USERS_API}/current/courses`,
    course
  );
  return data;
};
