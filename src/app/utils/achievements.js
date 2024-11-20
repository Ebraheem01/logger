export const ACHIEVEMENTS = {
    FIRST_ENTRY: {
        id: 'first_entry',
        title: 'Getting Started',
        description: 'Made your first dev log entry',
        icon: '🌟'
    },
    STREAK_WEEK: {
        id: 'streak_week',
        title: 'Consistency is Key',
        description: 'Logged entries for 7 days straight',
        icon: '🔥'
    },
    TASK_MASTER: {
        id: 'task_master',
        title: 'Task Master',
        description: 'Completed 10 tasks in a week',
        icon: '⚡'
    },
    TAG_COLLECTOR: {
        id: 'tag_collector',
        title: 'Tag Collector',
        description: 'Used 5 different tags',
        icon: '🏷️'
    }
}

export const checkAchievements = (allEntries, currentAchievements) => {
    const newAchievements = []
    // Achievement checking logic here
    return newAchievements
} 