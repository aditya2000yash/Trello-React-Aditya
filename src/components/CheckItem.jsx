import { Box, Checkbox, IconButton, Typography } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import toast from "react-hot-toast";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;
const api = import.meta.env.VITE_API;

const CheckItem = ({ checkItem, onDeleteCheckItem, updateProgress, checkItems, setCheckItems }) => {
  const handleDelete = async () => {
    try {
      await onDeleteCheckItem(checkItem.id);
      toast.success("Check item deleted successfully.");
    } catch (error) {
      toast.error("Error deleting check item.");
    }
  };

  const handleToggleComplete = async (event) => {
    const updatedState = event.target.checked ? "complete" : "incomplete";
    
    try {
      await axios.get(
        `${api}/checklists/${checkItem.idChecklist}/checkItems/${checkItem.id}?state=${updatedState}&key=${apiKey}&token=${apiToken}`
      );

      const updatedCheckItems = checkItems.map(item =>
        item.id === checkItem.id ? { ...item, state: updatedState } : item
      );

      setCheckItems(updatedCheckItems);
      updateProgress(updatedCheckItems); // Update the progress immediately after toggling
      toast.success(`Check item marked as ${updatedState}.`);
    } catch (error) {
      toast.error("Error updating check item state.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: '#f0f0f0',
        p: 1,
        borderRadius: 1,
        mb: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          checked={checkItem.state === "complete"}
          onChange={handleToggleComplete}
        />
        <Typography>{checkItem.name}</Typography>
      </Box>
      <IconButton onClick={handleDelete}>
        <DeleteForeverIcon />
      </IconButton>
    </Box>
  );
};

export default CheckItem;
