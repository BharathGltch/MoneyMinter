import { EventHandler, FormEvent, FormEventHandler, useContext, useState } from "react"
import { MyContext } from "./ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";

const Login = () => {
    let context = useContext(MyContext);
    let navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    if (context?.isLoggedIn == true) {
        navigate("/");
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
    }

    return (
        <div className="w-full h-full flex flex-col items-center  bg-[#EEEEEE]">


            <div className="w-[400px] h-[400px] flex flex-col justify-center items-center">
                <div className="mt-10">
                    <Typography variant="h5">Login</Typography>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 p-10 border-solid border-2 border-cyan-600  rounded-md" >
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex justify-center">
                            <TextField fullWidth label="Username" variant="outlined" onChange={(e) => { setUsername(e.target.value) }} className="pt-10 w-full" />
                        </div>
                        <div className="flex justify-content mt-3">
                            <TextField fullWidth label="Password" type="Password" variant="outlined" onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        <div className="mt-3">
                            <Button type="submit" variant="contained">Submit</Button>
                        </div>
                    </div>
                </form>
                <div className="mt-2">
                    <Typography variant="subtitle2">Don't have an account? <Link to="/register" style={{color:'blue'}} >Register Here</Link> </Typography>
                </div>
            </div>



        </div>
    )
}


export default Login;
