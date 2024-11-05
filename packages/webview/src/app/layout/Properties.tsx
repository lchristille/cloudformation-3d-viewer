/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const layoutPosition = css`
  grid-area: properties;
`;

const Properties: React.FC = () => {
  return <div css={[layoutPosition]}></div>;
};

export default Properties;
