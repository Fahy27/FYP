import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button, MenuItem } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';
import { api } from '../../api/index'


const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [userParsed, setUserParsed] = useState(null)
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/auth');

    setUser(null);
  };

  

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  useEffect(() => {
    async function getUser() {
      try {
        const userFetch = await api.get("/user/getData")
        console.log(userFetch.data)
        setUserParsed(userFetch.data)
      } catch(err) {
        setUserParsed(null)
      }
    }
    getUser()
    
  }, [user])

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <Typography variant="h2">MCQ</Typography>
      </Link>
      <Link to="/exam" className={classes.navLink}>
        <MenuItem>
          <Typography textAlign="center">Start exam</Typography>
        </MenuItem>
      </Link>
      <Link to="/rewards" className={classes.navLink}>
        <MenuItem>
          <Typography textAlign="center">Rewards</Typography>
        </MenuItem>
      </Link>
      <Link to="/createQuestion" className={classes.navLink}>
        <MenuItem>
          <Typography textAlign="center">Add question</Typography>
        </MenuItem>
      </Link>

      
      <Toolbar className={classes.toolbar}>
        {userParsed != null ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
            <Typography className={classes.userName} variant="h6">{userParsed?.name}</Typography>
            <Typography className={classes.cashIndicator} variant="h6">Cash: {userParsed?.currency}</Typography>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
