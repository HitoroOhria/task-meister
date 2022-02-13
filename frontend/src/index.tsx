import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
// import MindMap from "src/components/pages/MindMap";
import MindMapPage from "~/components/pages/MindMapPage";

ReactDOM.render(
  // TODO Dispatch twice on Strict Mode.
  // So, following bugs occur
  //   - Can not collapse (double triggered)
  //   - Two nodes are added
  //   - see https://github.com/facebook/react/issues/16295
  // <React.StrictMode>
  <MindMapPage />,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
