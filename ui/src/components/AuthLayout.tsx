import { Suspense } from "react";
import { Await, useLoaderData, useOutlet } from "react-router-dom";
import { AuthProvider } from "../useAuth";

export const AuthLayout = () => {
  const outlet = useOutlet();

  const { userPromise } = useLoaderData();

  return (
    <Suspense>
      <Await
        resolve={userPromise}
        children={(userData) => (
          <AuthProvider permissionData={userData[0]} currentUserId={userData[1]} currentUserName={userData[2]}>{outlet}</AuthProvider>
        )}
      />
    </Suspense>
  );
};
