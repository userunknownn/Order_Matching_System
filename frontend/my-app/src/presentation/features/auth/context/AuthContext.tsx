import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AxiosInstance } from "../../../../infrastructure/api/axios/AxiosInstance";
import { connectSocket, disconnectSocket} from "../../../../infrastructure/socket/SocketManager";
import { Socket } from "socket.io-client";


interface User {
  username: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

  }, []);

  useEffect(() => {
    if (token) {
      const newSocket = connectSocket(token); 
      setSocket(newSocket);
    } else {
      disconnectSocket();  
      setSocket(null);
    }
  }, [token]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        if (event.newValue) {

          setToken(event.newValue);
          const savedUser = sessionStorage.getItem("user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } else {

          setToken(null);
          setUser(null);
          disconnectSocket();
          setSocket(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

  const handleTokenExpired = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setSocket(null);
    disconnectSocket();

    window.location.reload(); 
  };

  socket.on("tokenExpired", handleTokenExpired);

  return () => {
    socket.off("tokenExpired", handleTokenExpired);
  };
    }, [socket]);



  const login = async (usernameInput: string) => {
    try {
      const response = await AxiosInstance.post('/auth/login', { email: usernameInput }, { headers: {
        'Content-Type': 'application/json',
      }});

      const accessToken = response.data.access_token;
      setToken(accessToken);
      sessionStorage.setItem("token", accessToken);

      setUser({ username: usernameInput });
      sessionStorage.setItem("user", JSON.stringify({ username: usernameInput }));

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Falha no login.');
    }
  };

  const logout = () => {
    disconnectSocket();
    setSocket(null);
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

