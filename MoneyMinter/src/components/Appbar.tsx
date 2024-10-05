import { Button } from "@mui/material"
import { MyContext } from "./ContextProvider"
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import MenuIcon from '@mui/icons-material/Menu';




export default function Appbar() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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

    const handleMenuClick=()=>{
        setMobileMenuOpen((prevVal)=>!prevVal);
    }



    if (context?.isLoggedIn === true) {
        return (
            <div className="container mx-auto px-2">
                <div className="flex justify-between">
                    <div className="flex">
                        <Link to="/" className="mt-4 ml-9">
                            <img src={"https://lirp.cdn-website.com/eb1755b3/dms3rep/multi/opt/OWAY-1314w.png"} width={100} height={100} />
                        </Link>

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
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center px-2">
                        <img src={"https://lirp.cdn-website.com/eb1755b3/dms3rep/multi/opt/OWAY-1314w.png"} alt="Logo" className="max-h-8 sm:max-h-10  w-auto h-auto" />
                    </Link>

                </div>

                <div className="hidden sm:flex items-center space-x-4">
                    <Button onClick={handleContribute} variant="contained" ><FaGithub className="mr-2" />Contribute</Button>

                    <Button onClick={handleRegister} variant="contained" >SignUp</Button>

                    <Button onClick={handleLogin} variant="contained" >Login</Button>
                </div>

                <div className="sm:hidden">
                    <Button onClick={handleMenuClick}>
                        <MenuIcon />
                    </Button>
                    {mobileMenuOpen &&
                     <div className="sm:hidden fixed inset-x-0 top-16 bg-gray-900 shadow-lg z-50 transition-all duration-300 ease-in-out">
                                <div className="flex flex-col items-center py-4 space-y-2">
                                           
                        <Button onClick={handleContribute} variant="contained" fullWidth><FaGithub className="mr-2" />Contribute</Button>
                        <Button onClick={handleRegister} variant="contained" fullWidth>SignUp</Button>
                        <Button onClick={handleLogin} variant="contained" fullWidth>Login</Button>             
                                </div>
                        </div>}

                </div>
            </div>
        </div>
    )
}