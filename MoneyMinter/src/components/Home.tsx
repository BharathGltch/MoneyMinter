import  { useEffect, useRef, useState } from "react";
import ChangingText from "./ChangingText";
import GenVideo from "./GenVideo";
import Video from "../../public/HomeBackground.mp4";
import Loading from "./Loading";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleCanPlay = () => {
      setIsLoading(false);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("canplay", handleCanPlay);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("canplay", handleCanPlay);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <video
        ref={videoRef}
        preload="auto"
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        id="backGroundVideo"
      >
        <source src={Video} type="video/mp4" />
      </video>

      {isLoading && <Loading />}

      {!isLoading && (
        <div className="relative z-10 h-full w-full overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-full flex flex-col justify-center">
            <div className="flex-shrink-0">
              <ChangingText />
            </div>
            <div className="mt-8 sm:mt-12 text-center flex-shrink-0">
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-400">
                Make your own short vids
              </h3>
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-400">
                for free!
              </h3>
            </div>
            <div className="flex justify-center items-center mt-8 sm:mt-12 flex-shrink-0">
              <GenVideo />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}