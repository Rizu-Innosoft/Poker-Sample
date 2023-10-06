import React, { Component, useEffect, useState } from 'react'

import config from '../coreFIles/config'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'

const Header = () => {

  const loginData = (!Cookies.get('loginSuccessPokerAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessPokerAdmin'));
  if (!loginData || loginData == '') {
    window.location.href = `${config.baseUrl}`;
  }

  useEffect(() => {

  })



  const logout = async () => {
    Cookies.remove('loginSuccessPokerAdmin');
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
        <nav className="navbar navbar-static-top ">
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
              </li>
            
            </ul>
          </div>
          <div className="navbar-custom-menu r-side">
            <ul className="nav navbar-nav">
              <li className="btn-group d-lg-inline-flex d-none">
                {/* <a
                  href="#"
                  data-provide="fullscreen"
                  className="waves-effect waves-light full-screen btn-warning-light"
                  title="Full Screen"
                > */}
                  {/* <i data-feather="maximize" /> */}
                  <img
                    src="./images/avatar/avatar-1.png"
                    className="avatar rounded-10 bg-primary-light h-40 w-40"
                    alt=""
                    style={{margin:'25px'}}
                  />

                {/* </a> */}
              </li>
            

            </ul>
          </div>
        </nav>
      </header>

    </>
  )
}
export default Header;