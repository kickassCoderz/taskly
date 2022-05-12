import { SvgRoot, TSvgChildProps } from './SvgRoot'

const MenuRightIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z"></path>
        </SvgRoot>
    )
}

export { MenuRightIcon }
