/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useStore } from "../stores/StoreContext";

const layoutPosition = css`
  grid-area: sidebar;
`;

const Sidebar: React.FC = () => {
  const { vsCodeStore } = useStore();
  vsCodeStore.getMainDocumentSymbols().then((response) => {
  })
  return <div css={[layoutPosition]}></div>;
};

export default Sidebar;
