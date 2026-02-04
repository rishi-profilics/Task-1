import { Link, Navigate, useNavigate } from "react-router-dom";

export default function NotFound() {
  const token = localStorage.getItem("token");
    const navigate = useNavigate()
  const handleRedirect = () => {
    if(token){
        navigate("/")
    }else{
        navigate("/login")
    }
  }

  return token ? (
    <div className="w-screen h-screen flex items-center  flex-col gap-6 justify-center bg-zinc-300">
      <h1 className="text-6xl text-zinc-600 font-semibold text-center">
        404 <br /> Page Not Found
      </h1>
      
        <button onClick={handleRedirect} className="bg-slate-500 px-3 py-2 rounded-sm text-white">
          Home Page
        </button>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}
