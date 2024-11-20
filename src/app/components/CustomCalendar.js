import React, { useState, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isTuesday, startOfWeek, addDays, addMonths, endOfWeek } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import EntryList from '@/app/components/EntryList'
import { cn } from '@/lib/utils'

const MemoizedEntryList = React.memo(EntryList)

export default function CustomCalendar({ onDateSelect, onTuesdayDoubleClick, entries }) {
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

    const handleTuesdayDoubleClick = useCallback((day, e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('day', day)
        if (isTuesday(day)) {
            onTuesdayDoubleClick(day)
        }
    }, [onTuesdayDoubleClick])

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
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium text-sm text-muted-foreground">
                        {day}
                    </div>
                ))}
                {calendarDays.map(day => {
                    const dateKey = format(day, 'yyyy-MM-dd')
                    const dayEntries = entries && entries[dateKey] ? entries[dateKey] : []
                    const isSelected = isSameDay(day, selectedDate)
                    const isCurrentMonth = isSameMonth(day, currentMonth)

                    return (
                        <Popover key={day.toString()}>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        "calendar-day",
                                        !isCurrentMonth && "text-muted-foreground/50",
                                        isSelected && "selected",
                                        isToday(day) && "today",
                                        isTuesday(day) && "bg-yellow-100/50"
                                    )}
                                    onClick={() => handleDateClick(day)}
                                    onDoubleClick={(e) => handleTuesdayDoubleClick(day, e)}
                                >
                                    <span className="text-sm">{format(day, 'd')}</span>
                                    {dayEntries.length > 0 && (
                                        <span className="absolute top-1 right-1 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>
                                    )}
                                </button>
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