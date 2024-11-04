import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Popover,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;
const api = import.meta.env.VITE_API;

function Home() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get(
        `${api}/members/me/boards?key=${apiKey}&token=${apiToken}`
      );
      setBoards(response.data);
    } catch (error) {
      toast.error("Error fetching boards. Please try again.");
    }
  };

  const createBoard = async () => {
    if (!newBoardName) {
      toast.warn("Board name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(
        `${api}/boards?key=${apiKey}&token=${apiToken}`,
        { name: newBoardName }
      );
      setBoards((prevBoards) => [...prevBoards, response.data]);
      setNewBoardName("");
      handlePopoverClose();
      toast.success("Board created successfully!");
    } catch (error) {
      toast.error("Error creating board. Please try again.");
    }
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div
      style={{
        margin: "0",
        marginTop: "-30px",
        padding: "20px",
        position: "relative",
        height: "calc(100vh - 60px)",
      }}
    >
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Boards
      </Typography>
      <Grid container spacing={2}>
        {boards.map((board) => (
          <Grid item key={board.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ marginBottom: "8px", backgroundColor: "black" }}>
            <CardContent>
              <Link to={`/boards/${board.id}`} style={{ textDecoration: 'none' }}>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  {board.name}
                </Typography>
              </Link>
            </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{
              marginBottom: "8px",
              width: "180px",
              bgcolor: "transparent",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <Button variant="contained" onClick={handlePopoverOpen}>
                Create Board
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <CardContent>
                  <TextField
                    label="New Board Name"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    sx={{ marginBottom: "8px", width: "200px" }}
                  />
                  <div>
                    <Button variant="contained" onClick={createBoard}>
                      Create
                    </Button>
                    <Button onClick={handlePopoverClose} color="secondary">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Popover>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
