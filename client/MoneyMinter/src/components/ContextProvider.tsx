import React,{createContext,useState,ReactNode} from "react";

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
        return(
            <MyContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
                {children}
            </MyContext.Provider>
        )
}