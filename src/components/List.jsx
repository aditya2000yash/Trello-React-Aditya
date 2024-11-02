import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Card, CardContent, Button, TextField } from "@mui/material";
import MyCard from "./Card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;
const api = import.meta.env.VITE_API;

const List = ({ list, onDeleteList }) => {
  const [cards, setCards] = useState([]);
  const [newCardText, setNewCardText] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `${api}/lists/${list.id}/cards?key=${apiKey}&token=${apiToken}`
      );
      setCards(response.data);
    } catch (error) {
      toast.error("Error fetching cards. Please try again.");
    }
  };

  const createCard = async () => {
    if (!newCardText) {
      toast.warn("Card name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(
        `${api}/cards?key=${apiKey}&token=${apiToken}`,
        { name: newCardText, idList: list.id }
      );
      setCards((prevState) => [...prevState, response.data]);
      setNewCardText("");
      toast.success("Card created successfully!");
    } catch (error) {
      toast.error("Error creating card. Please try again.");
    }
  };

  const deleteCard = async (cardId, event) => {
    event.stopPropagation();
    try {
      await axios.delete(
        `${api}/cards/${cardId}?key=${apiKey}&token=${apiToken}`
      );
      setCards(cards.filter((card) => card.id !== cardId));
      toast.success("Card deleted successfully!");
    } catch (error) {
      toast.error("Error deleting card. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <Card
        key={list.id}
        sx={{ minWidth: 275, margin: "0 8px", backgroundColor: "lavender" }}
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
          <form onSubmit={(e) => {
            e.preventDefault(); 
            createCard();
          }}>
            <TextField
              label="New Card"
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              margin="dense"
            />
            <Button type="submit" variant="contained" size="small">
              Add Card
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default List;
