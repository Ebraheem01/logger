export default function Stat({ label, value, icon }) {
    return (
        <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-semibold">{value}</p>
                </div>
            </div>
        </div>
    )
} 