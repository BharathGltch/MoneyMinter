import { FormEvent, memo, useContext, useState } from "react"
import { MyContext } from "./ContextProvider";
import {  useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import ParticlesBack from "./ParticlesBack";

const MemoizedParticle=memo(ParticlesBack);

const Register = () => {
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
        let registerData={
            username:username,
            password:password
        };
        if(username.length==0 || password.length==0){
            setInputError("Username and Password cannot be empty");
        }else{
           axios.post("http://localhost:3000/register",registerData).then((res)=>{
             let token:string=res.data.token as string;
             if(res.data.message){
              return setInputError(res.data.message);
             }
             localStorage.setItem("token",token);
             context?.setIsLoggedIn(true);
             navigate("/");
           })
           .catch((err)=>{
            if(err.response){
                setInputError("Enter a unique username")
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
        <div className="w-full h-full flex flex-col items-center">
            {/*Background*/}
            <div className="fixed top-0 left-0 w-full h-full z-5">
                <MemoizedParticle/>
            </div>


            {/*Register Component */}

            <div className="w-[400px] h-[400px] flex flex-col justify-center items-center z-20">
                <div className="mt-10">
                    <Typography variant="h5" className="font-bold text-cyan-100">Sign Up</Typography>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 p-10 border-solid border-2 border-cyan-500  rounded-md" >
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex justify-center  bg-white bg-opacity-20 rounded-md shadow-lg">
                            <TextField fullWidth label="Username" variant="outlined" onChange={(e) => { setUsername(e.target.value) }} className="pt-10 w-full" />
                        </div>
                        <div className="flex justify-content bg-white bg-opacity-20 rounded-md shadow-lg mt-3">
                            <TextField fullWidth label="Password" type="Password" variant="outlined" onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        {inputError && <div style={{color:'red'}}>{inputError}</div>}
                        <div className="mt-3">
                            <Button type="submit" variant="contained">Submit</Button>
                        </div>
                    </div>
                </form>
                
            </div>
        </div>
    )
}


export default Register;
