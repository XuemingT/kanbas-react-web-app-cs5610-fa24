import { useSelector } from "react-redux";
import { ReactNode } from "react";

interface StudentOnlyProps {
  children: ReactNode;
}

const StudentOnly: React.FC<StudentOnlyProps> = ({ children }) => {
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  ) || { role: "STUDENT", _id: "1" };

  // Add console log for debugging
  console.log("StudentOnly - currentUser:", currentUser);
  console.log("StudentOnly - isStudent:", currentUser?.role === "STUDENT");

  if (currentUser?.role === "STUDENT") {
    return <>{children}</>;
  }

  return null;
};

export default StudentOnly;
