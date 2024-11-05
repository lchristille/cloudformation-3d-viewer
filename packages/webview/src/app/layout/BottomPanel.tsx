/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const layoutPosition = css`
  grid-area: bottom-panel;
`;

const BottomPanel: React.FC = () => {
  return <div css={[layoutPosition]}></div>;
};

export default BottomPanel;
