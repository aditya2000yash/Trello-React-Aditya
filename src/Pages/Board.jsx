import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import List from "../components/List";
import {
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;
const api = import.meta.env.VITE_API;

function Board() {
  const { boardId } = useParams();
  const [boardName, setBoardName] = useState("");
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get(
        `${api}/boards/${boardId}?lists=open&list_fields=name&key=${apiKey}&token=${apiToken}`
      );
      setBoardName(response.data.name);
      setLists(response.data.lists);
    } catch (error) {
      toast.error("Error fetching board. Please try again.");
    }
  };

  const createList = async () => {
    if (!newListName) {
      toast.warn("List name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(
        `${api}/lists?key=${apiKey}&token=${apiToken}`,
        { name: newListName, idBoard: boardId }
      );
      setLists((prevState) => [...prevState, response.data]);
      setNewListName("");
      toast.success("List created successfully!");
    } catch (error) {
      toast.error("Error creating list. Please try again.");
    }
  };

  const deleteList = async (listId) => {
    try {
      const archiveUrl = `${api}/lists/${listId}/closed?value=true&key=${apiKey}&token=${apiToken}`;
      await axios.put(archiveUrl, { closed: true });
      setLists((prevLists) => prevLists.filter((list) => listId !== list.id));
      toast.success("List deleted successfully!");
    } catch (error) {
      toast.error("Error deleting list. Please try again.");
    }
  };

  return (
    <div style={{ marginLeft: "30px" }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        {boardName}
      </Typography>
      <Grid container spacing={2} style={{ overflowX: "auto" }}>
        {lists.map((list) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={list.id}>
            <Paper elevation={2}>
              <List list={list} onDeleteList={deleteList} />
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Paper elevation={2} className="create-list-container" style={{ padding: "16px" }}>
            <TextField
              label="New List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={createList} fullWidth>
              Create List
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Board;
