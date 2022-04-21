import { useTheme as useNextTheme } from 'next-themes'
import { useTheme as useNextUITheme } from '@nextui-org/react'

const useTheme = () => {
    const { setTheme } = useNextTheme()
    const { isDark, type } = useNextUITheme()

    return { type, isDark, setTheme }
}

export default useTheme
