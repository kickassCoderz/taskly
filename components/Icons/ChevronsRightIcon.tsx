import React from 'react'

import { SvgRoot, TSvgChildProps } from './SvgRoot'

const ChevronsRightIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M10.296 7.71 14.621 12l-4.325 4.29 1.408 1.42L17.461 12l-5.757-5.71z"></path>
            <path d="M6.704 6.29 5.296 7.71 9.621 12l-4.325 4.29 1.408 1.42L12.461 12z"></path>
        </SvgRoot>
    )
}

export { ChevronsRightIcon }
