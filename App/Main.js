import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("rsmToken"))
  );
  const [flashMessages, setFlashMessages] = useState([]);

  function addFlashMessage(msg) {
    setFlashMessages((prev) => prev.concat(msg));
  }

  return (
    <BrowserRouter>
      <FlashMessages messages={flashMessages} />
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Switch>
        <Route path="/" exact>
          {isLoggedIn ? <Home /> : <HomeGuest />}
        </Route>
        <Route path="/create-post">
          <CreatePost addFlashMessage={addFlashMessage} />
        </Route>
        <Route path="/post/:id">
          <ViewSinglePost />
        </Route>
        <Route path="/about-us">
          <About />
        </Route>
        <Route path="/terms">
          <Terms />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

ReactDOM.render(<Main />, document.querySelector("#root"));

//now if we save new changes
//it'll just load new component asynchronously
if (module.hot) {
  module.hot.accept();
}
