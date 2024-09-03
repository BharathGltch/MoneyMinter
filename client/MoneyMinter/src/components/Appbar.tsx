import { Button } from "@mui/material"
import { MyContext } from "./ContextProvider"
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function Appbar() {
    const context = useContext(MyContext);
    console.log("Context inside appbar is ",context);
    const navigate=useNavigate();
   

    const handleLogout=()=>{
        localStorage.removeItem("token");
        context?.setIsLoggedIn(false); 
    }

    if(context?.isLoggedIn===true) {
        return (
            <div className="shadow-lg bg-[#FFFFFF]">    
                <div className="flex justify-between">
                    <div className="flex">
                        <Link to="/">
                        <img src="https://t3.ftcdn.net/jpg/04/74/05/94/360_F_474059464_qldYuzxaUWEwNTtYBJ44VN89ARuFktHW.jpg" width={100} height={100} />
                        </Link>
                        <p className="-ml-4 py-6 font-sans text-lg">Mint</p>
                    </div>

                    <div className="mt-5 mr-6">
                        <Button onClick={handleLogout} variant="contained">Logout</Button>
                    </div>
                </div>
            </div>
        )
    }

    const handleLogin=()=>{
        navigate("/login");
    }
    
    const handleRegister=()=>{
        navigate("/register");
    }
    return (
        <div className="shadow-lg bg-[#FFFFFF]">
            <div className="flex justify-between">
                <div className="flex">
                        <Link to="/" className="ml-10">
                        <img src={logo} width={75} height={75} />
                        </Link>
                    <p className="-ml-4 py-6 font-sans text-lg"></p>
                </div>

                <div className="mt-5 mr-6 flex">
                  <div className="mr-4">
                <Button onClick={handleRegister} variant="contained" className="mr-10 !important" >SignUp</Button>
                </div>
                <div>
                <Button onClick={handleLogin} variant="contained" >Login</Button>
                </div>
                    
                </div>
            </div>
        </div>
    )
}