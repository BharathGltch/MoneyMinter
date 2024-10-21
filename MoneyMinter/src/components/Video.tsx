import axios from "axios";
import { useEffect, useState, memo } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import ParticlesBack from "./ParticlesBack";


const MemoizedParticle = memo(ParticlesBack);

export default function Video() {

  let { videoId } = useParams();

  if (!videoId) {
    return (
      <div>
        Video Not Found
      </div>
    )
  }

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  let url = import.meta.env.VITE_SERVER_URL;
  console.log("Video Url in React is ", url);
  url = url ? url + "/video/" + videoId : "http://localhost:3000/videos";
  console.log("The final url is", url);
  let token = localStorage.getItem("token");
  token = token ? token : "someThings"
  token = "Bearer " + token;
  useEffect(() => {
    let getVideo = async () => {
      try {
        let response = await axios.get(url, {
          headers: {
            "Authorization": token
          },
          responseType: "blob"
        });
        console.log("response.status is ", response.status);
        if (response.status > 299 || response.status < 200) {
          setError(`Error fetching the video`);
          return;
        }
        let blob = response.data;
        const streamUrl = URL.createObjectURL(blob);
        setBlobUrl(streamUrl);
      } catch (ex) {
        console.log("There was an error while fetching the video", ex);
        setError("An error occurred while fetching the video");

      } finally {
        setLoading(false);
      }
    }
    getVideo();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    }
  }, [])


  async function handleDownload() {
    const response = await axios(url, {
      headers: {
        "authorization": token
      },
      responseType: "blob"

    });
    if (response.status >= 300 || response.status <= 199) {
      return (
        <div>
          Video Not Found
        </div>
      )
    }
    const blob = await response.data;

    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = 'downloaded-video.mp4';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }



  return (
    <div className="relative z-0 max-h-screen max-w-screen" >

      <div className="fixed top-0 left-0 h-full w-full z-5">
        <MemoizedParticle />
      </div>

      <div className="relative z-15 container mx-auto px-4">
        {loading && <div>Loading Video..</div>}
        {error && <div className="text-center text-white">{error}</div>}
        {!loading && !error && blobUrl && (
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-md h-[calc(100vh-8rem)] flex items-center justify-center">
              <div className="relative w-full" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                <ReactPlayer
                  controls
                  url={blobUrl}
                  width="100%"
                  height="100%"
                  className="rounded-lg !h-auto max-h-[calc(100vh-8rem)]"
                  style={{
                    aspectRatio: '9/16',
                    maxHeight: 'calc(100vh - 8rem)'
                  }}
                />
              </div>
            </div>
            <Button 
              onClick={handleDownload}
              className="mt-4"
            >
              Download Video
            </Button>
          </div>
        )}
      </div>

    </div>


  )
}