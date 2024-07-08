import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";

export default function Layout(){
    return(
        <div className="flex flex-col min-h-screen">
            <div className="z-50">
            <Appbar></Appbar>
            </div>
            <div className="flex-1">
            <Outlet/>
            </div>
        </div>
    )
}