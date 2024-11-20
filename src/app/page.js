'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, startOfWeek, addDays, eachDayOfInterval, subWeeks, subDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'
import CustomCalendar from '@/app/components/CustomCalendar'
import EntryForm from '@/app/components/EntryForm'
import EntryList from '@/app/components/EntryList'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

const formatDate = (date) => format(date, 'yyyy-MM-dd')

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [allEntries, setAllEntries] = useState({})
  const [weeklyReportOpen, setWeeklyReportOpen] = useState(false)
  const [weeklyReportData, setWeeklyReportData] = useState([])
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const storedAllEntries = localStorage.getItem('allEntries')
    if (storedAllEntries) {
      try {
        setAllEntries(JSON.parse(storedAllEntries))
      } catch (error) {
        console.error('Error parsing stored entries:', error)
        setAllEntries({})
      }
    }
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

  const addEntry = useCallback((newEntry) => {
    const dateKey = formatDate(selectedDate)
    const updatedEntries = {
      ...allEntries,
      [dateKey]: [...(allEntries[dateKey] || []), newEntry]
    }
    setAllEntries(updatedEntries)
    localStorage.setItem('allEntries', JSON.stringify(updatedEntries))
  }, [allEntries, selectedDate])

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date)
  }, [])

  const handleTuesdayDoubleClick = useCallback((day) => {
    const currentWeekMonday = startOfWeek(day, { weekStartsOn: 1 })
    const previousWeekMonday = subWeeks(currentWeekMonday, 1)
    const nextMonday = addDays(currentWeekMonday, 0)

    const weekDays = eachDayOfInterval({
      start: previousWeekMonday,
      end: nextMonday
    })

    const weekEntries = weekDays.flatMap(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      return (allEntries[dateKey] || []).map(entry => ({
        ...entry,
        date: format(date, 'MMM dd, yyyy'),
        formattedTime: new Date(entry.timestamp).toLocaleTimeString()
      }))
    })

    setWeeklyReportData(weekEntries)
    setWeeklyReportOpen(true)
  }, [allEntries])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Dev Logger</h1>
          <Button variant="outline" onClick={() => setWeeklyReportOpen(true)}>
            View Weekly Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomCalendar
                onDateSelect={handleDateSelect}
                onTuesdayDoubleClick={handleTuesdayDoubleClick}
                entries={allEntries}
              />
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Add Entry for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <EntryForm addEntry={addEntry} />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Entries for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <EntryList entries={allEntries[formatDate(selectedDate)] || []} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold">🔥 {streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {Object.values(allEntries).flat().length}
            </div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {achievements.length}
            </div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
        </div>
      </div>

      <Dialog open={weeklyReportOpen} onOpenChange={setWeeklyReportOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Weekly Report</DialogTitle>
          </DialogHeader>
          {weeklyReportData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No entries found for this week
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyReportData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          entry.status === 'completed' ? 'default' :
                            entry.status === 'blocked' ? 'destructive' :
                              'secondary'
                        }
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {entry.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="mr-1">
                          {tag}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>{entry.formattedTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}