import { SvgRoot, TSvgChildProps } from './SvgRoot'

const ImportIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="m12 18 4-5h-3V2h-2v11H8z"></path>
            <path d="M19 9h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2z"></path>
        </SvgRoot>
    )
}

export { ImportIcon }
