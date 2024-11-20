export const validateEntry = (entry) => {
    const errors = {}

    if (!entry.description.trim()) {
        errors.description = 'Description is required'
    }

    if (!entry.status) {
        errors.status = 'Status is required'
    }

    if (entry.tags && typeof entry.tags === 'string') {
        const invalidTags = entry.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag && !/^[a-zA-Z0-9-_]+$/.test(tag))

        if (invalidTags.length > 0) {
            errors.tags = 'Tags can only contain letters, numbers, hyphens and underscores'
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
} 