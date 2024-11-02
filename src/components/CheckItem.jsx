
import { Box, Checkbox, IconButton, Typography } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import toast from "react-hot-toast";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

const CheckItem = ({ checkItem, onDeleteCheckItem, updateProgress, checkItems, setCheckItems }) => {
  const handleDelete = async () => {
    await onDeleteCheckItem(checkItem.id);
  };

  const handleToggleComplete = async (event) => {
    console.log("checked: " , event.target.checked);
    const updatedState = event.target.checked ? "complete" : "incomplete";
    
    try {
      await axios.get(
        `https://api.trello.com/1/checklists/${checkItem.idChecklist}/checkItems/${checkItem.id}?state=${updatedState}&key=${apiKey}&token=${apiToken}`
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



//----------------

