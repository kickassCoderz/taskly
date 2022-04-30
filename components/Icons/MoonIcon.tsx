import { SvgRoot, TSvgChildProps } from './SvgRoot'

const MoonIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z"></path>
        </SvgRoot>
    )
}

export { MoonIcon }
