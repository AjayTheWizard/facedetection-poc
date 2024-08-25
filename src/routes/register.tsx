import { useRef, useState, useEffect } from "react";
import ReactWebcam from "react-webcam";
import * as faceapi from '@vladmandic/face-api';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../lib/firebase";

export default function RegisterPage() {
  const webcamRef = useRef<ReactWebcam>(null);
  const [name, setName] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false); // Track model loading

  useEffect(() => {
    // Load face-api models when the component mounts
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setModelsLoaded(true); // Set the state to true once models are loaded
      } catch (error) {
        console.error("Error loading face-api models", error);
      }
    };
    loadModels();
  }, []);

  const handleCapture = async () => {
    if (!modelsLoaded) {
      alert("Models are still loading, please wait a moment...");
      return;
    }

    if (!webcamRef.current) {
      alert("Webcam not found!");
      return;
    }

    if (!name.trim()) {
      alert("Name field is empty!");
    }

    const img = webcamRef.current.getScreenshot();
    if (!img) {
      alert("Failed to capture image");
      return;
    }

    const imgElement = new Image();
    imgElement.src = img;
    imgElement.onload = async () => {
      try {
        const detection = await faceapi.detectSingleFace(imgElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
          const { descriptor } = detection;
          console.log("Face descriptor:", descriptor);

          const faceDataFB = collection(db, "faceData");
          const existingQuery = query(faceDataFB, where("name", '==', name));
          const existingDoc = await getDocs(existingQuery);
          if (!existingDoc.empty) {
            alert(`User with name: ${name} already exists!`);
            return;
          }
          try {
            addDoc(faceDataFB, {
              name,
              descriptor: Array.prototype.slice.call(descriptor)
            });
          } catch (e) {
            console.error(e);
            alert("Something went wrong at Storing Database");
          }
          // Store the name and descriptor in localStorage (or send to a backend)
          const storedData = localStorage.getItem("faceData");
          const faceData = storedData ? JSON.parse(storedData) : [];
          faceData.push({ name, descriptor });
          localStorage.setItem("faceData", JSON.stringify(faceData));

          alert(`Face for ${name} registered successfully!`);
        } else {
          alert("No face detected, please try again.");
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    };
  };
  const screenWidth = screen.width > 768 ? 512 : screen.width * 0.8;
  const screenHeight = screenWidth / 1.6;
  return (
    <div className="w-full flex justify-center items-center flex-col gap-5">
      <h1 className="text-2xl">Register Page</h1>
      <ReactWebcam mirrored ref={webcamRef} width={screenWidth} height={screenHeight} className="border-2 mx-auto border-white" />
      <div className="flex flex-col justify-center gap-2">
        <label htmlFor="name">Your Name</label>
        <input value={name} onChange={e => setName(e.target.value)} id="name" className="focus:outline-none bg-zinc-800 p-2" />
        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white" onClick={handleCapture}>
          Capture
        </button>
      </div>
    </div>
  );
}
