/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
// import config from '../config/config'
import config from "../coreFIles/config";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [pageUrl, setPageUrl] = useState(window.location.href);
  const loginData = !Cookies.get("loginSuccessPokerAdmin")
    ? []
    : JSON.parse(Cookies.get("loginSuccessPokerAdmin"));
  const logout = async () => {
    Cookies.remove("loginSuccessPokerAdmin");
    window.location.href = config.baseUrl;
  };

  return (
    <>
      <aside className="main-sidebar">
        {/* sidebar*/}
        <section className="sidebar position-relative">
          <div className="multinav">
            <div className="multinav-scroll" style={{ height: "100%" }} >
              {/* sidebar menu*/}
              <ul className="sidebar-menu" data-widget="tree">



                <li
                  className={
                    pageUrl.match("/dashboard") || pageUrl.match("/userReferrals")
                      ? "active"
                      : ""
                  }
                >
                  <a href={`${config.baseUrl}dashboard`}>
                    {/* <i data-feather="user" /> */}
                    <i class="fa fa-user" aria-hidden="true"></i>
                    <span>Dashboard</span>
                  </a>
                </li>

                {loginData.role == 1 ? (
                  <li
                    className={
                      pageUrl.match("/users") || pageUrl.match("/userReferrals")
                        ? "active"
                        : ""
                    }
                  >
                    <a href={`${config.baseUrl}users`}>
                      {/* <i data-feather="user" /> */}
                      <i class="fa fa-user" aria-hidden="true"></i>
                      <span>Players</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}
                {loginData.role == 1 ? (
                  <li className={pageUrl.match("/systemsetting") ? "active" : ""}>
                    <a href={`${config.baseUrl}systemsetting`}>
                      <i className="fa fa-cog" aria-hidden="true" />
                      <span>Poker Management</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 1 ? (
                  <li
                    className={pageUrl.match("/transactions") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}transactions`}>
                      <i data-feather="lock" />
                      <span>Transactions</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 1 ? (
                  <li
                    className={pageUrl.match("/tournament") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}tournament`}>
                      <i data-feather="lock" />
                      <span>Tournament</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {/* {loginData.role == 1 ? (
                  <li
                    className={pageUrl.match("/pokertable") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}pokertable`}>
                      <i data-feather="lock" />
                      <span>Poker Table</span>
                    </a>
                  </li>
                ) : (
                  ""
                )} */}

                {loginData.role == 1 ? (
                  <li
                    className={pageUrl.match("/addchip") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}addchip`}>
                      <i data-feather="lock" />
                      <span>Send Chips to Agent</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 1 ? (
                  <li
                    className={pageUrl.match("/addcommission") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}addcommission`}>
                      <i data-feather="lock" />
                      <span>Add Commission</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 1 ? (
                  <li
                    className={pageUrl.match("/adduser") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}adduser`}>
                      <i data-feather="lock" />
                      <span>Add Agent</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}














                {loginData.role == 1 ? (
                  <li
                    className={pageUrl.match("/supportmanagement") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}supportmanagement`}>
                      <i data-feather="lock" />
                      <span>Support Management</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}



                <li
                  className={pageUrl.match("/changepassword") ? "active" : ""}
                >
                  <a href={`${config.baseUrl}changepassword`}>
                    <i data-feather="lock" />
                    <span>Change Password</span>
                  </a>
                </li>



                <li className="">
                  <a href="javascript:;" onClick={logout}>
                    <i data-feather="log-out" />
                    <span>Logout</span>
                  </a>
                </li>

              </ul>
            </div>
          </div>
        </section>
      </aside>
    </>
  );
};
export default Sidebar;
