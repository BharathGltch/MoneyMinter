import { Button, LinearProgress, TextField } from "@mui/material"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function GenVideo(){
    const [idea,setIdea]=useState("");
    const [error,setError]=useState(false);
    const [helperText,setHelperText]=useState("");
    const [isLoading,setIsLoading]=useState(false);
    const [progress,setProgress]=useState(0);

    const navigate=useNavigate();

    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();
        if(idea.length==0){
            setError(true);
            setHelperText("Idea cannot be empty");
        }else{
            let formData={
                "queryString":idea
            };
            let interval=setInterval(()=>{
                setProgress((oldProgress)=>{
                        if(oldProgress>=95){
                            return oldProgress;
                            
                        }
                        let diff=Math.random()*10;
                        let val=oldProgress+diff;
                        return Math.min(val,95);
                })

                
            },1000);
            setIsLoading(true);
             axios.post("http://localhost:3000/process",formData)
             .then(response=>{
                setIsLoading(false);
                localStorage.setItem("token",response.data.token);
                let videoId=response.data.videoId as string;
                navigate(`/video/${videoId}`);
                console.log("Response: ",response.data);
             }).catch(error=>{
                setIsLoading(false);
                console.log("Error ",error);
             }).finally(()=>{
                clearInterval(interval);
                setProgress(0);
             })
        }
    }
    if(isLoading){
        return(
            
            <LinearProgress variant="determinate" value={progress} style={{width:"100%"}}/>
           
        )
    }
    return(
        <div className="w-full">
             <form onSubmit={handleSubmit} id="GenVideoForm" name="GenVideoFormName">
            <div className="bg-white bg-opacity-20 rounded-md shadow-lg">
               
            <TextField
          id="standard-textarea"
          label="The Idea"
          placeholder="Idea"
          multiline
          fullWidth
          variant="filled"
          className="w-full"
          helperText={helperText}
          color={"secondary"}
          error={error}
          onChange={(e)=>{setIdea(e.target.value)}}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
                handleSubmit(e as unknown as React.FormEvent);
                return;
            }
            return;
          }}
          
        />
        </div>
        
        <div className="flex justify-center m-5">
            <Button type="submit" variant="contained" size="large" >Generate</Button>
        </div>
       
        </form>
        </div>
    )
}