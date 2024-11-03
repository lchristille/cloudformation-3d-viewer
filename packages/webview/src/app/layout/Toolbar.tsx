/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { MdOutlineQueryStats } from "react-icons/md";
import ToolbarButton from "../components/toolbar/ToolbarButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/StoreContext";

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
  const { layoutStore } = useStore();
  return (
    <div css={layoutStyle} className="flex items-center justify-center">
      <ToolbarButton
        tooltipText="Show Stats"
        onClick={() => {
          layoutStore.toggleStatsVisibility();
        }}
      >
        <MdOutlineQueryStats />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
