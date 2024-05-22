export const isEmptyObject = (obj: object): boolean => {
    for (let _ in obj) {
        return false
    }
    return true
}

export const clearObjectValue = (obj: object): void => {
    const object: any = obj
    for (let key in object) {
        if (typeof object[key] === 'object') {
            clearObjectValue(object[key])
        } else {
            object[key] = ''
        }
    }
}

export const objectToUrlParams = (obj: object): string => {
    const result: string[] = []
    const dfs = (object: any, prefix: string) => {
        for (let key in object) {
            if (typeof object[key] === 'object') {
                dfs(object[key], `${prefix}${key}.`)
            } else {
                result.push(`${prefix}${key}=${object[key]}`)
            }
        }
    }
    dfs(obj, '')
    return result.join('&')
}
