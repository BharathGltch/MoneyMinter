import { Button } from "@mui/material"
import { MyContext } from "./ContextProvider"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Appbar() {
    const context = useContext(MyContext);
    const navigate=useNavigate();

    const handleLogout=()=>{
        localStorage.removeItem("token");
        context?.setIsLoggedIn(false);
        
    }

    if(context?.isLoggedIn) {
        return (
            <div className="shadow-lg bg-[#FFFFFF]">    
                <div className="flex justify-between">
                    <div className="flex">
                        <img src="https://t3.ftcdn.net/jpg/04/74/05/94/360_F_474059464_qldYuzxaUWEwNTtYBJ44VN89ARuFktHW.jpg" width={100} height={100} />
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
    return (
        <div className="shadow-lg bg-[#FFFFFF]">
            <div className="flex justify-between">
                <div className="flex">
                    <img src="https://t3.ftcdn.net/jpg/04/74/05/94/360_F_474059464_qldYuzxaUWEwNTtYBJ44VN89ARuFktHW.jpg" width={100} height={100} />
                    <p className="-ml-4 py-6 font-sans text-lg">Mint</p>
                </div>

                <div className="mt-5 mr-6">
                    <Button onClick={handleLogin} variant="contained">Login</Button>
                </div>
            </div>
        </div>
    )
}