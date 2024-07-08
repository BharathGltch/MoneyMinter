import ChangingText from "./ChangingText";
import GenVideo from "./GenVideo";

export default function Home(){
    return(
        <div className="w-screen h-dvh bg-[#EEEEEE]">
        <div className="mx-40">
          <div className="flex pt-[100px]">
            <ChangingText/> 
          </div>
          <div className="flex justify-center items-center mt-[100px]">
            <div>
            <h3 className="text-2xl font-bold">Make your own short vids</h3>
            <h3 className="text-center text-2xl font-bold">for free!</h3> 
            </div>
          </div >
          <div className="flex justify-center items-center m-5" >
          <GenVideo/>
          </div>
        </div>
      </div>
    )
}