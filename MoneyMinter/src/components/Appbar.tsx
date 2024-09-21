import { Button } from "@mui/material"
import { MyContext } from "./ContextProvider"
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import { FaGithub } from "react-icons/fa";


export default function Appbar() {
    const context = useContext(MyContext);
    console.log("Context inside appbar is ", context);
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem("token");
        context?.setIsLoggedIn(false);
        window.location.href = "/";
    }

    const handleContribute = () => {
        const newWindow = window.open("https://github.com/BharathGltch/MoneyMinter", '_blank', 'noopener,noreferrer');
        if (newWindow)
            newWindow.opener = null;
    }



    if (context?.isLoggedIn === true) {
        return (
            <div >
                <div className="flex justify-between">
                    <div className="flex">
                        <Link to="/" className="mt-4 ml-9">
                            <img src={"https://lirp.cdn-website.com/eb1755b3/dms3rep/multi/opt/OWAY-1314w.png"} width={100} height={100} />
                        </Link>
                        <p className="-ml-4 py-6 font-sans text-lg"></p>
                    </div>

                    <div className="mt-4 mb-1 mr-6 flex">
                        <div className="flex justify-between mr-4">
                            <Button onClick={handleContribute} variant="contained" size="small" ><FaGithub style={{ marginRight: '5px' }} />Contribute</Button>
                        </div>
                        <div>
                            <Button onClick={handleLogout} variant="contained" >Logout</Button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    const handleLogin = () => {
        navigate("/login");
    }

    const handleRegister = () => {
        navigate("/register");
    }
    return (
        <div >
            <div className="flex justify-between">
                <div className="flex">
                    <Link to="/" className="mt-4 ml-9">
                        <img src={"https://lirp.cdn-website.com/eb1755b3/dms3rep/multi/opt/OWAY-1314w.png"} width={100} height={100} />
                    </Link>
                    <p className="-ml-4 py-6 font-sans text-lg"></p>
                </div>

                <div className="mt-4 mb-1 mr-6 flex">
                    <div className="flex justify-between mr-4">
                        <Button onClick={handleContribute} variant="contained" size="small" ><FaGithub style={{ marginRight: '5px' }} />Contribute</Button>
                    </div>
                    <div className="flex justify-between mr-4">
                        <Button onClick={handleRegister} variant="contained" >SignUp</Button>
                    </div>
                    <div>
                        <Button onClick={handleLogin} variant="contained" >Login</Button>
                    </div>

                </div>
            </div>
        </div>
    )
}