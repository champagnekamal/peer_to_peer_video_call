import { Link, useNavigate } from "react-router-dom";

const Header = ({user})=>{

    const navigate = useNavigate()
const handlelogout = ()=>{
    localStorage.clear()
navigate("/login")
}

    return(
        <>
           <header className="header">
        <div className="logo">MySite</div>
        <button onClick={handlelogout}>logout</button>
        
        {

       user?  <div className="profile-name">{user?.username}</div> : <Link to="/login">Login</Link>
        }
    </header>
        </>
    )
}

export default Header