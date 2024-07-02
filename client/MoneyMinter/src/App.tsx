import Appbar from "./components/Appbar";
import './App.css'
import { useState,useEffect } from "react";

function App() {
  const [changingText,setChangingText]=useState("");
  let text:string="Create your brain rot?";
     
  useEffect(()=>{
    let length=2;
    const changeTextTime=setInterval(()=>{
      setChangingText(text.substring(0,length));
      length=length+1;
    },100);

    return ()=>clearInterval(changeTextTime);
  },[])

  return (
    <div className="w-screen h-screen bg-[#EEEEEE]">
      <Appbar></Appbar>
      <div className="mx-40">
        <div className="mt-[100px] flex">
          <h1 className="text-5xl font-bold">Why not&nbsp; </h1>
          <h1 className="text-5xl font-bold">{changingText}</h1>
        </div>
      </div>
    </div>
      
    
  )
}

export default App
