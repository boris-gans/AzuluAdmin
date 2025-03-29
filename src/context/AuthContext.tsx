import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import apiService, {
  setAdminPassword,
  clearAdminPassword,
  getAdminPassword,
} from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      const savedPassword = getAdminPassword();

      if (savedPassword) {
        try {
          const isValid = await apiService.checkAuth();
          setIsAuthenticated(isValid);
        } catch (error) {
          setIsAuthenticated(false);
          clearAdminPassword();
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      setAdminPassword(password);
      const isValid = await apiService.checkAuth();
      setIsAuthenticated(isValid);
      setIsLoading(false);
      return isValid;
    } catch (error) {
      setIsAuthenticated(false);
      clearAdminPassword();
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    clearAdminPassword();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
