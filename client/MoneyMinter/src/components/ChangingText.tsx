import { useEffect,useState } from "react";
export default function ChangingText(){
    const [changingText,setChangingText]=useState("");
    let textArray:string[]=["create your own brain rot?","make your own Dopamine?"];
    
  useEffect(()=>{
    let text=textArray[0];
    let length=1;
    let index=0;
    let typingInterval:number|null=null;
    
    const changeTextTime=()=>{
        
            setChangingText(text.substring(0,length));
            length++;
        if(length>text.length){
            if(typingInterval!=null)
            clearInterval(typingInterval);
            setTimeout(() => {
                index=(index+1)%textArray.length;
            text=textArray[index];
            length=1;
              typingInterval=setInterval(changeTextTime,100);
            }, 1000);
        }
        
    }
     typingInterval=setInterval(changeTextTime,100);
    
    return ()=> {if(typingInterval!=null)clearInterval(typingInterval)};
  },[])
    return(
        <div className="flex">
            <h1 className="text-4xl font-bold">Why not&nbsp; </h1>
            <h1 className="text-4xl font-bold">{changingText}</h1>
        </div>
    )
}