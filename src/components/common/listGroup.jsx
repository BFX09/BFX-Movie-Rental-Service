import React, { useState, useEffect } from "react";
import "bootstrap/js/src/dropdown";

const ListGroup = ({
  items,
  textProperty,
  valueProperty,
  selectedItem,
  onItemSelect,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const detectWindowWidth = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", detectWindowWidth);

    return () => {
      window.addEventListener("resize", detectWindowWidth);
    };
  }, [windowWidth]);

  if (windowWidth > 740) {
    return (
      <ul className="list-group">
        {items.map((item) => (
          <li
            onClick={() => onItemSelect(item)}
            key={item[valueProperty]}
            className={
              item === selectedItem
                ? "list-group-item active"
                : "list-group-item"
            }
          >
            {item[textProperty]}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="dropdown">
      <button
        class="btn btn-primary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Filters
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {items.map((item) => (
          <button
            onClick={() => onItemSelect(item)}
            key={item[valueProperty]}
            className={
              item === selectedItem
                ? "dropdown-item active"
                : "dropdown-item"
            }
          >
            {item[textProperty]}
          </button>
        ))}
      </div>
    </div>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;
