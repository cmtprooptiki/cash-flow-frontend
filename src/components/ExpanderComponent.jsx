import React, { useState } from 'react';
import '../sidebar.css'
import { HiOutlineLocationMarker } from "react-icons/hi";
function Expander({ title, children }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className='expander' id={`${expanded}`}>
      <div onClick={toggleExpanded} style={{ cursor: 'pointer', display:'inline-flex'}}>
      <a><HiOutlineLocationMarker/>{title}
        {expanded ? '-' : '+'}</a>
      </div>
      {expanded && <div>{children}</div>}
    </div>
  );
}

export default Expander;
