import { createContext, useCallback, useState } from 'react'

type TAppNavigationContext = {
    isOpen: boolean
    toggleNav: () => void
}

const AppNavigationContext = createContext<TAppNavigationContext | undefined>(undefined)

AppNavigationContext.displayName = 'AppNavigationContext'

type TAppNavigationProviderProps = {
    children: React.ReactNode
}

const AppNavigationProvider = ({ children }: TAppNavigationProviderProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleNav = useCallback(() => setIsOpen(prev => !prev), [])

    return <AppNavigationContext.Provider value={{ isOpen, toggleNav }}>{children}</AppNavigationContext.Provider>
}

export { AppNavigationContext, AppNavigationProvider }
