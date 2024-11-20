import { Badge } from '@/app/components/ui/badge'

export default function EntryList({ entries }) {
    if (entries.length === 0) {
        return <p>No entries for this date.</p>
    }

    return (
        <ul className="space-y-4">
            {entries.map((entry, index) => (
                <li key={index} className="entry-card rounded-lg p-4">
                    <p className="font-medium text-foreground">{entry.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge
                            variant={
                                entry.status === 'completed' ? 'default' :
                                    entry.status === 'blocked' ? 'destructive' :
                                        'secondary'
                            }
                            className="capitalize"
                        >
                            {entry.status}
                        </Badge>
                        {entry.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="bg-background/50">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <time className="block text-sm text-muted-foreground mt-2">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                    </time>
                </li>
            ))}
        </ul>
    )
}