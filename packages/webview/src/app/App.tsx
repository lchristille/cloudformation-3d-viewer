/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Toolbar from "./layout/Toolbar";
import Sidebar from "./layout/Sidebar";
import MainViewport from "./layout/MainViewport";
import Properties from "./layout/Properties";
import BottomPanel from "./layout/BottomPanel";

const editorLayout = css`
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    "toolbar toolbar toolbar"
    "sidebar main-viewport properties"
    "bottom-panel bottom-panel bottom-panel";
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const App: React.FC = () => {
  return (
    <div css={[editorLayout]}>
      <Toolbar />
      <Sidebar />
      <MainViewport />
      <Properties />
      <BottomPanel />
    </div>
  );
};

export default App;
