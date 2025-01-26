import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create context with default values
export const UserContext = createContext({
  token: null,
  setToken: () => {},
  userInfo: null,
  setUserInfo: () => {}
});

export function UserProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(null);

  const isTokenValid = (token) => {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  };
  
  useEffect(() => {
    if (token && isTokenValid(token)) {
      sessionStorage.setItem("token", token);
      setUserInfo(jwtDecode(token));
    } else {
      setToken(null);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ token, setToken, userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
