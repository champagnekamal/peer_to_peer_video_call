// import { useState } from 'react'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';

function App() {
  // const [count, setCount]:any = useState(0)

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />
  },{
    path:"/login",
    element:<Login/>
  },{
    path:"/",
    element:<Dashboard/>
  }
]);

  return (
    <>
     <ToastContainer 
        position="top-right" // or any position you prefer
        autoClose={5000} // or your desired duration
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
 <RouterProvider router={router} />
    </>
  )
}

export default App
