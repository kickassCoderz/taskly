// export { default as lightTheme } from './lightTheme'
// export { default as darkTheme } from './darkTheme'
import lightTheme from './lightTheme'
import darkTheme from './darkTheme'

const themeProviderValues = {
    light: lightTheme.className,
    dark: darkTheme.className
}

export { lightTheme, darkTheme, themeProviderValues }
