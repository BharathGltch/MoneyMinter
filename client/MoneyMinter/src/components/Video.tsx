import { useParams } from "react-router-dom";
import {useRef,useEffect} from 'react';

export default function Video(){
       

       

    return(
        <video  width='800' height='240' className="px-5" controls>
            <source src={`http://localhost:3000/videos`} type='video/mp4' />
            Your browser does not support the user tag
        </video>
    )
}