import React from 'react'

import { SvgRoot, TSvgChildProps } from './SvgRoot'

const HamburgerIcon = (props: TSvgChildProps) => {
    return (
        <SvgRoot {...props}>
            <path d="M4 11h12v2H4zm0-5h16v2H4zm0 12h7.235v-2H4z"></path>
        </SvgRoot>
    )
}

export { HamburgerIcon }
