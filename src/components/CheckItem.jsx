import { Box, Checkbox, IconButton, Typography } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;
const api = import.meta.env.VITE_API;

const CheckItem = ({ checkItem, checklistId, cardId, checkItems, setCheckItems, updateProgress }) => {
  const handleDelete = async () => {
    try {
      await handleDeleteCheckItem(checkItem.id);
      toast.success("Check item deleted successfully.");
    } catch (error) {
      toast.error("Error deleting check item.");
    }
  };

  const handleToggleComplete = async (event) => {
    const updatedState = event.target.checked ? "complete" : "incomplete";
    
    try {
      await handleUpdateCheckItem(checkItem.id, updatedState);
      
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

  const handleDeleteCheckItem = async (checkItemId) => {
    const url = `${api}/checklists/${checklistId}/checkItems/${checkItemId}?key=${apiKey}&token=${apiToken}`;
    await axios.delete(url);
    setCheckItems(checkItems.filter(item => item.id !== checkItemId));
  };

  const handleUpdateCheckItem = async (checkItemId, state) => {
    if (!cardId || !checklistId) {
      console.error("cardId or checklistId is undefined");
      return;
    }
    const url = `${api}/cards/${cardId}/checklist/${checklistId}/checkItem/${checkItemId}?state=${state}&key=${apiKey}&token=${apiToken}`;
    await axios.put(url);
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
