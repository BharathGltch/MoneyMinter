import { Button, TextField } from "@mui/material"
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GenVideo(){
    const [idea,setIdea]=useState("");
    const [error,setError]=useState(false);
    const [helperText,setHelperText]=useState("");

    const handleButtonClick=()=>{
        if(idea.length==0){
            setError(true);
            setHelperText("Idea cannot be empty");
        }else{
            let formData={
                "queryString":idea
            };
             axios.post("http://localhost:3000/process",formData)
             .then(response=>{
                console.log("Response: ",response.data)
             }).catch(error=>{
                console.log("Error ",error);
             })
        }
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