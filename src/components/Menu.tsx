import React from 'react';
import '../App.css';

function Menu() {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start" style={{backgroundColor: "#282c34"}}>
      <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 mx-5 mt-3">
        <li>
            <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none position-fixed">
              <img src="github-mark-white.svg" width="40px"></img>     
            </a>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
