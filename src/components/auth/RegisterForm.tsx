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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterFormData, registerSchema } from "@/validation/authValidation";
import { registerThunk } from "@/redux/auth/authThunk";
import { useAppDispatch } from "@/store/hooks";

const RegisterForm = ({ switchToLogin }: { switchToLogin: () => void }) => {
  const dispatch = useAppDispatch();

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(
      registerThunk({ email: data.email, password: data.password })
    );

    if (registerThunk.fulfilled.match(result)) {
      console.log("User registered successfully:", result.payload);
      switchToLogin();
    } else {
      console.error("Registration failed:", result.payload as string);
    }
  };

  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={registerForm.control}
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
                    registerForm.formState.errors.email
                      ? "border-red-500 focus:outline-none focus:ring-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-500">
                {registerForm.formState.errors.email?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  className={`w-full ${
                    registerForm.formState.errors.password
                      ? "border-red-500 focus:outline-none focus:ring-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-500">
                {registerForm.formState.errors.password?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                  className={`w-full ${
                    registerForm.formState.errors.confirmPassword
                      ? "border-red-500 focus:outline-none focus:ring-red-500"
                      : ""
                  }`}
                />
              </FormControl>
              <FormMessage className="text-red-500">
                {registerForm.formState.errors.confirmPassword?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button className="w-full bg-[#222a63] text-white cursor-pointer hover:bg-[#1a1f46]">
          Register
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
