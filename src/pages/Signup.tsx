import React, { useState } from "react"
import './Signup.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

interface FormData {
    email: string;
    username: string;
    password: string;
  }
  
const Signup = () => {
  const navigate = useNavigate()
    const [formData, setFormData] = useState<FormData>({
        email: '',
        username: '',
        password: '',
      });
      const [errors, setErrors] = useState<FormData>({
        email: '',
        username: '',
        password: '',
      });
    
      // Handler for input change to update state
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };
    
      // Validation function
      const validateForm = () => {
        let isValid = true;
        const newErrors: FormData = { email: '', username: '', password: '' };
    
        // Email validation
        if (!formData.email) {
          newErrors.email = 'Email is required';
          isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = 'Email format is invalid';
          isValid = false;
        }
    
        // Username validation
        if (!formData.username) {
          newErrors.username = 'Username is required';
          isValid = false;
        }
    
        // Password validation
        if (!formData.password) {
          newErrors.password = 'Password is required';
          isValid = false;
        } else if (formData.password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
          isValid = false;
        }
    
        setErrors(newErrors);
        return isValid;
      };
    
      // Form submission handler
      const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
          console.log('Form submitted:', formData);
          try {
            const api_url = 'https://peertopeervideocallserver-production.up.railway.app'; // Define your API URL here
            const data = await axios.post(`${api_url}/createuser`, formData);
            console.log(data,"data");
            if (data.status === 201) {
                toast.success("Login successful!"); // Show success toast
                // Add your redirection logic here if needed
                navigate("/login")
              }
          } catch (error) {
            console.log(error,"error");
            toast.error("Error occurred. Please try again."); // Show error toast
          }
         
          // Process form submission logic here (e.g., API call)
        }
      };

    return (
        <>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>
      
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
      </div>
      
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      </div>
      
      <button type="submit">Register</button>
      <Link to="/login">lOGIN</Link>
    </form>
        </>
    )
}

export default Signup