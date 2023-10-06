import "./App.css";
import React, { components } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import config from "./coreFIles/config";
import Login from "./component/login";
import Dashboard from "./component/dashboard";
import Users from "./component/users";
import Systemsetting from "./component/systemsetting";
import Subscribers from "./component/subscribers";
import Changepassword from "./component/changepassword";
import Userdetails from "./component/userdetails";
import SupportManagement from "./component/SupportManagement";
import Transactions from "./component/Transactions";
import AddUser from "./component/AddUser";
import AddChip from "./component/AddChip";
import AddCommission from "./component/AddCommission";
import Tournament from "./component/Tournament";
import PokerTable from "./component/PokerTable";
import TournamentUsers from "./component/TournamentUsers";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path={`${config.baseUrl}`} element={<Login />} />
          <Route path={`${config.baseUrl}dashboard`} element={<Dashboard />} />
          <Route path={`${config.baseUrl}users`} element={<Users />} />
          <Route
            path={`${config.baseUrl}systemsetting`}
            element={<Systemsetting />}
          />
          <Route
            path={`${config.baseUrl}subscribers`}
            element={<Subscribers />}
          />
          <Route
            path={`${config.baseUrl}changepassword`}
            element={<Changepassword />}
          />
          <Route
            path={`${config.baseUrl}supportmanagement`}
            element={<SupportManagement />}
          />
          <Route
            path={`${config.baseUrl}transactions`}
            element={<Transactions />}
          />
           <Route
            path={`${config.baseUrl}tournament`}
            element={<Tournament />}
          />
             <Route
            path={`${config.baseUrl}pokertable`}
            element={<PokerTable />}
          />
          <Route
            path={`${config.baseUrl}adduser`}
            element={<AddUser />}
          />
          <Route
            path={`${config.baseUrl}addchip`}
            element={<AddChip />}
          />
             <Route
            path={`${config.baseUrl}addcommission`}
            element={<AddCommission />}
          />
          <Route
            path={`${config.baseUrl}userdetails/:id`}
            element={<Userdetails />}
          />
            <Route
            path={`${config.baseUrl}userstournament/:id`}
            element={<TournamentUsers />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
