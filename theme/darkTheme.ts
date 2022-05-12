import { createTheme } from '@nextui-org/react'

const darkTheme = createTheme({
    type: 'dark',
    theme: {
        colors: {
            landingHeaderBackground: 'rgba(0,0,0,0.5)'
        },
        fonts: {
            sans: 'Inter',
            mono: 'Inter'
        }
    }
})

export default darkTheme
