import React from "react";
import ReactDOM from "react-dom";

import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";

function Main() {
  return (
    <>
      <Header />
      <HomeGuest />
      <Footer />
    </>
  );
}

ReactDOM.render(<Main />, document.querySelector("#root"));

//now if we save new changes
//it'll just load new component asynchronously
if (module.hot) {
  module.hot.accept();
}
