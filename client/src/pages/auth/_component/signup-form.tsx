import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader, Github } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterMutation } from "@/features/auth/authAPI";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"form"> {
  className?: string;
}

const SignUpForm = ({ className, ...props }: SignUpFormProps) => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    register(values)
      .unwrap()
      .then(() => {
        form.reset();
        toast.success("Sign up successful");
        navigate(AUTH_ROUTES.SIGN_IN);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data?.message || "Failed to sign up");
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="grid gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-slate-300 font-medium text-xs uppercase tracking-wider">Full Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder="John Doe"
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-slate-300 font-medium text-xs uppercase tracking-wider">Email Address</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-slate-300 font-medium text-xs uppercase tracking-wider">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-300 h-11"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#020617] px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-800 bg-transparent hover:bg-slate-900 text-slate-300 transition-all duration-300 h-11"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-4 transition-colors font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;

