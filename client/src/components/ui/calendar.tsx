"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-2 relative items-center w-full mb-2",
        caption_label: "text-sm font-bold text-white tracking-tight",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 bg-white/5 border border-white/10 p-0 text-slate-400 hover:text-white hover:bg-white/10 transition-all rounded-lg"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2",
        head_cell:
          "text-slate-500 rounded-md w-9 font-bold text-[0.7rem] uppercase tracking-widest",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-white/5 [&:has([aria-selected].day-range-end)]:rounded-r-xl",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-xl [&:has(>.day-range-start)]:rounded-l-xl first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl"
            : "[&:has([aria-selected])]:rounded-xl"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all rounded-xl aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-indigo-600 aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-indigo-600 aria-selected:text-white",
        day_selected:
          "bg-indigo-600 text-white hover:!bg-indigo-700 !text-white hover:text-white focus:bg-indigo-600 focus:text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]",
        day_today: "bg-white/10 text-white border border-indigo-500/50",
        day_outside:
          "day-outside text-slate-600 aria-selected:bg-white/5 aria-selected:text-slate-500",
        day_disabled: "text-slate-700 opacity-50 pointer-events-none",
        day_range_middle:
          "aria-selected:bg-white/10 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
