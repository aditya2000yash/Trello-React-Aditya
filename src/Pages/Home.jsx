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

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

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
        `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${apiToken}`
      );
      setBoards(response.data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const createBoard = async () => {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/boards?key=${apiKey}&token=${apiToken}`,
        { name: newBoardName }
      );
      setBoards(prevState => [...prevState, response.data]);
      setNewBoardName("");
      setAnchorEl(null); 
    } catch (error) {
      console.error("Error creating board:", error);
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
        marginTop: '-30px',  
        padding: "20px",
        position: "relative",
        height: "calc(100vh - 60px)",
        backgroundImage: 'url("src/assets/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Boards
      </Typography>
      <Grid container spacing={2}>
        {boards.map((board) => (
          <Grid item key={board.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ marginBottom: "8px", backgroundColor: "black" }}>
              <CardContent>
                <Link to={`/boards/${board.id}`}>
                  <Typography variant="h6" component="div">
                    {board.name}
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ marginBottom: "8px" , width: "180px", bgcolor: 'transparent', boxShadow: '0 0 0 rgb(0, 0, 0)'}}>
            <CardContent>
              <Button variant="contained"  onClick={handlePopoverOpen} >
                Create Board
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
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
