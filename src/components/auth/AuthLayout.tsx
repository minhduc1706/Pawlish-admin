import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthToggle from "@/components/auth/AuthToggle";
import { Button } from "../ui/button";

const AuthLayout = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);
  const switchToLogin = () => setIsLogin(true); 

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-[#222a63] text-white flex items-center justify-center p-8">
        <Button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 text-white bg-transparent border-2 border-white rounded-full px-3 py-1 hover:bg-white hover:text-[#222a63] cursor-pointer"
        >
          ← Back
        </Button>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Pawlish</h1>
          <p className="text-lg">
            Discover amazing products for your furry friends!
          </p>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img src="/icon.png" alt="Logo" className="size-40" />
          </div>
          {isLogin ? <LoginForm /> : <RegisterForm switchToLogin={switchToLogin}/>}
          <AuthToggle isLogin={isLogin} toggleForm={toggleForm} />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
