import { Typography, Card, CardContent, Button, TextField, Box, LinearProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import CheckItem from "./CheckItem";
import toast from "react-hot-toast";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;
const api = import.meta.env.VITE_API;

const Checklist = ({ checklist, onDeleteChecklist }) => {
  const [checkItems, setCheckItems] = useState([]);
  const [newCheckItemName, setNewCheckItemName] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchCheckItems();
  }, []);

  const fetchCheckItems = async () => {
    try {
      const response = await axios.get(
        `${api}/checklists/${checklist.id}/checkItems?key=${apiKey}&token=${apiToken}`
      );
      setCheckItems(response.data);
      updateProgress(response.data);
    } catch (error) {
      toast.error("Failed to load check items.");
    }
  };

  const updateProgress = (items) => {
    const completedCount = items.filter(item => item.state === "complete").length;
    const totalCount = items.length;
    const completionPercentage = totalCount ? Math.floor((completedCount / totalCount) * 100) : 0;

    setProgress(completionPercentage);
  };

  const deleteCheckItem = async (checkItemId) => {
    try {
      await axios.delete(
        `${api}/checklists/${checklist.id}/checkItems/${checkItemId}?key=${apiKey}&token=${apiToken}`
      );
      const updatedCheckItems = checkItems.filter(item => item.id !== checkItemId);
      setCheckItems(updatedCheckItems);
      updateProgress(updatedCheckItems);
      toast.success("Check item deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete check item.");
    }
  };

  const handleAddCheckItem = async (event) => {
    event.preventDefault();
    if (newCheckItemName.length < 3) {
      toast.error("Check item name must be at least 3 characters.");
      return;
    }

    try {
      const response = await axios.post(
        `${api}/checklists/${checklist.id}/checkItems?name=${newCheckItemName}&key=${apiKey}&token=${apiToken}`
      );
      const updatedCheckItems = [...checkItems, response.data];
      setCheckItems(updatedCheckItems);
      setNewCheckItemName("");
      toast.success("Check item added successfully.");
      updateProgress(updatedCheckItems);
    } catch (error) {
      toast.error("Failed to add check item.");
    }
  };

  return (
    <Card sx={{ margin: "8px 0", backgroundColor: "lavender" }}>
      <CardContent>
        <Typography variant="h6">{checklist.name}</Typography>
        <Button onClick={() => onDeleteChecklist(checklist.id)}>Delete Checklist</Button>
        
        <form onSubmit={handleAddCheckItem}>
          <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
            <TextField
              variant="outlined"
              value={newCheckItemName}
              onChange={(e) => setNewCheckItemName(e.target.value)}
              placeholder="Add check item"
              required
              sx={{ flex: 1, mr: 1 }}
            />
            <Button type="submit" variant="contained">Add</Button>
          </Box>
        </form>

        <Box sx={{ position: "relative", mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: -20, 
              left: 0,
              padding: '0 8px', 
              color: '#1976D2', 
              fontWeight: 'bold',
            }}
          >
            {progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress === 100 ? "primary" : "inherit"} 
          />
        </Box>
        
        {checkItems.map((checkItem) => (
          <CheckItem
            key={checkItem.id}
            checkItem={checkItem}
            onDeleteCheckItem={deleteCheckItem}
            updateProgress={updateProgress}
            checkItems={checkItems}
            setCheckItems={setCheckItems}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default Checklist;
