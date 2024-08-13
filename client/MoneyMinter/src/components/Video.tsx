import axios from "axios";
 
import ReactPlayer from "react-player";

export default function Video(){
       
        let url=import.meta.env.SERVER_URL;
        url=url?url+"/videos":"http://localhost:3000/videos";
        let token=localStorage.getItem("token");
        token=token?token:"someThings"
        token="Bearer "+token;

        async function handleDownload(){
            const response=await axios(`http://localhost:3000/videos`,{
                headers:{
                "authorization":"Bearer "+token
                },
                responseType:"blob"
                
            });
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
        <ReactPlayer
        controls
        url={url}
        width={230}
        height={1280}
        config={{
                file: {
                  hlsOptions: {
                    forceHLS: true,
                    debug: false,
                    xhrSetup: function(xhr:XMLHttpRequest,url:string) {
                        xhr.setRequestHeader('Authorization', token)
                    },
                  },
                },
              }}
            />
             <button onClick={handleDownload}>Downloaded Video</button>
        </div>

           
    )
}