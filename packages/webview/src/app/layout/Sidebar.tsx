/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { css } from "@emotion/react";
import { useStore } from "../stores/StoreContext";
import Outliner from '../components/sidebar/outliner';

const layoutPosition = css`
  grid-area: sidebar;
`;

const Sidebar: React.FC = () => {
  const { vsCodeStore } = useStore();
  vsCodeStore.getMainDocumentSymbols().then((response) => {
  })
  return <div css={[layoutPosition]}>
    <Outliner />
  </div>;
};

export default Sidebar;
