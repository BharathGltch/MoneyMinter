import ChangingText from "./ChangingText";
import GenVideo from "./GenVideo";
import Video from "../../public/HomeBackground.mp4";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleCanPlay = () => {
      setIsLoading(false); // Video can play, stop showing the loading message
    };

    if (videoRef.current) {
      // Use the correct event name 'canplay' (all lowercase)
      videoRef.current.addEventListener("canplay", handleCanPlay);
    }

    return () => {
      if (videoRef.current) {
        // Clean up the event listener when the component unmounts
        videoRef.current.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, []);

  return (

    <div className="w-screen h-full">
      <video
            ref={videoRef}
            preload="auto"
            autoPlay
            muted
            loop
            className="fixed top-0 left-0 w-full h-full object-cover z-0"
            id="backGroundVideo"
          >
            <source src={Video} type="video/mp4" />
          </video>

      {isLoading && (
        <>
          <Loading/>
        </>
      )}

      {!isLoading && (
        <>
          
          <div className="relative z-10 mx-40">
            <div className="flex pt-[100px] z-20">
              <ChangingText />
            </div>
            <div className="flex justify-center items-center mt-[100px]">
              <div>
                <h3 className="text-2xl font-bold text-cyan-400">Make your own short vids</h3>
                <h3 className="text-center text-2xl font-bold text-cyan-400">for free!</h3>
              </div>
            </div>
            <div className="flex justify-center items-center m-5 z-30">
              <GenVideo />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
