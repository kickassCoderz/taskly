import { SvgRoot, TSvgChildProps } from './SvgRoot'

const SortIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M8 16H4l6 6V2H8zm6-11v17h2V8h4l-6-6z"></path>
        </SvgRoot>
    )
}

export { SortIcon }
