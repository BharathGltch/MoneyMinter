import { Button, Divider, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material"
import { MyContext } from "./ContextProvider"
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import MenuIcon from '@mui/icons-material/Menu';



export default function Appbar() {

    const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
    const context = useContext(MyContext);
    console.log("Context inside appbar is ", context);
    const navigate = useNavigate();




    const handleLogout = () => {
        localStorage.removeItem("token");
        context?.setIsLoggedIn(false);
        window.location.href = "/";
    }

    const handleContribute = () => {
        const newWindow = window.open("https://github.com/BharathGltch/MoneyMinter", '_blank', 'noopener,noreferrer');
        if (newWindow)
            newWindow.opener = null;
    }

    const toggleDrawer = (value: boolean) => () => {
        setDrawerOpen(value);
    }



    if (context?.isLoggedIn === true) {
        return (
            <div className="container mx-auto px-2">
                <div className="flex justify-between">
                    <div className="flex">
                        <Link to="/" className="mt-4 ml-9">
                            <img src={"https://lirp.cdn-website.com/eb1755b3/dms3rep/multi/opt/OWAY-1314w.png"} width={100} height={100} />
                        </Link>

                    </div>

                    <div className="mt-4 mb-1 mr-6 flex">
                        <div className="flex justify-between mr-4">
                            <Button onClick={handleContribute} variant="contained" size="small" ><FaGithub style={{ marginRight: '5px' }} />Contribute</Button>
                        </div>
                        <div>
                            <Button onClick={handleLogout} variant="contained" >Logout</Button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    const handleLogin = () => {
        navigate("/login");
    }

    const handleRegister = () => {
        navigate("/register");
    }

    return (
        <div className="container mx-auto px-1">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center px-2">
                        <img src={"https://lirp.cdn-website.com/eb1755b3/dms3rep/multi/opt/OWAY-1314w.png"} alt="Logo" className="max-h-8 sm:max-h-12  w-auto h-auto" />
                    </Link>

                </div>

                <div className="hidden sm:flex items-center space-x-4">
                    <Button onClick={handleContribute} variant="contained" ><FaGithub className="mr-2" />Contribute</Button>

                    <Button onClick={handleRegister} variant="contained" >SignUp</Button>

                    <Button onClick={handleLogin} variant="contained" >Login</Button>
                </div>

                <div className="sm:hidden">
                    <IconButton
                        edge="start"
                        color="primary"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)} PaperProps={{
                        sx: {
                            backgroundColor: "black",
                            color: "primary.main"
                        }
                    }} >
                        <div>
                            <List>
                                <ListItem  onClick={handleContribute}>
                                    <FaGithub className="mr-2" />
                                    <ListItemText primary="Contribute" />
                                </ListItem>
                                <Divider color="purple"/>
                                
                                {context?.isLoggedIn ? (
                                    <ListItem onClick={handleLogout}>
                                        <ListItemText primary="Logout" />
                                    </ListItem>
                                    
                                ) : (
                                    <>
                                        <ListItem onClick={handleRegister}>
                                            <ListItemText primary="Sign Up" color="primary" />
                                        </ListItem>
                                        <Divider color="purple"/>
                                        <ListItem onClick={handleLogin}>
                                            <ListItemText primary="Login" color="blue" />
                                        </ListItem>
                                       
                                    </>
                                )}
                            </List>
                        </div>
                    </Drawer>
                </div>
            </div>
        </div>
    )
}