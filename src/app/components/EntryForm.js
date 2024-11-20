'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'

export default function EntryForm({ addEntry }) {
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('in-progress')
    const [tags, setTags] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        addEntry({
            description,
            status,
            tags: tags.split(',').map(tag => tag.trim()),
            timestamp: new Date().toISOString()
        })
        setDescription('')
        setStatus('in-progress')
        setTags('')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder="What did you work on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
            </Select>
            <Input
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            <Button type="submit">Add Entry</Button>
        </form>
    )
}