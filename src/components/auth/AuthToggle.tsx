import { Button } from "../ui/button";

interface AuthToggleProps {
  isLogin: boolean;
  toggleForm: () => void;
}

const AuthToggle = ({ isLogin, toggleForm }: AuthToggleProps) => {
  return (
    <div className="text-center mt-4">
      <Button
        onClick={toggleForm}
        className="text-sm text-[#222a63] hover:underline cursor-pointer"
      >
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </Button>
    </div>
  );
};

export default AuthToggle;
