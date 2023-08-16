import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import AboutPage from "./components/AboutPage";
import DashboardPage from "./components/DashboardPage";
import AllExpensesPage from "./components/AllExpensesPage";
import EditFriendPage from "./components/EditFriendPage";
import FriendPage from "./components/FriendPage";
import { authenticate } from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {isLoaded && (



        <Switch>
          <Route exact path="/">
            <AboutPage />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/dashboard">
            <DashboardPage />
          </Route>
          <Route path="/all">
            <AllExpensesPage />
          </Route>
          <Route path="/friends/:id/edit">
            <EditFriendPage />
          </Route>
          <Route path="/friends/:id">
            <FriendPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
