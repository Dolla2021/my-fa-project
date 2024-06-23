import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/design">Design FA</Link></li>
      <li><Link to="/test">Test FA</Link></li>
      <li><Link to="/conversion">Convert NFA to DFA</Link></li>
      <li><Link to="/minimize">Minimize DFA</Link></li>
      <li><Link to="/database">Database</Link></li>
    </ul>
  </nav>
);

export default NavBar;
