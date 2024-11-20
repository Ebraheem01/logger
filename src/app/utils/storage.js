import { supabase } from './supabase'

export const saveEntries = async (entries) => {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        // Get existing entries for the dates we're updating
        const dateKeys = Object.keys(entries)
        const { data: existingEntries } = await supabase
            .from('entries')
            .select('*')
            .eq('user_id', user.id)
            .in('date_key', dateKeys)

        // Create a map of existing timestamps to avoid duplicates
        const existingTimestamps = new Set(existingEntries?.map(e => e.timestamp) || [])

        // Convert entries to array format
        const entriesArray = Object.entries(entries).flatMap(([dateKey, dayEntries]) =>
            dayEntries.map(entry => {
                let timestamp = entry.timestamp
                // If timestamp exists, generate a new unique one
                while (existingTimestamps.has(timestamp)) {
                    timestamp = new Date(new Date(timestamp).getTime() + 1).toISOString()
                }
                existingTimestamps.add(timestamp)

                return {
                    user_id: user.id,
                    date_key: dateKey,
                    description: entry.description,
                    status: entry.status,
                    tags: entry.tags || [],
                    timestamp
                }
            })
        )

        if (entriesArray.length > 0) {
            const { error: insertError } = await supabase
                .from('entries')
                .insert(entriesArray)

            if (insertError) throw insertError
        }

        return true
    } catch (error) {
        console.error('Failed to save entries:', error)
        return false
    }
}

export const loadEntries = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        const { data, error } = await supabase
            .from('entries')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: true })

        if (error) throw error

        const entriesObject = (data || []).reduce((acc, entry) => {
            const dateEntries = acc[entry.date_key] || []
            acc[entry.date_key] = [...dateEntries, {
                description: entry.description,
                status: entry.status,
                tags: entry.tags || [],
                timestamp: entry.timestamp
            }]
            return acc
        }, {})

        return { data: entriesObject }
    } catch (error) {
        console.error('Failed to load entries:', error)
        return { data: {} }
    }
} 