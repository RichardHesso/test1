import React, {
createContext,
useEffect,
useReducer,
useState,
} from 'react';
import {useHistory } from 'react-router-dom';
import axios from '../utils/axios';
import SplashScreen from '../components/SplashScreen'

const AuthContext = createContext({
  // isAuthenticated: false,
  // isInitialised: false,
  // login: () => Promise.resolve(),
  // logout: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {

  let history = useHistory();

  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isInitialised, setIsInitialised] = useState(false)
  const [user, setUser] = useState({})

  const login = async (login, password, otp) => {

    try {

      const response = await axios.post('/api/users/login/', {
        username: login,
        password: password,
        otp: otp
      });
      
      if (response.data.role === 'bot_user') {
        setIsAuthenticated(true);
        setUser(response.data);
        return {error: false, data: response.data}
      }
      else if (otp && ['admin', 'support'].includes(response.data.role)) {
        setIsAuthenticated(true);
        setUser(response.data);
      }
      
      return {error: false}
      
    } catch (err) {
      console.error(err)
      return {error: true, data: err.data}
    }
    
  };

  const logout = async () => {

    try {

      await axios.get('/api/users/logout/')

      setIsInitialised(false);
      setIsAuthenticated(false);
      setUser({})

      history.push('/login')
      
    } catch (err) {
      console.error(err)
    }
    
  };

  useEffect(() => {
    const initialise = async () => {
      try {

        const response = await axios.get('/api/users/get_me/')
  
        setIsInitialised(true);
        setIsAuthenticated(true);
        setUser(response.data)
        
      } catch (err) {
        
        //console.error(err)

        setIsAuthenticated(false);
        setIsInitialised(true);
        setUser({})

        // if (err.status == 403) {
        //   setIsAuthenticated(false);
        //   setIsInitialised(true);
        // } 
      }
    };
    initialise();
  }, []);

  if (!isInitialised) {
    return <SplashScreen />;
  }

return (
  <AuthContext.Provider
    value={{
      isAuthenticated,
      login,
      logout,
      user
    }}
  >
    {children}
  </AuthContext.Provider>
);
};

export default AuthContext;