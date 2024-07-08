import { Button } from "@mui/material"

export default function Appbar(){
    return(
        <div className="shadow-lg bg-[#FFFFFF]">
        <div className="flex justify-between">
            <div className="flex">
                <img src="https://t3.ftcdn.net/jpg/04/74/05/94/360_F_474059464_qldYuzxaUWEwNTtYBJ44VN89ARuFktHW.jpg" width={100} height={100} />
                <p className="-ml-4 py-6 font-sans text-lg">Mint</p>
            </div>
            
            <div className="mt-5 mr-6">
               <Button variant="contained">Login</Button> 
            </div>
        </div>
    </div>
    )
}