import { Box, Divider, Stack } from "@mui/material";
import { TreeItem, useTreeViewApiRef } from "@mui/x-tree-view";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { OutlinerTreeNode } from "../../types/OutlinerTreeNode";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/StoreContext";
import CustomTreeItem from "./customTreeItem";

const renderTreeItems = (nodes: OutlinerTreeNode[]) => nodes.map((node) => (
  <CustomTreeItem key={node.itemId} itemId={node.itemId} label={node.label}>
    {node.children && renderTreeItems(node.children)}
  </CustomTreeItem>
))

const Outliner: React.FC = observer(() => {
  const apiRef = useTreeViewApiRef();

  const { sceneStore } = useStore();

  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <Stack divider={<Divider orientation="horizontal" flexItem />} sx={{
        justifyContent: "center",
        alightItems: "center"
      }} spacing={2}>
        <div>
          Outliner
        </div>
        <SimpleTreeView apiRef={apiRef}>
          {renderTreeItems(sceneStore.outlinerTreeNodes)}
        </SimpleTreeView>
      </Stack>
    </Box>
  );
});

export default Outliner;
