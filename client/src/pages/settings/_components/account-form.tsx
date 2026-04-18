import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { Camera, Loader } from "lucide-react";
import { useUpdateUserMutation } from "@/features/user/userAPI";
import { updateCredentials } from "@/features/auth/authSlice";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100)
    .optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);

  const [file, setFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [updateUserMutation, { isLoading }] = useUpdateUserMutation();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = (values: AccountFormValues) => {
    if (isLoading) return;

    // At least one of name or file must be provided
    if (!values.name && !file) {
      toast.error("Please update your name or choose a new profile picture.");
      return;
    }

    const formData = new FormData();
    if (values.name) formData.append("name", values.name);
    if (file) formData.append("profilePicture", file);

    updateUserMutation(formData)
      .unwrap()
      .then((response) => {
        dispatch(
          updateCredentials({
            user: {
              profilePicture: response.data.profilePicture,
              name: response.data.name,
            },
          })
        );
        setFile(null); // clear file after success
        toast.success("Account updated successfully!");
      })
      .catch((error) => {
        const msg =
          error?.data?.message ||
          error?.error ||
          "Failed to update account. Please try again.";
        toast.error(msg);
      });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, GIF, or WebP).");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5 MB.");
      return;
    }

    setFile(selected);

    // Show local preview instantly
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(selected);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar picker */}
        <div className="flex flex-col items-start space-y-3">
          <FormLabel>Profile Picture</FormLabel>
          <div className="flex items-center gap-5">
            {/* Avatar with camera overlay */}
            <label htmlFor="avatar-upload" className="relative cursor-pointer group">
              <Avatar className="h-20 w-20 ring-2 ring-white/10 group-hover:ring-primary/50 transition-all duration-300">
                <AvatarImage
                  src={avatarPreview || user?.profilePicture || ""}
                  className="!object-cover !object-center"
                />
                <AvatarFallback className="text-2xl bg-slate-800">
                  {form.watch("name")?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {/* Camera icon overlay */}
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </label>

            <div className="flex flex-col gap-2">
              <Input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="max-w-[240px] text-sm cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF or WebP · Max 5 MB
              </p>
              {file && (
                <p className="text-xs text-primary font-medium">
                  ✓ {file.name} selected
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          disabled={isLoading} 
          type="submit" 
          className="group relative flex items-center gap-2 px-8 h-12 bg-indigo-600 hover:bg-indigo-500 text-white border-0 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {isLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin mr-2" />
              <span className="font-bold tracking-tight">Saving changes...</span>
            </>
          ) : (
            <>
              <span className="font-bold tracking-tight text-lg">Save Changes</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
