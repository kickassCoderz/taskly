import React from 'react'

import { SvgRoot, TSvgChildProps } from './SvgRoot'

const FilterIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M7 11h10v2H7zM4 7h16v2H4zm6 8h4v2h-4z"></path>
        </SvgRoot>
    )
}

export { FilterIcon }
