import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import Chat from "./components/Chat";

function Main() {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("rsmToken")),
    flashMessages: [],
    user: {
      username: localStorage.getItem("rsmUsername"),
      token: localStorage.getItem("rsmToken"),
      avatar: localStorage.getItem("rsmAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.isLoggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.isLoggedIn = false;
        return;
      case "flashMessages":
        draft.flashMessages.push(action.value);
        return;
      case "searchOpen":
        draft.isSearchOpen = true;
        return;
      case "searchClose":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "chatClose":
        draft.isChatOpen = false;
        return;
      case "incrementChatCount":
        draft.unreadChatCount++;
        return;
      case "clearChatCount":
        draft.unreadChatCount = 0;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem("rsmUsername", state.user.username);
      localStorage.setItem("rsmToken", state.user.token);
      localStorage.setItem("rsmAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("rsmToken");
      localStorage.removeItem("rsmUsername");
      localStorage.removeItem("rsmAvatar");
    }
  }, [state.isLoggedIn]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.isLoggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          {state.isSearchOpen ? <Search /> : ""}
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#root"));

//now if we save new changes
//it'll just load new component asynchronously
if (module.hot) {
  module.hot.accept();
}
