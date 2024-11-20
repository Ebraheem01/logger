export default function AchievementToast({ achievement }) {
    return (
        <div className="bg-card border p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="text-4xl">{achievement.icon}</div>
            <div>
                <h3 className="font-bold">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">
                    {achievement.description}
                </p>
            </div>
        </div>
    )
} 