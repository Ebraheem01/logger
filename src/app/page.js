'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import Auth from '@/app/components/Auth'
import { format, startOfWeek, addDays, eachDayOfInterval, subWeeks, subDays, isFriday, isTuesday } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import CustomCalendar from '@/app/components/CustomCalendar'
import EntryForm from '@/app/components/EntryForm'
import EntryList from '@/app/components/EntryList'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { loadEntries, saveEntries } from '@/app/utils/storage'
import Stat from '@/app/components/Stat'

const formatDate = (date) => format(date, 'yyyy-MM-dd')

export default function Home() {

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [allEntries, setAllEntries] = useState({})
  const [weeklyReportOpen, setWeeklyReportOpen] = useState(false)
  const [weeklyReportData, setWeeklyReportData] = useState([])
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const fetchEntries = async () => {
      const entries = await loadEntries()
      setAllEntries(entries.data || {})
    }
    fetchEntries()
  }, [])

  useEffect(() => {
    const lastEntry = Object.entries(allEntries)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))[0]

    // Calculate streak
    let currentStreak = 0
    const today = new Date()
    let checkDate = today

    while (true) {
      const dateKey = format(checkDate, 'yyyy-MM-dd')
      if (!allEntries[dateKey]) break
      currentStreak++
      checkDate = subDays(checkDate, 1)
    }

    setStreak(currentStreak)
  }, [allEntries])

  const addEntry = useCallback(async (newEntry) => {
    const dateKey = formatDate(selectedDate)
    const updatedEntries = {
      ...allEntries,
      [dateKey]: [...(allEntries[dateKey] || []), newEntry]
    }
    setAllEntries(updatedEntries)
    await saveEntries(updatedEntries)
  }, [allEntries, selectedDate])

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date)
  }, [])


  const generateWeeklyReport = useCallback((entries, startDate, endDate) => {
    const weekEntries = []
    let currentDate = startDate

    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
      if (entries[dateKey]) {
        weekEntries.push(...entries[dateKey].map(entry => ({
          ...entry,
          date: dateKey
        })))
      }
      currentDate = addDays(currentDate, 1)
    }

    return weekEntries.sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [])

  const handleDayDoubleClick = useCallback((day) => {
    let reportStart, reportEnd;
    console.log(day)
    if (isFriday(day)) {
      // For Fridays, show Monday-Friday of the same week
      reportStart = startOfWeek(day, { weekStartsOn: 1 }) // Monday
      reportEnd = day // Friday
    } else if (isTuesday(day)) {
      // For Tuesdays, show previous week
      const currentWeekMonday = startOfWeek(day, { weekStartsOn: 1 })
      reportStart = subWeeks(currentWeekMonday, 1)
      reportEnd = subDays(currentWeekMonday, 1)
    } else {
      return // Only respond to Tuesday/Friday double clicks
    }

    const weekEntries = generateWeeklyReport(allEntries, reportStart, reportEnd)
    console.log(weekEntries)
    setWeeklyReportData(weekEntries)
    setWeeklyReportOpen(true)
  }, [allEntries])



  return (
    <div className="min-h-screen bg-background p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Welcome to DevLog</h1>
        <div className="flex gap-8 mt-4">
          <Stat label="Streak" value={`${streak} days`} icon="🔥" />
          <Stat label="Total Entries" value={Object.values(allEntries).flat().length} icon="📝" />
          <Stat label="This Week" value={weeklyReportData.length} icon="📊" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomCalendar
              onDateSelect={handleDateSelect}
              onDayDoubleClick={handleDayDoubleClick}
              entries={allEntries}
            />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-card">
            <CardHeader className="border-b border-muted pb-4">
              <CardTitle>Add Entry for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <EntryForm addEntry={addEntry} />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="border-b border-muted pb-4">
              <CardTitle>Today's Entries</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <EntryList entries={allEntries[formatDate(selectedDate)] || []} />
            </CardContent>
          </Card>
        </div>
      </div>


      <Dialog open={weeklyReportOpen} onOpenChange={setWeeklyReportOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Weekly Report</DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyReportData.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell>{format(new Date(entry.date), 'MMM d')}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}