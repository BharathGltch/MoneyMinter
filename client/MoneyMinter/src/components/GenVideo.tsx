import { Button, TextField } from "@mui/material"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function GenVideo(){
    const [idea,setIdea]=useState("");
    const [error,setError]=useState(false);
    const [helperText,setHelperText]=useState("");
    const [isLoading,setIsLoading]=useState(false);

    const handleButtonClick=()=>{
        if(idea.length==0){
            setError(true);
            setHelperText("Idea cannot be empty");
        }else{
            let formData={
                "queryString":idea
            };
            setIsLoading(true);
             axios.post("http://localhost:3000/process",formData)
             .then(response=>{
                setIsLoading(false);
                console.log("Response: ",response.data);
             }).catch(error=>{
                setIsLoading(false);
                console.log("Error ",error);
             })
        }
    }
    if(isLoading){
        return(
                <ClipLoader />
        )
    }
    return(
        <div className="w-full">
            <div>
            <TextField
          id="standard-textarea"
          label="The Idea"
          placeholder="Idea"
          multiline
          fullWidth
          variant="filled"
          className="w-full"
          helperText={helperText}
          error={error}
          onChange={(e)=>{setIdea(e.target.value)}}
          
        />
        </div>
        <div className="flex justify-center m-5">
            <Button variant="contained" size="large" onClick={handleButtonClick}>Generate</Button>
        </div>
        
        </div>
    )
}