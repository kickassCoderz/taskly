const createUserAvatarText = (fullName?: string) => {
    if (!fullName) {
        return ''
    }

    return fullName
        .split(' ')
        .map(word => word[0].toUpperCase())
        .join('')
}

export { createUserAvatarText }
