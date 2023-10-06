import React, { Component, useEffect, useState } from 'react'

import config from '../coreFIles/config'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'

const Header = () => {

  const loginData = (!Cookies.get('loginSuccessPokerAgent')) ? [] : JSON.parse(Cookies.get('loginSuccessPokerAgent'));
    if (!loginData || loginData == '') {
      window.location.href = `${config.baseUrl}`;
    }

  useEffect(() => {

  })

  

  const logout = async () => {
    Cookies.remove('loginSuccessPokerAgent');
    window.location.href = config.baseUrl;
}

    return (

        <>
        <header className="main-header">
  <div className="d-flex align-items-center logo-box justify-content-start">
    {/* Logo */}
    <a href="#" className="logo">
      {/* logo*/}
      <div className="logo-mini w-50">
        <span className="light-logo text-center text-decoration-none">
        <h1>MG POKER</h1>
        </span>
        <span className="dark-logo text-center text-decoration-none">
        <h1>MG POKER</h1>
        </span>
      </div>
      <div className="logo-lg">
        <span className="light-logo text-center text-decoration-none">
        <h1>MG POKER</h1>
        </span>
        <span className="dark-logo text-center text-decoration-none">
        <h1>MG POKER</h1>
        </span>
      </div>
    </a>
  </div>
  {/* Header Navbar */}
  <nav className="navbar navbar-static-top">
    {/* Sidebar toggle button*/}
    <div className="app-menu">
      <ul className="header-megamenu nav">
        <li className="btn-group nav-item">
          <a
            href="#"
            className="waves-effect waves-light nav-link push-btn btn-primary-light"
            data-toggle="push-menu"
            role="button"
          >
            {/* <i data-feather="align-left" /> */}
            <i className="fa fa-bars" aria-hidden="true" />
          </a>

          {/* <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Button with data-bs-target
  </button> */}
        </li>
        {/* <li className="btn-group d-lg-inline-flex d-none">
          <div className="app-menu">
            <div className="search-bx mx-5">
              <form>
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <div className="input-group-append">
                    <button className="btn" type="submit" id="button-addon3">
                      <i data-feather="search" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </li> */}
      </ul>
    </div>
    <div className="navbar-custom-menu r-side">
      <ul className="nav navbar-nav">
        {/* <li className="btn-group d-lg-inline-flex d-none">
          <a
            href="#"
            data-provide="fullscreen"
            className="waves-effect waves-light full-screen btn-warning-light"
            title="Full Screen"
          >
            <i data-feather="maximize" />
          </a>
        </li> */}
        {/* Notifications */}
        {/* <li className="dropdown notifications-menu">
          <a
            href="#"
            className="waves-effect waves-light dropdown-toggle btn-info-light"
            data-bs-toggle="dropdown"
            title="Notifications"
          >
            <i data-feather="bell" />
          </a>
          <ul className="dropdown-menu animated bounceIn">
            <li className="header">
              <div className="p-20">
                <div className="flexbox">
                  <div>
                    <h4 className="mb-0 mt-0">Notifications</h4>
                  </div>
                  <div>
                    <a href="#" className="text-danger">
                      Clear All
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li>
             
              <ul className="menu sm-scrol">
                <li>
                  <a href="#">
                    <i className="fa fa-users text-info" /> Curabitur id eros
                    quis nunc suscipit blandit.
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-warning text-warning" /> Duis malesuada
                    justo eu sapien elementum, in semper diam posuere.
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-users text-danger" /> Donec at nisi sit
                    amet tortor commodo porttitor pretium a erat.
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-shopping-cart text-success" /> In
                    gravida mauris et nisi
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-user text-danger" /> Praesent eu lacus
                    in libero dictum fermentum.
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-user text-primary" /> Nunc fringilla
                    lorem
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-user text-success" /> Nullam euismod
                    dolor ut quam interdum, at scelerisque ipsum imperdiet.
                  </a>
                </li>
              </ul>
            </li>
            <li className="footer">
              <a href="#">View all</a>
            </li>
          </ul>
        </li> */}
        {/* Control Sidebar Toggle Button */}
        
        {/* User Account*/}
       
      </ul>
    </div>
  </nav>
</header>

        </>
    )
}
export default Header;