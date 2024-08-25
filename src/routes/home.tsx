import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen md:justify-center pt-16 items-center flex-col gap-8">
      <h1 className="md:text-4xl text-xl font-thin text-center">Face Detector POC</h1>
      <div className="mx-auto flex flex-col gap-4">
        <button className="bg-purple-600 px-3 text-md hover:ring-2 hover:ring-white duration-300 transition-all hover:bg-purple-700 py-2" onClick={() => navigate("/register")}>
          Register
        </button>
        <button className="bg-purple-600 px-3 text-md hover:ring-2 hover:ring-white duration-300 transition-all hover:bg-purple-700 py-2" onClick={() => navigate("/verify")}>
          Verify
        </button>
      </div>
    </div >
  )
} 