// src/components/auth/FacultyOnly.tsx
import { useSelector } from "react-redux";
import { ReactNode } from "react"; // Add this import

// Properly type the component with FC (FunctionComponent)
interface FacultyOnlyProps {
  children: ReactNode;
}

const FacultyOnly: React.FC<FacultyOnlyProps> = ({ children }) => {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  if (currentUser?.role === "FACULTY") {
    return <>{children}</>; // Wrap children in a fragment
  }

  return null;
};

export default FacultyOnly;
