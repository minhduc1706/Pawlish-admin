import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginFormData, loginSchema } from "@/validation/authValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "@/redux/auth/authThunk";
import { useAppDispatch } from "@/store/hooks";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(
      loginThunk({ email: data.email, password: data.password })
    );

    if (loginThunk.fulfilled.match(result)) {
      console.log("User login successfully:", result.payload);
      navigate("/dashboard");
    } else {
      console.error("Login failed:", result.payload);
    }
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="email"
                  placeholder="Email"
                  className={`w-full ${
                    loginForm.formState.errors.email
                      ? "border-red-500 focus:outline-none focus:ring-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-500">
                {loginForm.formState.errors.email?.message}
              </FormMessage>{" "}
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  className={`w-full ${
                    loginForm.formState.errors.password
                      ? "border-red-500 focus:outline-none focus:ring-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-500">
                {loginForm.formState.errors.password?.message}
              </FormMessage>{" "}
            </FormItem>
          )}
        />
        <Button className="w-full bg-[#222a63] text-white cursor-pointer hover:bg-[#1a1f46]">
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
