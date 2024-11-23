import { useState } from "react";
import './Login.css';
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit =async (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Email:', email);
      console.log('Password:', password);
     
      try {
        const api_url = 'http://localhost:5000'; // Define your API URL here
        const data = await axios.post(`${api_url}/login`, {email,password});
        console.log(data,"logindata");
        if(data?.status == 200){
            toast.success("Login successful!"); // Show success toast
navigate("/")
        }
        localStorage.setItem("token",data.data.token);
        localStorage.setItem("refreshtoken",data.data.refreshToken);
        const user =  JSON.stringify(data?.data?.user);
        localStorage.setItem("user",user);
      } catch (error) {
        console.log(error,"something went wrong");
      }
    };
    return (
        <>
           <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        <Link to="/signup">Signup</Link>
      </form>
    </div>
        </>
    )
}

export default Login