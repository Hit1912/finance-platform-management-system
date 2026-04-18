import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImportIcon } from "lucide-react";
import FileUploadStep from "./fileupload-step";
import ColumnMappingStep from "./column-mapping-step";
import { CsvColumn, TransactionField } from "@/@types/transaction.type";
import ConfirmationStep from "./confirmation-step";


const ImportTransactionModal = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<CsvColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [csvData, setCsvData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const transactionFields: TransactionField[] = [
    { fieldName: 'title', required: true },
    { fieldName: 'amount', required: true },
    { fieldName: 'type', required: true },
    { fieldName: 'date', required: true },
    { fieldName: 'category', required: true },
    { fieldName: 'paymentMethod', required: true },
    { fieldName: 'description', required: false },
  ];

  // console.log(transactionFields, file, csvColumns, csvData, mappings);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = (file: File, columns: CsvColumn[], data: any[]) => {
    setFile(file);
    setCsvColumns(columns);
    setCsvData(data);
    setMappings({});
    setStep(2);
  };

  const resetImport = () => {
    setFile(null);
    setCsvColumns([]);
    setMappings({});
    setStep(1);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => resetImport(), 300);
  };

  const handleMappingComplete = (mappings: Record<string, string>) => {
    setMappings(mappings);
    setStep(3);
  };

  const handleBack = (step: 1 | 2 | 3) => {
    setStep(step);
  };



  const renderStep = () => {
    switch (step) {
      case 1:
        return <FileUploadStep onFileUpload={handleFileUpload} />;
      case 2:
        return (
          <ColumnMappingStep
            csvColumns={csvColumns}
            mappings={mappings}
            transactionFields={transactionFields}
            onComplete={handleMappingComplete}
            onBack={() => handleBack(1)}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            file={file}
            mappings={mappings}
            csvData={csvData}
            onBack={() => handleBack(2)}
            onComplete={() => handleClose()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Button
        variant="ghost"
        className="group/import relative flex items-center gap-2.5 h-10 px-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent-purple/30 rounded-xl transition-all duration-500 overflow-hidden"
        onClick={() => setOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-accent-purple/10 opacity-0 group-hover/import:opacity-100 transition-opacity" />
        <ImportIcon className="size-4 text-accent group-hover/import:scale-110 group-hover/import:text-accent-purple transition-all duration-500" />
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-300 group-hover/import:text-white transition-colors">Bulk Import</span>
      </Button>
      <DialogContent className="max-w-2xl bg-slate-950/95 backdrop-blur-[60px] border-white/5 p-0 overflow-y-auto max-h-[90vh] shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[40px] animate-in fade-in zoom-in-95 duration-500 custom-scrollbar">
        <div className="relative">
           {/* Immersive Background */}
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-purple/10 blur-[120px] rounded-full pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
           {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTransactionModal;
