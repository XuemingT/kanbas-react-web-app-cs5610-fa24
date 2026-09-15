import { api, REMOTE_SERVER } from "../../../api";
const MODULES_API = `${REMOTE_SERVER}/api/modules`;
export const updateModule = async (module: any) => {
  const { data } = await api.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

export const deleteModule = async (moduleId: string) => {
  const response = await api.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
};
