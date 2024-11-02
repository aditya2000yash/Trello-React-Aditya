import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import Checklist from "./Checklist";


const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MyCard = ({ card, onDeleteCard }) => {
  const [checklists, setCheckLists] = useState([]);
  const [open, setOpen] = useState(false);
  const [newChecklistName, setNewChecklistName] = useState("");
  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/cards/${card.id}/checklists?key=${apiKey}&token=${apiToken}`
      );
      setCheckLists(response.data);
    } catch (error) {
      console.error("Error fetching checklists:", error);
    }
  };
  const deleteChecklist = async (checklistId) => {
    try {
      await axios.delete(
        `https://api.trello.com/1/checklists/${checklistId}?key=${apiKey}&token=${apiToken}`
      );
      setCheckLists(
        checklists.filter((checklist) => checklist.id != checklistId)
      );
    } catch (error) {
      console.error("Error deleting checklist:", error);
    }
  };

  const createChecklist = async () => {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/checklists?key=${apiKey}&token=${apiToken}`,
        {
          idCard: card.id,
          name: newChecklistName,
        }
      );
      const newChecklist = response.data;
      setCheckLists(prevState => [...prevState, response.data])
      setNewChecklistName("");
    } catch (error) {
      console.error("Error creating checklist:", error);
      return null;
    }
  };

  return (
    <div>
      <Card sx={{ margin: "8px 0" }} onClick={() => setOpen(true)}>
        <CardContent>
          <Typography variant="body1">{card.name}</Typography>
          <Button
            onClick={(event) => {
              onDeleteCard(card.id, event);
            }}
          >
            Delete Card
          </Button>
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h3>{card.name}</h3>
          {checklists.map((checklist) => (
            <div key={checklist.id}>
              <Checklist
                key={checklist.id}
                checklist={checklist}
                onDeleteChecklist={deleteChecklist}
              />
            </div>
          ))}
          <form>
            <TextField
              label="New Checklist"
              value={newChecklistName}
              onChange={(e) => setNewChecklistName(e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              margin="dense"
            />
            <Button onClick={createChecklist} variant="contained" size="small">
              Add Checklist
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default MyCard;
