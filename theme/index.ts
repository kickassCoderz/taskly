import { globalCss } from '@nextui-org/react'

import darkTheme from './darkTheme'
import lightTheme from './lightTheme'

const injectGlobalStyles = globalCss({
    // '@import': ['url("https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap")']
    '@import': [
        'url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap")'
    ]
})

const themeProviderValues = {
    light: lightTheme.className,
    dark: darkTheme.className
}

export { darkTheme, injectGlobalStyles, lightTheme, themeProviderValues }
