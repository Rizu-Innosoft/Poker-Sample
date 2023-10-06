import React, { Component } from 'react'

// import config from '../config/config'
import config from '../coreFIles/config'
import { Link } from 'react-router-dom';

const Footer = () => {


    return (

        <>
        {/* /.content-wrapper */}
  <footer className="main-footer">
    <div className="pull-right d-none d-sm-inline-block">
      
    </div>
    2023 © <a href="#">MG Poker Agent Panel</a>. Restricted Area
  
  </footer>
  {/* Control Sidebar */}
  <aside className="control-sidebar">
    <div className="rpanel-title">
      <span
        className="pull-right btn btn-circle btn-danger"
        data-toggle="control-sidebar"
      >
        <i className="ion ion-close text-white" />
      </span>{" "}
    </div>{" "}
    {/* Create the tabs */}
    <ul className="nav nav-tabs control-sidebar-tabs">
      <li className="nav-item">
        <a href="#control-sidebar-home-tab" data-bs-toggle="tab">
          <i className="mdi mdi-message-text" />
        </a>
      </li>
      <li className="nav-item">
        <a href="#control-sidebar-settings-tab" data-bs-toggle="tab">
          <i className="mdi mdi-playlist-check" />
        </a>
      </li>
    </ul>
    {/* Tab panes */}
    <div className="tab-content">
      {/* Home tab content */}
      <div className="tab-pane" id="control-sidebar-home-tab">
        <div className="flexbox">
          <a href="javascript:void(0)" className="text-grey">
            <i className="ti-more" />
          </a>
          <p>Users</p>
          <a href="javascript:void(0)" className="text-end text-grey">
            <i className="ti-plus" />
          </a>
        </div>
        <div className="lookup lookup-sm lookup-right d-none d-lg-block">
          <input type="text" name="s" placeholder="Search" className="w-p100" />
        </div>
        <div className="media-list media-list-hover mt-20">
          <div className="media py-10 px-0">
            <a className="avatar avatar-lg status-success" href="#">
              <img src="../images/avatar/1.jpg" alt="..." />
            </a>
            <div className="media-body">
              <p className="fs-16">
                <a className="hover-primary" href="#">
                  <strong>Tyler</strong>
                </a>
              </p>
              <p>Praesent tristique diam...</p>
              <span>Just now</span>
            </div>
          </div>
          <div className="media py-10 px-0">
            <a className="avatar avatar-lg status-danger" href="#">
              <img src="../images/avatar/2.jpg" alt="..." />
            </a>
            <div className="media-body">
              <p className="fs-16">
                <a className="hover-primary" href="#">
                  <strong>Luke</strong>
                </a>
              </p>
              <p>Cras tempor diam ...</p>
              <span>33 min ago</span>
            </div>
          </div>
          <div className="media py-10 px-0">
            <a className="avatar avatar-lg status-warning" href="#">
              <img src="../images/avatar/3.jpg" alt="..." />
            </a>
            <div className="media-body">
              <p className="fs-16">
                <a className="hover-primary" href="#">
                  <strong>Evan</strong>
                </a>
              </p>
              <p>In posuere tortor vel...</p>
              <span>42 min ago</span>
            </div>
          </div>
          <div className="media py-10 px-0">
            <a className="avatar avatar-lg status-primary" href="#">
              <img src="../images/avatar/4.jpg" alt="..." />
            </a>
            <div className="media-body">
              <p className="fs-16">
                <a className="hover-primary" href="#">
                  <strong>Evan</strong>
                </a>
              </p>
              <p>In posuere tortor vel...</p>
              <span>42 min ago</span>
            </div>
          </div>
          <div className="media py-10 px-0">
            <a className="avatar avatar-lg status-success" href="#">
              <img src="../images/avatar/1.jpg" alt="..." />
            </a>
            <div className="media-body">
              <p className="fs-16">
                <a className="hover-primary" href="#">
                  <strong>Tyler</strong>
                </a>
              </p>
              <p>Praesent tristique diam...</p>
              <span>Just now</span>
            </div>
          </div>
          <div className="media py-10 px-0">
            <a className="avatar avatar-lg status-danger" href="#">
              <img src="../images/avatar/2.jpg" alt="..." />
            </a>
            <div className="media-body">
              <p className="fs-16">
                <a className="hover-primary" href="#">
                  <strong>Luke</strong>
                </a>
              </p>
              <p>Cras tempor diam ...</p>
              <span>33 min ago</span>
            </div>
          </div>
          <div className="media py-10 px-0">
            <a className="avatar avatar-lg status-warning" href="#">
              <img src="../images/avatar/3.jpg" alt="..." />
            </a>
            <div className="media-body">
              <p className="fs-16">
                <a className="hover-primary" href="#">
                  <strong>Evan</strong>
                </a>
              </p>
              <p>In posuere tortor vel...</p>
              <span>42 min ago</span>
            </div>
          </div>
          <div className="media py-10 px-0">
            <a className="avatar avatar-lg status-primary" href="#">
              <img src="../images/avatar/4.jpg" alt="..." />
            </a>
            <div className="media-body">
              <p className="fs-16">
                <a className="hover-primary" href="#">
                  <strong>Evan</strong>
                </a>
              </p>
              <p>In posuere tortor vel...</p>
              <span>42 min ago</span>
            </div>
          </div>
        </div>
      </div>
      {/* /.tab-pane */}
      {/* Settings tab content */}
      <div className="tab-pane" id="control-sidebar-settings-tab">
        <div className="flexbox">
          <a href="javascript:void(0)" className="text-grey">
            <i className="ti-more" />
          </a>
          <p>Todo List</p>
          <a href="javascript:void(0)" className="text-end text-grey">
            <i className="ti-plus" />
          </a>
        </div>
        <ul className="todo-list mt-20">
          <li className="py-15 px-5 by-1">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_1"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_1" className="mb-0 h-15" />
            {/* todo text */}
            <span className="text-line">Nulla vitae purus</span>
            {/* Emphasis label */}
            <small className="badge bg-danger">
              <i className="fa fa-clock-o" /> 2 mins
            </small>
            {/* General tools such as edit or delete*/}
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_2"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_2" className="mb-0 h-15" />
            <span className="text-line">Phasellus interdum</span>
            <small className="badge bg-info">
              <i className="fa fa-clock-o" /> 4 hours
            </small>
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5 by-1">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_3"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_3" className="mb-0 h-15" />
            <span className="text-line">Quisque sodales</span>
            <small className="badge bg-warning">
              <i className="fa fa-clock-o" /> 1 day
            </small>
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_4"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_4" className="mb-0 h-15" />
            <span className="text-line">Proin nec mi porta</span>
            <small className="badge bg-success">
              <i className="fa fa-clock-o" /> 3 days
            </small>
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5 by-1">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_5"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_5" className="mb-0 h-15" />
            <span className="text-line">Maecenas scelerisque</span>
            <small className="badge bg-primary">
              <i className="fa fa-clock-o" /> 1 week
            </small>
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_6"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_6" className="mb-0 h-15" />
            <span className="text-line">Vivamus nec orci</span>
            <small className="badge bg-info">
              <i className="fa fa-clock-o" /> 1 month
            </small>
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5 by-1">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_7"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_7" className="mb-0 h-15" />
            {/* todo text */}
            <span className="text-line">Nulla vitae purus</span>
            {/* Emphasis label */}
            <small className="badge bg-danger">
              <i className="fa fa-clock-o" /> 2 mins
            </small>
            {/* General tools such as edit or delete*/}
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_8"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_8" className="mb-0 h-15" />
            <span className="text-line">Phasellus interdum</span>
            <small className="badge bg-info">
              <i className="fa fa-clock-o" /> 4 hours
            </small>
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5 by-1">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_9"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_9" className="mb-0 h-15" />
            <span className="text-line">Quisque sodales</span>
            <small className="badge bg-warning">
              <i className="fa fa-clock-o" /> 1 day
            </small>
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
          <li className="py-15 px-5">
            {/* checkbox */}
            <input
              type="checkbox"
              id="basic_checkbox_10"
              className="filled-in"
            />
            <label htmlFor="basic_checkbox_10" className="mb-0 h-15" />
            <span className="text-line">Proin nec mi porta</span>
            <small className="badge bg-success">
              <i className="fa fa-clock-o" /> 3 days
            </small>
            <div className="tools">
              <i className="fa fa-edit" />
              <i className="fa fa-trash-o" />
            </div>
          </li>
        </ul>
      </div>
      {/* /.tab-pane */}
    </div>
  </aside>
  {/* /.control-sidebar */}
  {/* Add the sidebar's background. This div must be placed immediately after the control sidebar */}
  <div className="control-sidebar-bg" />
  {/* ./wrapper */}
  <div id="chat-box-body">
    {/* <div
      id="chat-circle"
      className="waves-effect waves-circle btn btn-circle btn-sm btn-warning l-h-50"
    >
      <div id="chat-overlay" />
      <span className="icon-Group-chat fs-18">
        <span className="path1" />
        <span className="path2" />
      </span>
    </div> */}
    <div className="chat-box">
      <div className="chat-box-header p-15 d-flex justify-content-between align-items-center">
        <div className="btn-group">
          <button
            className="waves-effect waves-circle btn btn-circle btn-primary-light h-40 w-40 rounded-circle l-h-45"
            type="button"
            data-bs-toggle="dropdown"
          >
            <span className="icon-Add-user fs-22">
              <span className="path1" />
              <span className="path2" />
            </span>
          </button>
          <div className="dropdown-menu min-w-200">
            <a className="dropdown-item fs-16" href="#">
              <span className="icon-Color me-15" />
              New Group
            </a>
            <a className="dropdown-item fs-16" href="#">
              <span className="icon-Clipboard me-15">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
              </span>
              Contacts
            </a>
            <a className="dropdown-item fs-16" href="#">
              <span className="icon-Group me-15">
                <span className="path1" />
                <span className="path2" />
              </span>
              Groups
            </a>
            <a className="dropdown-item fs-16" href="#">
              <span className="icon-Active-call me-15">
                <span className="path1" />
                <span className="path2" />
              </span>
              Calls
            </a>
            <a className="dropdown-item fs-16" href="#">
              <span className="icon-Settings1 me-15">
                <span className="path1" />
                <span className="path2" />
              </span>
              Settings
            </a>
            <div className="dropdown-divider" />
            <a className="dropdown-item fs-16" href="#">
              <span className="icon-Question-circle me-15">
                <span className="path1" />
                <span className="path2" />
              </span>
              Help
            </a>
            <a className="dropdown-item fs-16" href="#">
              <span className="icon-Notifications me-15">
                <span className="path1" />
                <span className="path2" />
              </span>
              Privacy
            </a>
          </div>
        </div>
        <div className="text-center flex-grow-1">
          <div className="text-dark fs-18">Mayra Sibley</div>
          <div>
            <span className="badge badge-sm badge-dot badge-primary" />
            <span className="text-muted fs-12">Active</span>
          </div>
        </div>
        <div className="chat-box-toggle">
          <button
            id="chat-box-toggle"
            className="waves-effect waves-circle btn btn-circle btn-danger-light h-40 w-40 rounded-circle l-h-45"
            type="button"
          >
            <span className="icon-Close fs-22">
              <span className="path1" />
              <span className="path2" />
            </span>
          </button>
        </div>
      </div>
      <div className="chat-box-body">
        <div className="chat-box-overlay"></div>
        <div className="chat-logs">
          <div className="chat-msg user">
            <div className="d-flex align-items-center">
              <span className="msg-avatar">
                <img
                  src="../images/avatar/2.jpg"
                  className="avatar avatar-lg"
                  alt=""
                />
              </span>
              <div className="mx-10">
                <a href="#" className="text-dark hover-primary fw-bold">
                  Mayra Sibley
                </a>
                <p className="text-muted fs-12 mb-0">2 Hours</p>
              </div>
            </div>
            <div className="cm-msg-text">Hi there, I'm Jesse and you?</div>
          </div>
          <div className="chat-msg self">
            <div className="d-flex align-items-center justify-content-end">
              <div className="mx-10">
                <a href="#" className="text-dark hover-primary fw-bold">
                  You
                </a>
                <p className="text-muted fs-12 mb-0">3 minutes</p>
              </div>
              <span className="msg-avatar">
                <img
                  src="../images/avatar/3.jpg"
                  className="avatar avatar-lg"
                  alt=""
                />
              </span>
            </div>
            <div className="cm-msg-text">My name is Anne Clarc.</div>
          </div>
          <div className="chat-msg user">
            <div className="d-flex align-items-center">
              <span className="msg-avatar">
                <img
                  src="../images/avatar/2.jpg"
                  className="avatar avatar-lg"
                  alt=""
                />
              </span>
              <div className="mx-10">
                <a href="#" className="text-dark hover-primary fw-bold">
                  Mayra Sibley
                </a>
                <p className="text-muted fs-12 mb-0">40 seconds</p>
              </div>
            </div>
            <div className="cm-msg-text">
              Nice to meet you Anne.
              <br />
              How can i help you?
            </div>
          </div>
        </div>
        {/*chat-log */}
      </div>
      <div className="chat-input">
        <form>
          <input type="text" id="chat-input" placeholder="Send a message..." />
          <button type="submit" className="chat-submit" id="chat-submit">
            <span className="icon-Send fs-22" />
          </button>
        </form>
      </div>
    </div>
  </div>
  {/* Page Content overlay */}
        </>
    )
}
export default Footer;