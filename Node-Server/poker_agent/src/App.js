import "./App.css";
import React, { components } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import config from "./coreFIles/config";
import Login from "./component/login";
import Dashboard from "./component/dashboard";
import Subscribers from "./component/subscribers";
import Changepassword from "./component/changepassword";
import Userdetails from "./component/userdetails";
import AddPlayer from "./component/AddPlayer";
import AgentTransactions from "./component/AgentTransactions";
import PlayerofAgent from "./component/PlayerofAgent";
import AddChipToPlayer from "./component/AddChipsToPlayer";
import RequestChips from "./component/RequestChips";
import ChipsExtendRequest from "./component/ChipsExtendRequest";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path={`${config.baseUrl}`} element={<Login />} />
          <Route path={`${config.baseUrl}dashboard`} element={<Dashboard />} />
          <Route
            path={`${config.baseUrl}subscribers`}
            element={<Subscribers />}
          />
          <Route
            path={`${config.baseUrl}changepassword`}
            element={<Changepassword />}
          />
          <Route
            path={`${config.baseUrl}addplayer`}
            element={<AddPlayer />}
          />
         
           <Route
            path={`${config.baseUrl}addchiptoplayer`}
            element={<AddChipToPlayer />}
          />
          <Route
            path={`${config.baseUrl}userdetails/:id`}
            element={<Userdetails />}
          />
          <Route
            path={`${config.baseUrl}agenttransactions`}
            element={<AgentTransactions />}
          />
          <Route
            path={`${config.baseUrl}playerofagent`}
            element={<PlayerofAgent />}
          />
           <Route
            path={`${config.baseUrl}requestchips`}
            element={<RequestChips />}
          />
           <Route
            path={`${config.baseUrl}chipsextendrequest`}
            element={<ChipsExtendRequest />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
