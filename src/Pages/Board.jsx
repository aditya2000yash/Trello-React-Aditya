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

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

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
        `https://api.trello.com/1/boards/${boardId}?lists=open&list_fields=name&key=${apiKey}&token=${apiToken}`
      );
      setBoardName(response.data.name);
      setLists(response.data.lists);
    } catch (error) {
      console.error("Error fetching board:", error);
    }
  };

  const createList = async () => {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/lists?key=${apiKey}&token=${apiToken}`,
        { name: newListName, idBoard: boardId }
      );
      setLists((prevState) => [...prevState, response.data]);
      setNewListName("");
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const deleteList = async (listId) => {
    try {
      let archiveUrl = `https://api.trello.com/1/lists/${listId}/closed?value=true&key=${apiKey}&token=${apiToken}`;
      await axios({
        method: "put",
        url: archiveUrl,
        data: {
          closed: true,
        },
      });
      setLists(lists.filter((list) => listId !== list.id));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <div style={{ marginLeft: "30px" }}>
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
