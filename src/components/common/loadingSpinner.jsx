import React from "react";
import "../../spinner.css"

export default function LoadingSpinner({ loaded }) {
  return (
    <div className="spinner-container">
      <div className="loading-spinner">
      </div>
      <div>{loaded}%</div>
    </div>
  );
}
