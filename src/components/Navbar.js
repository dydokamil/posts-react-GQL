import React from 'react'
import { Link } from 'react-router-dom'

import './Navbar.css'

export const Navbar = () => (
  <div className="navbar">
    <Link to="/">Home</Link>
    <Link to="/users">Users</Link>
  </div>
)

export default Navbar
