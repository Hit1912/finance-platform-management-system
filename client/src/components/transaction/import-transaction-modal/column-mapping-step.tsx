import { useMemo, useState } from "react";

import {
  BanIcon,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CsvColumn, TransactionField } from "@/@types/transaction.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ColumnMappingStepProps = {
  csvColumns: CsvColumn[];
  transactionFields: TransactionField[];
  mappings: Record<string, string>;
  onComplete: (mappings: Record<string, string>) => void;
  onBack: () => void;
};

type AvailableAttributeType =
  | { fieldName: string; required?: never } // For the "Do not import" option
  | TransactionField; // For the actual fields

const ColumnMappingStep = ({
  csvColumns,
  transactionFields,
  onComplete,
  onBack,
  ...props
}: ColumnMappingStepProps) => {
  const [mappings, setMappings] = useState<Record<string, string>>(
    props.mappings || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableAttributes: AvailableAttributeType[] = useMemo(
    () => [{ fieldName: "Skip" }, ...transactionFields],
    [transactionFields]
  );

  const handleMappingChange = (csvColumn: string, field: string) => {
    setMappings((prev) => ({
      ...prev,
      [csvColumn]: field,
    }));

    if (errors[csvColumn]) {
      //delete the csvColumn from errors
      delete errors[csvColumn];
      setErrors((prev) => ({ ...prev }));
    }
  };

  console.log(mappings, "mapping");

  const validateMappings = () => {
    const newErrors: Record<string, string> = {};
    const usedFields = new Set<string>();
    Object.entries(mappings).forEach(([csvColumn, field]) => {
      if (field !== "Skip" && usedFields.has(field)) {
        newErrors[csvColumn] = "Field already mapped";
      }
      if (field !== "Skip") usedFields.add(field);
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const finalMappings = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(mappings).filter(([_, field]) => field !== "Skip")
      );

      console.log(finalMappings, "maning");
      onComplete(finalMappings);
    }
  };

  const hasRequiredMappings = transactionFields.every(
    (field) =>
      !field.required || Object.values(mappings).includes(field.fieldName)
  );

  // Calculate the count of non-"none" mappings
  const validMappingsCount = Object.values(mappings).filter(
    (field) => field !== "Skip"
  ).length;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="p-10 md:p-14 space-y-12 relative flex flex-col items-center">
      <DialogHeader className="relative z-10 text-center flex flex-col items-center gap-3">
        <DialogTitle className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
          Field <span className="text-accent underline underline-offset-8 decoration-8 decoration-accent/20">Mapper</span>
        </DialogTitle>
        <DialogDescription className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
          Aligning Semantic Financial Data
        </DialogDescription>
      </DialogHeader>

      <div className="w-full bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden max-h-[480px] overflow-y-auto custom-scrollbar shadow-inner">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="!font-black !text-[10px] uppercase tracking-[0.2em] text-slate-400/50 py-6 pl-10">CSV Column</TableHead>
              <TableHead className="!font-black !text-[10px] uppercase tracking-[0.2em] text-slate-400/50 py-6 pr-10">System Definition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvColumns.map((column) => (
              <TableRow
                key={column.id}
                className={cn(
                  "border-b border-white/[0.04] hover:bg-white/[0.06] transition-all duration-300 group/row",
                  column.hasError && "bg-destructive/5 hover:bg-destructive/10"
                )}
              >
                <TableCell className="pl-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-inner group-hover/row:scale-110 transition-transform">
                      <FileSpreadsheet className="size-5 text-accent" />
                    </div>
                    <span className="text-sm font-black text-white/80 group-hover/row:text-white transition-colors">{column.name}</span>
                  </div>
                </TableCell>
                <TableCell className="pr-10 py-4">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-[20px] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-accent-purple/40 transition-all duration-300">
                    <HelpCircle className="size-4 text-slate-500" />
                    <Select
                      value={mappings[column.name] || ""}
                      onValueChange={(value) =>
                        handleMappingChange(column.name, value)
                      }
                    >
                      <SelectTrigger
                        className="h-7 border-none shadow-none focus:ring-0 p-0 text-sm font-black uppercase tracking-widest text-white/40 bg-transparent hover:text-white transition-colors"
                      >
                        <SelectValue
                          className="capitalize"
                          placeholder="Map to Field"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                        {availableAttributes.map((attr) => {
                          const isDisabled =
                            attr.fieldName !== "Skip" &&
                            attr.fieldName !== mappings[column.name] &&
                            Object.values(mappings).includes(attr.fieldName);

                          return (
                            <SelectItem
                              key={attr.fieldName}
                              value={attr.fieldName}
                              className="rounded-xl py-3 px-4 cursor-pointer hover:bg-white/5 transition-all focus:bg-white/10 font-bold uppercase tracking-widest text-[10px] text-white/60 focus:text-white data-[state=checked]:text-accent-purple"
                              disabled={isDisabled}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="capitalize">
                                  {attr.fieldName}
                                  {attr?.required && (
                                    <span className="text-accent ml-2">•</span>
                                  )}
                                </span>
                                {isDisabled && (
                                  <BanIcon className="size-3.5 opacity-30 ml-2" />
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors[column.name] && (
                    <p className="mt-2 ml-2 text-[9px] font-black uppercase tracking-[0.2em] text-destructive animate-pulse">
                      {errors[column.name]}
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center w-full pt-4">
        <Button variant="ghost" onClick={onBack} className="rounded-2xl h-14 px-8 hover:bg-white/5 text-slate-400 font-black uppercase tracking-widest text-[10px]">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={validateMappings}
          disabled={!hasRequiredMappings || hasErrors}
          className="btn-premium rounded-2xl h-14 px-10 shadow-[0_10px_30px_rgba(var(--accent-purple),0.3)] disabled:opacity-30 disabled:shadow-none transition-all font-black uppercase tracking-widest text-[10px]"
        >
          Verify Data ({validMappingsCount}/{transactionFields.length})
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ColumnMappingStep;
