import { useTheme as useNextUITheme } from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'

const useTheme = () => {
    const { setTheme } = useNextTheme()
    const { isDark, type } = useNextUITheme()

    return { type, isDark, setTheme }
}

export { useTheme }
