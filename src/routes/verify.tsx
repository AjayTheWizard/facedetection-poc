import { useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import "@tensorflow/tfjs";
import * as faceapi from '@vladmandic/face-api';
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../lib/firebase";

export default function VerifyPage() {
  const webcamRef = useRef<ReactWebcam>(null);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if(isLoading) return;
    try {
      setIsLoading(true);

      if (!name.trim()) {
        alert("Please enter your name before verification");
        return;
      }

      const img = webcamRef.current?.getScreenshot();
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
            console.log("Captured descriptor:", descriptor);

            const faceDataFB = collection(db, "faceData");
            const existingQuery = query(faceDataFB, where("name", '==', name));
            const existingDoc = await getDocs(existingQuery);
            if (existingDoc.empty) {
              setVerificationResult(`No User with name: ${name} found at Database`);
              return;
            }
            const dbDescriptor = existingDoc.docs[0].data().descriptor as number[];
            if (Array.isArray(dbDescriptor) && descriptor.length === dbDescriptor.length) {
              const distance = faceapi.euclideanDistance(descriptor, dbDescriptor);
              if (distance < 0.45) { // Threshold for similarity
                setVerificationResult(`Successfully verified as ${name}`);
              } else {
                setVerificationResult("Face does not match the registered user");
              }
            } else {
              setVerificationResult("Descriptor length mismatch or invalid stored descriptor");
            }
          } else {
            setVerificationResult("No face detected");
          }
        } catch (error) {
          console.error("Error during face verification:", error);
        }
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center flex-col gap-5">
      <h1 className="text-2xl">Verify Page</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="focus:outline-none bg-zinc-800 p-2"
      />
      <ReactWebcam mirrored ref={webcamRef} width={640 * 0.8} height={400 * 0.8} className="border-2 mx-auto border-white" />
      <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white" onClick={handleVerify}>
        {isLoading ? "Verifying..." : "Verify"}
      </button>
      {verificationResult && <p>{verificationResult}</p>}
    </div>
  );
}
