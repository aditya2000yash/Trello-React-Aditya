import { CssBaseline, Toolbar, AppBar } from "@mui/material";
import trelloLogo from '../assets/Trello-white.svg'; 

const NavBar = () => {
  return (
    <>
      <CssBaseline />
      <AppBar position="relative" sx={{ backgroundColor: 'black', marginBottom: "30px" }}>
        <Toolbar>
          <img src={trelloLogo} alt="Trello Logo" style={{ height: '40px' }} /> 
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;
