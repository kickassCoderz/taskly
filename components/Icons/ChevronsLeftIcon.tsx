import { SvgRoot, TSvgChildProps } from './SvgRoot'

const ChevronsLeftIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="m12.707 7.707-1.414-1.414L5.586 12l5.707 5.707 1.414-1.414L8.414 12z"></path>
            <path d="M16.293 6.293 10.586 12l5.707 5.707 1.414-1.414L13.414 12l4.293-4.293z"></path>
        </SvgRoot>
    )
}

export { ChevronsLeftIcon }
