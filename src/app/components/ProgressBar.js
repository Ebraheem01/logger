export default function ProgressBar({ value, max, label }) {
    const percentage = (value / max) * 100

    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm font-medium">{value}/{max}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                    className="bg-primary rounded-full h-2.5 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
} 