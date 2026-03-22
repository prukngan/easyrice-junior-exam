import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  showTime?: boolean
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
  showTime = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', value: string) => {
    if (!date) return
    const newDate = new Date(date)
    let numValue = parseInt(value) || 0
    
    if (type === 'hours') {
      if (numValue < 0) numValue = 0
      if (numValue > 23) numValue = 23
      newDate.setHours(numValue)
    }
    if (type === 'minutes') {
      if (numValue < 0) numValue = 0
      if (numValue > 59) numValue = 59
      newDate.setMinutes(numValue)
    }
    if (type === 'seconds') {
      if (numValue < 0) numValue = 0
      if (numValue > 59) numValue = 59
      newDate.setSeconds(numValue)
    }
    onSelect(newDate)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex items-center w-full justify-start text-left font-normal h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground cursor-pointer",
          !date && "text-muted-foreground",
          className,
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, showTime ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy") : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d && date) {
               // Preserve time when changing date
               d.setHours(date.getHours())
               d.setMinutes(date.getMinutes())
               d.setSeconds(date.getSeconds())
            }
            onSelect(d)
            if (!showTime) setOpen(false)
          }}
        />
        {showTime && date && (
          <div className="p-3 border-t border-border flex items-center justify-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Hrs</span>
              <input
                type="number"
                min="0"
                max="23"
                value={date.getHours()}
                onChange={(e) => handleTimeChange('hours', e.target.value)}
                className="w-12 h-8 text-center border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <span className="mt-4">:</span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Min</span>
              <input
                type="number"
                min="0"
                max="59"
                value={date.getMinutes()}
                onChange={(e) => handleTimeChange('minutes', e.target.value)}
                className="w-12 h-8 text-center border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <span className="mt-4">:</span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Sec</span>
              <input
                type="number"
                min="0"
                max="59"
                value={date.getSeconds()}
                onChange={(e) => handleTimeChange('seconds', e.target.value)}
                className="w-12 h-8 text-center border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
