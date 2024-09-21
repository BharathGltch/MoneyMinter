import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";

export default function Video(){

          let {videoId}=useParams();
          videoId="39e51a56-4d5e-4a7e-b682-48cf3b7e2f15";
          if(!videoId){
            return(
              <div>
                    Video Not Found
              </div>
            )
          }

          const [blobUrl,setBlobUrl]=useState<string|null>();
          let url=import.meta.env.VITE_SERVER_URL;
          console.log("Video Url in React is ",url);
          url=url?url+"/video/"+videoId:"http://localhost:3000/videos";
          console.log("The final url is",url);
          let token=localStorage.getItem("token");
          token=token?token:"someThings"
          token="Bearer "+token;
          useEffect(()=>{
            let getVideo=async ()=>{
               let response=await axios.get(url,{
                  headers:{
                    "Authorization":token
                  }
                });
                if(response.status>299 || response.status<200){
                  return(
                    <div>
                      Something went wrong
                    </div>
                  )
                }
               let blob=response.data.blob();
               const streamUrl=URL.createObjectURL(blob);
               setBlobUrl(streamUrl);
            }
            getVideo();

            return ()=>{
              if(blobUrl){
                URL.revokeObjectURL(blobUrl);
              }
            }
          },[videoId])
       

        async function handleDownload(){
            const response=await axios(`http://localhost:3000/videos`,{
                headers:{
                "authorization":token
                },
                responseType:"blob"
                
            });
            if(response.status>=300 || response.status<=199){
              return(
                <div>
                  Video Not Found
                </div>
              )
            }
            const blob=await response.data;

            const url=URL.createObjectURL(blob);
            const a =document.createElement('a');
            a.href=url;
            a.download='downloaded-video.mp4';
            document.body.appendChild(a);
            a.click();
            //
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

       

    return(
      <div>
          {blobUrl?(<div> <ReactPlayer
            controls
            url={blobUrl}
            width={230}
            height={1280}/>
                 <button onClick={handleDownload}>Downloaded Video</button></div>):(<div>Loading Video</div>)
            }
        
        </div>

           
    )
}