import { SvgRoot, TSvgChildProps } from './SvgRoot'

const UserIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>
        </SvgRoot>
    )
}

export { UserIcon }
