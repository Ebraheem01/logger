const STORAGE_KEY = 'devLogger_v1'

export const saveEntries = (entries) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: 1,
            data: entries,
            updatedAt: new Date().toISOString()
        }))
        return true
    } catch (error) {
        console.error('Failed to save entries:', error)
        return false
    }
}

export const loadEntries = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return {}

        const { data } = JSON.parse(stored)
        return data
    } catch (error) {
        console.error('Failed to load entries:', error)
        return {}
    }
} 