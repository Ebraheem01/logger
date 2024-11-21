import React, { useState, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isTuesday, startOfWeek, addDays, addMonths, endOfWeek, isFriday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import EntryList from '@/app/components/EntryList'
import { cn } from '@/lib/utils'

const MemoizedEntryList = React.memo(EntryList)

export default function CustomCalendar({ onDateSelect, onDayDoubleClick, entries }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    const handleDateClick = useCallback((day) => {
        setSelectedDate(day)
        onDateSelect(day)
    }, [onDateSelect])

    const handleDoubleClick = useCallback((day, e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isTuesday(day) || isFriday(day)) {
            onDayDoubleClick(day)
        }
    }, [onDayDoubleClick])

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const prevMonth = () => {
        setCurrentMonth(addMonths(currentMonth, -1))
    }

    return (
        <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-sm">
            <div className="flex justify-between items-center p-4 border-b">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevMonth}
                    className="hover:bg-muted"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextMonth}
                    className="hover:bg-muted"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, dayIdx) => {
                    const dateKey = format(day, 'yyyy-MM-dd')
                    const dayEntries = entries[dateKey] || []

                    return (
                        <Popover key={day.toString()}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "h-14 w-full p-0 font-normal relative",
                                        !isSameMonth(day, currentMonth) && "text-muted-foreground",
                                        isSameDay(day, selectedDate) && "bg-primary text-primary-foreground",
                                        isToday(day) && "bg-muted",
                                        dayEntries.length > 0 && "font-semibold",
                                        (isTuesday(day) || isFriday(day)) && "cursor-pointer hover:bg-muted/80"
                                    )}
                                    onClick={() => handleDateClick(day)}
                                    onDoubleClick={(e) => handleDoubleClick(day, e)}
                                >
                                    <span className="text-sm">{format(day, 'd')}</span>
                                    {dayEntries.length > 0 && (
                                        <span className="absolute top-1 right-1 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            {dayEntries.length > 0 && (
                                <PopoverContent className="w-80 p-0" align="start">
                                    <div className="p-4">
                                        <h3 className="font-medium mb-2">{format(day, 'MMMM d, yyyy')}</h3>
                                        <MemoizedEntryList entries={dayEntries} />
                                    </div>
                                </PopoverContent>
                            )}
                        </Popover>
                    )
                })}
            </div>
        </div>
    )
}