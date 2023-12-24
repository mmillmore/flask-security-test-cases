import { Navigate, useOutlet } from "react-router-dom";

export const ProtectedLayout = () => {
  const permissions = localStorage.getItem("permissions");
  const outlet = useOutlet();
  
    if (permissions === null || permissions === "null") {
    return <Navigate to="/login" replace={true}/>;
  } else{
  return (
    <>
      {outlet}
    </>
  );
  }
};
