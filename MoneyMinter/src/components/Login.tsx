import { FormEvent, memo, useContext, useEffect, useState } from "react"
import { MyContext } from "./ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import ParticlesBack from "./ParticlesBack";

const MemoizedParticle=memo(ParticlesBack);

let url = import.meta.env.VITE_SERVER_URL as string;

const Login = () => {
    let context = useContext(MyContext);
    console.log("context is ",context);
    let navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [inputError,setInputError]=useState<string|null>(null);

    useEffect(()=>{
        console.log("Inside useEffect");
        console.log("The context inside useEffect is ",context);
        if (context?.isLoggedIn === true) {
            console.log("context isnide condition is", context);
            navigate("/");
        }
    },[context?.isLoggedIn,navigate])
   

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
           axios.post(url+"/login",loginData).then((res)=>{
            console.log("The response is ",res.data);
             let token:string=res.data.token as string;
             console.log("token returned is ",token);
             localStorage.setItem("token",token);
             console.log(context);
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
        <div className="w-full h-full flex flex-col items-center ">

            {/*  Background  */}
            <div className="fixed top-0 left-0 w-full h-full z-5">
            <MemoizedParticle />
            </div>


            {/* Login Card */}
            <div className="w-[400px] h-[400px] flex flex-col justify-center items-center z-10">
                <div className="mt-10">
                    <Typography variant="h5" className="font-bold text-cyan-100">Login</Typography>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 p-10 border-solid border-2 border-cyan-500  rounded-md" >
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex justify-center bg-white bg-opacity-20 rounded-md shadow-lg">
                            <TextField fullWidth label="Username" variant="outlined" onChange={(e) => { setUsername(e.target.value) }} className="pt-10 w-full" />
                        </div>
                        <div className="flex justify-content mt-3 bg-white bg-opacity-20 rounded-md shadow-lg">
                            <TextField fullWidth label="Password" type="Password" variant="outlined" onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        {inputError && <div style={{color:'red'}}>{inputError}</div>}
                        <div className="mt-3">
                            <Button type="submit" variant="contained">Submit</Button>
                        </div>
                    </div>
                </form>
                <div className="mt-2">
                    <Typography variant="subtitle2" className="text-cyan-400">Don't have an account? <Link to="/register" style={{ color: 'blue' }} >Register Here</Link> </Typography>
                </div>
            </div>
        </div>
    )
}


export default Login;
