import PacmanLoader from "react-spinners/PacmanLoader";

export default function Loading(){

        return (
                <div className="fixed top-0 left-0 h-full w-full bg-black flex items-center justify-center">
                    <div className="text-white">
                        <PacmanLoader color="#FFFFFF"/>
                    </div>
                </div>
        )
}