import { Badge } from '@/app/components/ui/badge'

export default function EntryList({ entries }) {
    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <span className="text-3xl mb-2">📝</span>
                <p>No entries for this date</p>
            </div>
        )
    }

    return (
        <ul className="space-y-4">
            {entries.map((entry, index) => (
                <li key={index} className="bg-muted/50 rounded-xl p-4 transition-all hover:bg-muted">
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