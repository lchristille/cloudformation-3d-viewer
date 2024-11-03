/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const layoutPosition = css`
    grid-area: sidebar;
`

export default function Sidebar() {
    return <div css={[layoutPosition]}>
    </div>
}