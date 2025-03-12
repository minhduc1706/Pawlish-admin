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
        className="text-sm bg-white text-black hover:underline cursor-pointer hover:bg-transparent"
      >
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </Button>
    </div>
  );
};

export default AuthToggle;
