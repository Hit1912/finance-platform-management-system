import * as z from "zod";
import { useEffect, useState } from "react";
import { Calendar, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import RecieptScanner from "./reciept-scanner";
import {
  _TRANSACTION_FREQUENCY,
  _TRANSACTION_TYPE,
  CATEGORIES,
  PAYMENT_METHODS,
} from "@/constant";
import { Switch } from "../ui/switch";
import CurrencyInputField from "../ui/currency-input";
import { SingleSelector } from "../ui/single-select";
import { AIScanReceiptData } from "@/features/transaction/transationType";
import {
  useCreateTransactionMutation,
  useGetSingleTransactionQuery,
  useUpdateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE]),
  category: z.string().min(1, { message: "Please select a category." }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  paymentMethod: z
    .string()
    .min(1, { message: "Please select a payment method." }),
  isRecurring: z.boolean(),
  frequency: z
    .enum([
      _TRANSACTION_FREQUENCY.DAILY,
      _TRANSACTION_FREQUENCY.WEEKLY,
      _TRANSACTION_FREQUENCY.MONTHLY,
      _TRANSACTION_FREQUENCY.YEARLY,
    ])
    .nullable()
    .optional(),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm = (props: {
  isEdit?: boolean;
  transactionId?: string;
  onCloseDrawer?: () => void;
}) => {
  const { onCloseDrawer, isEdit = false, transactionId } = props;

  const [isScanning, setIsScanning] = useState(false);

  const { data, isLoading } = useGetSingleTransactionQuery(
    transactionId || "",
    { skip: !transactionId }
  );
  const editData = data?.transaction;

  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();

  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: _TRANSACTION_TYPE.INCOME,
      category: "",
      date: new Date(),
      paymentMethod: "",
      isRecurring: false,
      frequency: null,
      description: "",
      receiptUrl: "",
    },
  });

  useEffect(() => {
    if (isEdit && transactionId && editData) {
      form.reset({
        title: editData?.title,
        amount: editData.amount.toString(),
        type: editData.type,
        category: editData.category?.toLowerCase(),
        date: new Date(editData.date),
        paymentMethod: editData.paymentMethod,
        isRecurring: editData.isRecurring,
        frequency: editData.recurringInterval,
        description: editData.description,
      });
    }
  }, [editData, form, isEdit, transactionId]);

  // Auto-Categorization Logic
  const title = form.watch("title");
  useEffect(() => {
    if (isEdit || !title || title.length < 3) return;

    const autoCategoryMap: Record<string, string> = {
      "movie": "entertainment",
      "cinema": "entertainment",
      "netflix": "entertainment",
      "disney": "entertainment",
      "game": "entertainment",
      "food": "food & drink",
      "zomato": "food & drink",
      "swiggy": "food & drink",
      "restaurant": "food & drink",
      "burger": "food & drink",
      "pizza": "food & drink",
      "coffee": "food & drink",
      "starbucks": "food & drink",
      "rent": "housing",
      "electricity": "housing",
      "maintenance": "housing",
      "gas": "housing",
      "petrol": "transport",
      "fuel": "transport",
      "uber": "transport",
      "ola": "transport",
      "train": "transport",
      "flight": "transport",
      "metro": "transport",
      "amazon": "shopping",
      "flipkart": "shopping",
      "clothes": "shopping",
      "grocery": "shopping",
      "shopping": "shopping",
      "hospital": "healthcare",
      "doctor": "healthcare",
      "medicine": "healthcare",
      "clinic": "healthcare",
      "gym": "healthcare",
      "salary": "income",
      "bonus": "income",
    };

    const lowerTitle = title.toLowerCase();
    const matchedKeyword = Object.keys(autoCategoryMap).find(keyword => 
      lowerTitle.includes(keyword)
    );

    if (matchedKeyword) {
      const currentCategory = form.getValues("category");
      if (!currentCategory) {
        form.setValue("category", autoCategoryMap[matchedKeyword]);
      }
    }
  }, [title, form, isEdit]);

  const frequencyOptions = Object.entries(_TRANSACTION_FREQUENCY).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, value]) => ({
      value: value,
      label: value.replace("_", " ").toLowerCase(),
    })
  );

  const handleScanComplete = (data: AIScanReceiptData) => {
    form.reset({
      ...form.getValues(),
      title: data.title || "",
      amount: data.amount.toString(),
      type: data.type || _TRANSACTION_TYPE.EXPENSE,
      category: data.category?.toLowerCase() || "",
      date: new Date(data.date),
      paymentMethod: data.paymentMethod || "",
      isRecurring: false,
      frequency: null,
      description: data.description || "",
      receiptUrl: data.receiptUrl || "",
    });
  };

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // if (isCreating || isUpdating) return;
    console.log("Form submitted:", values);
    const payload = {
      title: values.title,
      type: values.type,
      category: values.category,
      paymentMethod: values.paymentMethod,
      description: values.description || "",
      amount: Number(values.amount),
      date: values.date.toISOString(),
      isRecurring: values.isRecurring || false,
      recurringInterval: values.frequency || null,
    };
    if (isEdit && transactionId) {
      updateTransaction({ id: transactionId, transaction: payload })
        .unwrap()
        .then(() => {
          onCloseDrawer?.();
          toast.success("Transaction updated successfully");
        })
        .catch((error) => {
          toast.error(error.data.message || "Failed to update transaction");
        });
      return;
    }
    createTransaction(payload)
      .unwrap()
      .then(() => {
        form.reset();
        onCloseDrawer?.();
        toast.success("Transaction created successfully");
      })
      .catch((error) => {
        toast.error(error.data.message || "Failed to create transaction");
      });
  };

  return (
    <div className="relative pb-10 pt-8 px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-10">
            {/* Receipt Upload Section */}
            {!isEdit && (
              <RecieptScanner
                loadingChange={isScanning}
                onLoadingChange={setIsScanning}
                onScanComplete={handleScanComplete}
              />
            )}

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-5">
                  <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400/50">Classification</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-6"
                    disabled={isScanning}
                  >
                    <label
                      htmlFor={_TRANSACTION_TYPE.INCOME}
                      className={cn(
                        "relative flex cursor-pointer items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-5 transition-all duration-500 hover:bg-white/10 shadow-sm",
                        field.value === _TRANSACTION_TYPE.INCOME &&
                        "border-success/40 bg-success/5 shadow-2xl shadow-success/10 ring-1 ring-success/30"
                      )}
                    >
                      <RadioGroupItem
                        value={_TRANSACTION_TYPE.INCOME}
                        id={_TRANSACTION_TYPE.INCOME}
                        className="sr-only"
                      />
                      <span className={cn(
                        "text-xs font-black uppercase tracking-[0.2em] transition-colors",
                        field.value === _TRANSACTION_TYPE.INCOME ? "text-success" : "text-slate-500"
                      )}>Income</span>
                      {field.value === _TRANSACTION_TYPE.INCOME && (
                        <div className="absolute top-3 right-3 size-1.5 rounded-full bg-success shadow-[0_0_12px_rgba(var(--success),1)] animate-pulse" />
                      )}
                    </label>

                    <label
                      htmlFor={_TRANSACTION_TYPE.EXPENSE}
                      className={cn(
                        "relative flex cursor-pointer items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-5 transition-all duration-500 hover:bg-white/10 shadow-sm",
                        field.value === _TRANSACTION_TYPE.EXPENSE &&
                        "border-destructive/40 bg-destructive/5 shadow-2xl shadow-destructive/10 ring-1 ring-destructive/30"
                      )}
                    >
                      <RadioGroupItem
                        value={_TRANSACTION_TYPE.EXPENSE}
                        id={_TRANSACTION_TYPE.EXPENSE}
                        className="sr-only"
                      />
                      <span className={cn(
                        "text-xs font-black uppercase tracking-[0.2em] transition-colors",
                        field.value === _TRANSACTION_TYPE.EXPENSE ? "text-destructive" : "text-slate-500"
                      )}>Expense</span>
                      {field.value === _TRANSACTION_TYPE.EXPENSE && (
                        <div className="absolute top-3 right-3 size-1.5 rounded-full bg-destructive shadow-[0_0_12px_rgba(var(--destructive),1)] animate-pulse" />
                      )}
                    </label>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400/50">Identification</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What was this for?"
                      className="h-14 border-white/10 bg-white/5 placeholder:text-white/10 focus:bg-white/10 rounded-2xl font-bold transition-all focus:ring-[12px] focus:ring-accent-purple/5 focus:border-accent-purple/60 text-white shadow-inner"
                      {...field}
                      disabled={isScanning}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400/50">Valuation</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <CurrencyInputField
                        {...field}
                        className={cn(
                          "h-20 text-4xl font-black tracking-[calc(-0.05em)] border-white/10 bg-white/5 focus:bg-white/10 transition-all rounded-2xl px-8 shadow-inner",
                          field.value && Number(field.value) > 0 ? (form.watch("type") === _TRANSACTION_TYPE.INCOME ? "text-success" : "text-white") : "text-white"
                        )}
                        disabled={isScanning}
                        onValueChange={(value) => field.onChange(value || "")}
                        placeholder="0.00"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400/50">Category</FormLabel>
                    <SingleSelector
                      value={
                        CATEGORIES.find((opt) => opt.value === field.value) ||
                          field.value
                          ? { value: field.value, label: field.value }
                          : undefined
                      }
                      onChange={(option) => field.onChange(option.value)}
                      options={CATEGORIES}
                      placeholder="Select category"
                      creatable
                      disabled={isScanning}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-4">
                    <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400/50">Execution Date</FormLabel>
                    <Popover modal={false}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-14 pl-5 text-left font-bold rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white shadow-inner",
                              !field.value && "text-white/20"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="opacity-40">Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 text-accent-purple/60" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 !pointer-events-auto border-white/10 shadow-2xl rounded-2xl bg-slate-900"
                        align="start"
                      >
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date); 
                          }}
                          disabled={(date) => date < new Date("2023-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400/50">Payment Gateway</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isScanning}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-white/5 font-bold transition-all focus:ring-accent-purple/10 text-white shadow-inner">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value} className="rounded-xl my-1 mx-1 font-bold text-white/80 hover:text-white">
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-[24px] border border-white/5 bg-white/5 px-6 py-6 shadow-inner">
                  <div className="space-y-1">
                    <FormLabel className="text-sm font-black tracking-tighter uppercase text-white">
                      Recurring Cycle
                    </FormLabel>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {field.value
                        ? "Active standing order"
                        : "One-time execution"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isScanning}
                      checked={field.value}
                      className="cursor-pointer data-[state=checked]:bg-accent-purple"
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue(
                            "frequency",
                            _TRANSACTION_FREQUENCY.DAILY
                          );
                        } else {
                          form.setValue("frequency", null);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isRecurring") && (
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="recurring-control space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/50">Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      disabled={isScanning}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-white/5 font-bold transition-all focus:ring-accent-purple/10 text-white shadow-inner">
                          <SelectValue
                            placeholder="Select frequency"
                            className="!capitalize"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {frequencyOptions.map(({ value, label }) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="!capitalize font-bold text-white/80 hover:text-white"
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/50">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this transaction"
                      className="resize-none min-h-[140px] rounded-2xl border-white/10 bg-white/5 placeholder:text-white/10 focus:bg-white/10 font-bold transition-all focus:ring-accent-purple/5 text-white shadow-inner"
                      disabled={isScanning}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sticky bottom-0 bg-slate-950/80 backdrop-blur-3xl pt-8 pb-4 mt-12 -mx-8 px-8 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-20">
            <Button
              type="submit"
              className="btn-premium h-16 w-full shadow-[0_10px_30px_rgba(var(--accent-purple),0.3)]"
              disabled={isScanning || isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : null}
              {isEdit ? "Update Transaction" : "Save Transaction"}
            </Button>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
              <div className="p-8 rounded-[32px] bg-secondary/80 border border-border shadow-2xl flex flex-col items-center gap-4">
                <Loader className="h-12 w-12 animate-spin text-accent" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Syncing Data...</p>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;
