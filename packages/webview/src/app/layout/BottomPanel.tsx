/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const layoutPosition = css`
    grid-area: bottom-panel;
`

export default function BottomPanel() {
    return <div css={[layoutPosition]}>
    </div>
}