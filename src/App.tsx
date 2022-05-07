import React from "react";
import "./App.css";
import Navbar from "./components/navbar";
import Resumecard from "./components/resumecard";
import Listingcard from "./components/listingcard";

import sample_feed from "./sample_data/sample_feed.json";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="row">
        <div className="col-md-3">
          Since 9 + 4 = 13 12, this 4-column-wide div gets wrapped onto a new
          line as one contiguous unit.
        </div>
        <div className="col-md-6">
          {sample_feed.cards.map((d) => (
            <Resumecard {...d} />
          ))}
        </div>
        <div className="col-md-3">
          <Listingcard uploadLink="http://google.com" />
        </div>
      </div>
    </div>
  );
}

export default App;
