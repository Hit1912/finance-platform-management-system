import { Button } from "@/components/ui/button";
import { Loader, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { useUpdateReportSettingMutation } from "@/features/report/reportAPI";
import { updateCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string(),
  frequency: z.string(),
  isEnabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleReportForm = ({
  onCloseDrawer,
}: {
  onCloseDrawer: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { user, reportSetting } = useTypedSelector((state) => state.auth);

  const [updateReportSetting, { isLoading }] = useUpdateReportSettingMutation();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      isEnabled: true,
      frequency: "MONTHLY",
    },
  });

  useEffect(() => {
    if (user && reportSetting) {
      form.reset({
        email: user?.email,
        isEnabled: reportSetting?.isEnabled,
        frequency: reportSetting?.frequency,
      });
    }
  }, [user, form, reportSetting]);

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    const payload = { isEnabled: values.isEnabled };
    updateReportSetting(payload)
      .unwrap()
      .then(() => {
        dispatch(updateCredentials({ reportSetting: payload }));
        onCloseDrawer();
        toast.success("Report settings updated successfully");
      })
      .catch((error) => {
        toast.error(error.data.message || "Failed to update report settings");
      });
  };

  const getScheduleSummary = () => {
    if (!form.watch("isEnabled")) {
      return "Reports are currently deactivated";
    }
    return "Report will be sent once a month on the 1st day of the next month";
  };

  return (
    <div className="p-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 relative z-10">
            {/* Enable/Disable Module */}
            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "flex flex-row items-center justify-between rounded-2xl border p-6 transition-all duration-300 backdrop-blur-md",
                    field.value
                      ? "bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.1)]"
                      : "bg-white/[0.03] border-white/10 opacity-70"
                  )}
                >
                  <div className="space-y-1">
                    <FormLabel className="text-lg font-bold text-white tracking-tight">Monthly Insights</FormLabel>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                      {field.value ? "Status: Receiving Reports" : "Status: Notifications Off"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-indigo-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className={cn("space-y-6 transition-all duration-300", !form.watch("isEnabled") && "opacity-50 pointer-events-none grayscale-[0.5]")}>
              {/* Email Control */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Notification Email</FormLabel>
                    <div className="flex items-center space-x-3 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-1 group/input focus-within:border-indigo-500/40 focus-within:bg-white/[0.04] transition-all">
                      <Mail className="size-4 text-indigo-400/70" />
                      <FormControl>
                        <Input
                          placeholder="Email address"
                          disabled={true}
                          {...field}
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-11 text-sm font-semibold text-slate-300"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              {/* Frequency Control */}
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Delivery Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={true}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="h-12 bg-white/[0.02] border-white/10 rounded-xl px-4 focus:ring-1 focus:ring-indigo-500/40 hover:bg-white/[0.04] transition-all text-sm font-semibold text-slate-300">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-card border-white/10">
                        <SelectItem value="MONTHLY" className="rounded-lg">Monthly Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Schedule Status Card */}
            <div className={cn(
              "relative overflow-hidden p-6 rounded-2xl border transition-all duration-500",
              form.watch("isEnabled")
                ? "bg-indigo-500/5 border-indigo-500/20"
                : "bg-white/[0.02] border-white/5 opacity-50"
            )}>
              <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-3 text-indigo-400">
                <span className="relative flex h-2 w-2">
                  <span className={cn(
                    "absolute inline-flex h-full w-full rounded-full opacity-75",
                    form.watch("isEnabled") ? "animate-ping bg-indigo-500" : "bg-slate-600"
                  )}></span>
                  <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    form.watch("isEnabled") ? "bg-indigo-500" : "bg-slate-600"
                  )}></span>
                </span>
                Automation Engine
              </h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                {getScheduleSummary()}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl shadow-[0_8px_20px_rgba(79,70,229,0.3)] transition-all duration-300 active:scale-[0.98] group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="size-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>Save Report Settings</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleReportForm;
