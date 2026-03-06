import { createContext, useContext, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import httpStatus from "http-status";


export const AuthContext = createContext({}); // this is a global storage in this storage we are store the data

// this is a axios custom instance
const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users" // this is a comman url 
})

// this is a wrapper component 
{/* <AuthProvider>
      <App/>
    <AuthProvider/> */}
// means AuthProvider ke ander jitne components hain sab context use kar skte h
export const AuthProvider = ({children})=>{
  const authContext = useContext(AuthContext);

  // this store the State logged-in user data { name: "jeevan", username: "jeevan123"}
  const [userData, setUserData] = useState(authContext);

  //handleRegister
  const handleRegister = async (name, username, password)=>{
    try{
      let request = await client.post("/register", {
        name:name,
        username:username,
        password:password
      })

      // status check if the status is match httpStatus.CREATED means User Successfully create
      if(request.status === httpStatus.CREATED){
        return request.data.message;
      }
    } catch(err){
      throw err;
    }
  }

  // handleLogin
  const handleLogin = async (username, password)=>{
    try{
      let request = await client.post("/login", {
        username: username,
        password: password
      });

      if(request.status === httpStatus.OK){
        localStorage.setItem("token", request.data.token)
      }
    } catch(err){
      throw err;
    }
  }

  // store data in the context
  // now the data make global and any component are use these data
  const data = {
    userData, setUserData, handleRegister, handleLogin
  }

  return(
    // now in the AuthProvider all components are access this data
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}