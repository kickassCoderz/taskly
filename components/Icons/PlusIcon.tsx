import { SvgRoot, TSvgChildProps } from './SvgRoot'

const PlusIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
        </SvgRoot>
    )
}

export { PlusIcon }
