import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Exam from './components/Exam/Exam'
import Rewards from './components/Rewards/Rewards'
import CreateQuestion from './components/Exam/CreateQuestion'
import Leaderboard from './components/Leaderboard/Leaderboard'

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Leaderboard} />
          <Route path="/auth" exact component={() => (!user ? <Auth /> : <Redirect to="/" />)} />
          <Route path="/exam" exact component={Exam} />
          <Route path="/rewards" exact component={Rewards} />
          <Route path="/createQuestion" exact component={CreateQuestion} />
          <Route path="/leaderboard" exact component={Leaderboard} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
