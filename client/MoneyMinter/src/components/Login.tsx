import { FormEvent, useContext, useState } from "react"
import { MyContext } from "./ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const Login = () => {
    let context = useContext(MyContext);
    let navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [inputError,setInputError]=useState<string|null>(null);
    if (context?.isLoggedIn == true) {
        navigate("/");
    }

    const handleSubmit =async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setInputError("");
        let loginData={
            username:username,
            password:password
        };
        if(username.length==0 || password.length==0){
            setInputError("Username and Password cannot be empty");
        }else{
           axios.post("http://localhost:3000/login",loginData).then((res)=>{
             let token:string=res.data.token as string;
             localStorage.setItem("token",token);
             context?.setIsLoggedIn(true);
             navigate("/");
           })
           .catch((err)=>{
            if(err.response){
                setInputError("Oops Something went wrong")
            }else if(err.request){
                setInputError("Oops something went wrong")
            }else{
                console.log('Error',err.message)
                setInputError("Oops something went wrong");
            }
           });
          
        }
        
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
                        {inputError && <div style={{color:'red'}}>{inputError}</div>}
                        <div className="mt-3">
                            <Button type="submit" variant="contained">Submit</Button>
                        </div>
                    </div>
                </form>
                <div className="mt-2">
                    <Typography variant="subtitle2">Don't have an account? <Link to="/register" style={{ color: 'blue' }} >Register Here</Link> </Typography>
                </div>
            </div>
        </div>
    )
}


export default Login;
