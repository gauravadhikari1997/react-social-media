import React from "react";
import ReactDOM from "react-dom";

function App() {
  return (
    <div>
      <h3>App Component</h3>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));

//now if we save new changes
//it'll just load new component asynchronously
if (module.hot) {
  module.hot.accept();
}
