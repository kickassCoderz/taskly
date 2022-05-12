import { createTheme } from '@nextui-org/react'

const lightTheme = createTheme({
    type: 'light',
    theme: {
        colors: {
            landingHeaderBackground: 'hsla(0,0%,100%,0.8)'
        },
        fonts: {
            mono: 'Inter',
            sans: 'Inter'
        }
    }
})

export default lightTheme
