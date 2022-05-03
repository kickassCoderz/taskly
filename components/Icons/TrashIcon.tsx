import { SvgRoot, TSvgChildProps } from './SvgRoot'

const TrashIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
            <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
        </SvgRoot>
    )
}

export { TrashIcon }
