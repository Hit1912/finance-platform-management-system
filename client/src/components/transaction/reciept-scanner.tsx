import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScanText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AIScanReceiptData } from "@/features/transaction/transationType";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useAiScanReceiptMutation } from "@/features/transaction/transactionAPI";

interface ReceiptScannerProps {
  loadingChange: boolean;
  onScanComplete: (data: AIScanReceiptData) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

const ReceiptScanner = ({
  loadingChange,
  onScanComplete,
  onLoadingChange,
}: ReceiptScannerProps) => {
  const [receipt, setReceipt] = useState<string | null>(null);

  const {
    progress,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const [aiScanReceipt] = useAiScanReceiptMutation();

  const handleReceiptUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const formData = new FormData();
    formData.append("receipt", file);

    startProgress(10);
    onLoadingChange(true);
    // Simulate file upload and processing
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setReceipt(result);

      // Simulate scanning progress
      // Start progress
      let currentProgress = 10;
      const interval = setInterval(() => {
        const increment = currentProgress < 90 ? 10 : 1;
        currentProgress = Math.min(currentProgress + increment, 90);
        updateProgress(currentProgress);
      }, 250);

      aiScanReceipt(formData)
        .unwrap()
        .then((res) => {
          updateProgress(100);
          onScanComplete(res.data);
          toast.success("Receipt scanned successfully");
        })
        .catch((error) => {
          toast.error(error.data?.message || "Failed to scan receipt");
        })
        .finally(() => {
          clearInterval(interval);
          doneProgress();
          resetProgress();
          setReceipt(null);
          onLoadingChange(false);
        });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">Intelligence</Label>
      <div className="flex items-center gap-6 pb-10 border-b border-border/30">
        {/* Receipt Preview */}
        <div
          className={cn(
            "size-16 rounded-[22px] border border-border/40 shadow-inner bg-cover bg-center transition-all duration-500 relative overflow-hidden group",
            !receipt ? "bg-secondary/20" : "ring-4 ring-accent/20 border-accent/40"
          )}
          style={receipt ? { backgroundImage: `url(${receipt})` } : {}}
        >
          {!receipt && (
            <div className="flex h-full items-center justify-center text-muted-foreground/20">
              <ScanText size={24} className="stroke-[1.5] group-hover:text-accent transition-colors" />
            </div>
          )}
          {loadingChange && (
            <div className="absolute inset-0 bg-accent/10 backdrop-blur-[2px] pulse-glow" />
          )}
        </div>

        {/* Upload Input or Progress */}
        <div className="flex-1 space-y-1">
          {!loadingChange ? (
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="max-w-[320px] h-12 px-4 cursor-pointer text-xs border-border/40 bg-secondary/10 rounded-2xl file:mr-4 
                  file:rounded-xl file:border-0 file:bg-accent file:px-5 file:h-8
                  file:text-[10px] file:font-black file:uppercase file:tracking-[0.15em] file:text-accent-foreground 
                  hover:file:bg-accent/90 focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-muted-foreground/40 font-bold"
                  disabled={loadingChange}
                />
              </div>
              <p className="text-[10px] px-1 text-muted-foreground/30 font-black uppercase tracking-widest">
                Optical Scan • Auto-Extract Data
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              <div className="flex items-baseline justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent animate-pulse">
                  Neural Scan in Progress...
                </p>
                <span className="text-[10px] font-black text-muted-foreground/40">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 w-full bg-secondary/30 transition-all duration-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
