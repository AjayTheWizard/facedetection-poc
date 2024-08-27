import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import * as faceapi from '@vladmandic/face-api';


export default function HomePage() {
  const [modelsLoaded, setModelsLoaded] = useState(false); // Track model loading

  useEffect(() => {
    // Load face-api models when the component mounts
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading face-api models", error);
      }
    };
    loadModels();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen md:justify-center pt-16 items-center flex-col gap-8">
      <h1 className="md:text-4xl text-xl font-thin text-center">Face Detector PoC</h1>
      {modelsLoaded ?
        <div className="mx-auto flex flex-col gap-4">
          <button className="bg-purple-600 px-3 text-md hover:ring-2 hover:ring-white duration-300 transition-all hover:bg-purple-700 py-2" onClick={() => navigate("/register")}>
            Register
          </button>
          <button className="bg-purple-600 px-3 text-md hover:ring-2 hover:ring-white duration-300 transition-all hover:bg-purple-700 py-2" onClick={() => navigate("/verify")}>
            Verify
          </button>
        </div>
        :
        <h1>Please wait while model is being loaded!!!</h1>
      }
    </div >
  )
} 