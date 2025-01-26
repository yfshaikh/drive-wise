import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { UserInterface, UserContextInterface } from "@/interfaces/interfaces";

export const UserContext = createContext<UserContextInterface | null>(null);

export function UserProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);

  useEffect(() => {
    if (token) {
      setUserInfo(jwtDecode(token));
      console.log(userInfo);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ token, setToken, userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
