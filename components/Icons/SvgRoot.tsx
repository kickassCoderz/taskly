import { forwardRef } from 'react'

export type TSvgRootProps = {
    fill?: string
    size?: number
    width?: number
    height?: number
    children: React.ReactNode
}

export type TSvgChildProps = Omit<TSvgRootProps, 'children'>

const SvgRoot = forwardRef<SVGSVGElement, TSvgRootProps>(
    ({ fill = 'currentColor', size, height, width, children }, ref) => {
        return (
            <svg
                viewBox="0 0 24 24"
                ref={ref}
                fill={fill}
                width={size || width || 24}
                height={size || height || 24}
                xmlns="http://www.w3.org/2000/svg"
            >
                {children}
            </svg>
        )
    }
)

SvgRoot.displayName = 'SvgRoot'

export { SvgRoot }
