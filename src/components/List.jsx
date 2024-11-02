
import { useEffect, useState } from "react";
import axios from "axios";
const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import MyCard from "./Card";

const List = ({ list, onDeleteList }) => {
  const [cards, setCards] = useState([]);
  const [newCardText, setNewCardText] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/lists/${list.id}/cards?key=${apiKey}&token=${apiToken}`
      );
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const createCard = async () => {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/cards?key=${apiKey}&token=${apiToken}`,
        { name: newCardText, idList: list.id }
      );
      setCards((prevState) => [...prevState, response.data]);
      setNewCardText("");
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const deleteCard = async (cardId, event) => {
    event.stopPropagation();
    try {
      await axios.delete(
        `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${apiToken}`
      );
      setCards(cards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <div>
      <Card
        key={list.id}
        sx={{ minWidth: 275, margin: "0 8px", backgroundColor: "lavender  " }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            {list.name}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onDeleteList(list.id)}
            sx={{ marginTop: "8px" }}
          >
            Delete List
          </Button>
          {cards.map((card) => (
            <MyCard key={card.id} card={card} onDeleteCard={deleteCard} />
          ))}
          <form>
            <TextField
              label="New Card"
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              margin="dense"
            />
            <Button onClick={createCard} variant="contained" size="small">
              Add Card
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default List;
