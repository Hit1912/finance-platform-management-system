import { toast } from "sonner";
import { usePapaParse } from "react-papaparse";
import { FileUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MAX_FILE_SIZE, MAX_IMPORT_LIMIT } from "@/constant";
import { useProgressLoader } from "@/hooks/use-progress-loader";

interface CsvRow {
  [key: string]: string | undefined; // Define that rows can be indexed with strings
}

type FileUploadStepProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileUpload: (file: File, columns: any[], data: any[]) => void;
};

const FileUploadStep = ({ onFileUpload }: FileUploadStepProps) => {
  const { readString } = usePapaParse();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    progress,
    isLoading,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024} MB`
      );
      return;
    }
    resetProgress(); // Clear any previous progress
    startProgress();

    try {
      // First read the file as text
      const fileText = await file.text();
      // Then parse the CSV text
      readString<CsvRow>(fileText, {
        header: true,
        skipEmptyLines: true,
        fastMode: true,
        complete: (results) => {
          console.log(results, "results");
          if (results.data.length > MAX_IMPORT_LIMIT) {
            toast.error(
              `You can only import up to ${MAX_IMPORT_LIMIT} transactions.`
            );
            resetProgress();
            return;
          }

          updateProgress(40);

          const columns =
            results.meta.fields?.map((name: string) => ({
              id: name,
              name,
              sampleData:
                results.data[0]?.[name]?.slice(0, MAX_IMPORT_LIMIT) || "",
            })) || [];

          doneProgress();

          console.log(columns, results.data);

          setTimeout(() => {
            onFileUpload(file, columns, results.data);
          }, 500);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          resetProgress();
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      resetProgress();
    }
  };

  return (
    <div className="p-10 md:p-14 space-y-12 relative flex flex-col items-center">
      <DialogHeader className="relative z-10 text-center flex flex-col items-center gap-3">
        <DialogTitle className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
          Import <span className="text-accent underline underline-offset-8 decoration-8 decoration-accent/20">Data</span>
        </DialogTitle>
        <DialogDescription className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
          Bulk Transaction Synchronization System
        </DialogDescription>
      </DialogHeader>

      <div
        className={cn(
          "w-full rounded-[40px] border border-white/10 hover:border-accent-purple/40 transition-all duration-700 bg-white/[0.03] hover:bg-white/[0.06] group/drop p-14 md:p-20 cursor-pointer text-center relative overflow-hidden shadow-inner",
          isLoading && "opacity-60 cursor-not-allowed border-accent-purple/20"
        )}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 to-transparent opacity-0 group-hover/drop:opacity-100 transition-opacity" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />

        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="size-20 rounded-[24px] bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center group-hover/drop:scale-110 group-hover/drop:bg-accent-purple/20 transition-all duration-700 shadow-2xl">
            <FileUp className="size-10 text-accent-purple animate-pulse" />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Drop your CSV here</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">or click to browse your computer</p>
          </div>

          <div className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 shadow-inner">
            CSV Supported • Max 5MB
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center">
            <div className="w-full max-w-[300px] px-6 space-y-4 flex flex-col items-center">
              <div className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-widest text-accent-purple">
                <span>Optimizing Assets</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 w-full bg-white/5 border border-white/5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadStep;
