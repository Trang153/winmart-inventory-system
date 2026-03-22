import React, { useEffect, useMemo, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { createAppRouter } from "./app/router";
import {
  clearAuthSession,
  getAuthSession,
  getCurrentUser,
  login as loginRequest,
  subscribeUnauthorized,
} from "./services/auth/authService";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getAuthSession);
  const [currentUser, setCurrentUser] = useState(getCurrentUser);

  useEffect(() => {
    return subscribeUnauthorized(() => {
      clearAuthSession();
      setIsAuthenticated(false);
      setCurrentUser(null);
    });
  }, []);

  const router = useMemo(
    () =>
      createAppRouter({
        isAuthenticated,
        currentUser,
        async onLogin(credentials) {
          const result = await loginRequest(credentials);
          setIsAuthenticated(true);
          setCurrentUser(result.user);
        },
        onLogout() {
          clearAuthSession();
          setIsAuthenticated(false);
          setCurrentUser(null);
        },
      }),
    [currentUser, isAuthenticated]
  );

  return <RouterProvider router={router} />;
}

export default App;
