/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
// import config from '../config/config'
import config from "../coreFIles/config";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {

  agentLogoutAction
} from "../Action/action";
const Sidebar = () => {
  const [pageUrl, setPageUrl] = useState(window.location.href);
  const loginData = !Cookies.get("loginSuccessPokerAgent")
    ? []
    : JSON.parse(Cookies.get("loginSuccessPokerAgent"));

  const logout = async () => {
    let res = await agentLogoutAction({ id : loginData.id
    });
    console.log("hello",res , res.msg  , res.success);
    if (res.success) {
      toast.success(res.msg);
      await Cookies.remove("loginSuccessPokerAgent");
      setTimeout(() => {
        window.location.href = config.baseUrl;
      }, 2000);
    } else {
      toast.error(res.msg);
    }
    
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
                    <span>Wallet Management</span>
                  </a>
                </li>

                

                

                

                {loginData.role == 2 ? (
                  <li
                    className={pageUrl.match("/addplayer") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}addplayer`}>
                      <i data-feather="lock" />
                      <span>Add Player</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 2 ? (
                  <li
                    className={pageUrl.match("/agenttransactions") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}agenttransactions`}>
                      <i data-feather="lock" />
                      <span>Transaction History</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 2 ? (
                  <li
                    className={pageUrl.match("/playerofagent") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}playerofagent`}>
                      <i data-feather="lock" />
                      <span>Player List</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 2 ? (
                  <li
                    className={pageUrl.match("/addchiptoplayer") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}addchiptoplayer`}>
                      <i data-feather="lock" />
                      <span>Send Chips To Player</span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 2 ? (
                  <li
                    className={pageUrl.match("/requestchips") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}requestchips`}>
                      <i data-feather="lock" />
                      <span>Withdraw Request </span>
                    </a>
                  </li>
                ) : (
                  ""
                )}

                {loginData.role == 2 ? (
                  <li
                    className={pageUrl.match("/chipsextendrequest") ? "active" : ""}
                  >
                    <a href={`${config.baseUrl}chipsextendrequest`}>
                      <i data-feather="lock" />
                      <span>Chips Extend Request </span>
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
