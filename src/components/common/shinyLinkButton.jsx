import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import '../../shinyHover.css'

function ShinyLinkButton({ linkAddress, buttonIcon, buttonLabel }) {
  const buttonReference = useRef(null);
  const [hoverEffectTop, setHoverEffectTop] = useState(0);
  const [hoverEffectLeft, setHoverEffectLeft] = useState(0);
  const [hoverEffectHidden, setHoverEffectHidden] = useState(true);

  const follow = (e) => {
    const { x, y } = buttonReference.current.getBoundingClientRect();
    setHoverEffectLeft(e.clientX - parseInt(x));
    setHoverEffectTop(e.clientY - parseInt(y));
  };

  const showHover = () => {
    setHoverEffectHidden(false);
  };

  const hideHover = () => {
    setHoverEffectHidden(true);
  };

  return (
    <div
      className="shiny-container"
      onMouseOver={showHover}
      onMouseOut={hideHover}
      onMouseMove={follow}
    >
      <Link
        ref={buttonReference}
        to={linkAddress}
        className="shiny-link"
        onMouseDown={hideHover}
        onMouseUp={showHover}
      >
        <div
          style={{
            top: hoverEffectTop,
            left: hoverEffectLeft,
          }}
          className="hoverEffect"
          hidden={hoverEffectHidden}
        ></div>
        {buttonIcon && (<i style={{ marginRight: 2 }} className={`fa ${buttonIcon}`}></i>)}
        {buttonLabel}
      </Link>
    </div>
  );
}

export default ShinyLinkButton;
