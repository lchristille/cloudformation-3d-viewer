/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import ToolbarButton from "../components/toolbar/ToolbarButton";
import { useStore } from "../stores/StoreContext";
import { MdOutlineQueryStats } from "react-icons/md";
import { CgListTree } from "react-icons/cg";
const layoutStyle = css`
  grid-area: toolbar;
  height: 35px;
  background-color: var(--vscode-tab-inactiveBackground);
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: var(--vscode-widget-border);
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: var(--vscode-widget-border);
  padding: 0 8px 0 4px;
`;

const Toolbar: React.FC = () => {
  const { layoutStore, vsCodeStore } = useStore();
  return (
    <div css={layoutStyle} className="flex items-center justify-center">
      <ToolbarButton
        tooltipText="Show/Hide Outliner"
        onClick={() => {
          layoutStore.toggleOutlinerVisibility();
        }}
      >
        <CgListTree />
      </ToolbarButton>
      <ToolbarButton
        tooltipText="Show/Hide Renderer Stats"
        onClick={() => {
          layoutStore.toggleStatsVisibility();
        }}
      >
        <MdOutlineQueryStats />
      </ToolbarButton>
      <ToolbarButton
        tooltipText="Show/Hide Outliner"
        onClick={() => {
          vsCodeStore.showInformationMessage("This is a message from the webview!");
        }}
      >
        <CgListTree />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
