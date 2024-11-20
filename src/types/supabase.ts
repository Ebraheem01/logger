export type Entry = {
    id: string
    user_id: string
    date_key: string
    description: string
    status: 'in-progress' | 'completed' | 'blocked'
    tags: string[]
    timestamp: string
    created_at: string
    updated_at: string
}

export type Tables = {
    entries: Entry
} 