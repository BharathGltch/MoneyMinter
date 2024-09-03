import axios from "axios";
import React,{createContext,useState,ReactNode, useEffect} from "react";

interface MyContextType{
    isLoggedIn:boolean,
    setIsLoggedIn:React.Dispatch<React.SetStateAction<boolean>>
}

export const MyContext=createContext<MyContextType | undefined>(undefined);

interface MyContextProviderProps{
    children:ReactNode
}
export const MyContextProvider:React.FC<MyContextProviderProps>=({children})=>{
        const [isLoggedIn,setIsLoggedIn]=useState<boolean>(false);
        let token=localStorage.getItem("token");
        let url = import.meta.env.VITE_SERVER_URL;
       

        useEffect(()=>{
            async function checkIsLoggedIn(){
                try{
                if(token){
                    let response= await axios.get(url+"/me",{
                        headers:{
                            "authorization":"Bearer "+token
                        }
                    });
                    if(response.status>299 || response.status<200){
                        localStorage.removeItem("token");
                        setIsLoggedIn(false);
                    }
                    else{
                        setIsLoggedIn(true);
                    }
                }else{
                    setIsLoggedIn(false);
                }
            }catch(ex){
                setIsLoggedIn(false);
                localStorage.removeItem("token");
            }
            }
            checkIsLoggedIn();
           
        },[token])

       
       
        return(
            <MyContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
                {children}
            </MyContext.Provider>
        )
}