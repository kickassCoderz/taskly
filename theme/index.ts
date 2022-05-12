import { globalCss } from '@nextui-org/react'

import darkTheme from './darkTheme'
import lightTheme from './lightTheme'

const injectGlobalStyles = globalCss({
    '@import': [
        'url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap")'
    ],
    body: {
        backgroundImage: `radial-gradient(circle at 0% 80%, #0070F3, rgba(255, 255, 255, 0) 25%), radial-gradient(circle at 100% 0%, #7928CA, rgba(255, 255, 255, 0) 25%)`,
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
    }
})

const themeProviderValues = {
    light: lightTheme.className,
    dark: darkTheme.className
}

export { darkTheme, injectGlobalStyles, lightTheme, themeProviderValues }
