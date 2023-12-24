import { createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({permissionData, currentUserId, currentUserName, children }) => {
  localStorage.setItem("permissions", permissionData);
  localStorage.setItem("currentUserId", currentUserId);
  localStorage.setItem("currentUserName", currentUserName);

  return <AuthContext.Provider value={permissionData}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
