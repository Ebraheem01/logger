export const generateWeeklyReport = (entries, startDate, endDate) => {
    return Object.entries(entries)
        .filter(([date]) => {
            const entryDate = new Date(date)
            return entryDate >= startDate && entryDate <= endDate
        })
        .flatMap(([date, dayEntries]) =>
            dayEntries.map(entry => ({
                ...entry,
                date
            }))
        )
        .sort((a, b) => {
            // Sort by date first
            const dateCompare = new Date(a.date) - new Date(b.date)
            if (dateCompare !== 0) return dateCompare

            // Then by status priority
            const statusPriority = { completed: 0, 'in-progress': 1, blocked: 2 }
            return statusPriority[a.status] - statusPriority[b.status]
        })
} 