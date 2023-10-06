import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  postRequestFormData,
} from "../coreFIles/helper";

export const LoginAction = (data) => {
  return postRequest("agentLogin", data).then((res) => {
    return res.data;
  });
};

export const getDashboardStatisticsAction = (data) => {
  return postRequest("getDashboardStatistics", data).then((res) => {
    return res.data;
  });
};

export const getlockingdurationAction = (data) => {
  return postRequest("getlockingduration", data).then((res) => {
    return res.data;
  });
};

export const totalamountreceivedfromadminAction = (data) => {
  return postRequest("totalamountreceivedfromadmin", data).then((res) => {
    return res.data;
  });
};

export const getcommissionpriceAction = (data) => {
  return postRequest("getcommissionprice", data).then((res) => {
    return res.data;
  });
};

export const getUsersListAction = (data) => {
  return postRequest("getUsersList", data).then((res) => {
    return res.data;
  });
};

export const loginAsUserAction = (data) => {
  return postRequest("loginAsUser", data).then((res) => {
    return res.data;
  });
};
export const getUsersReferralsAction = (data) => {
  return postRequest("getUsersReferrals", data).then((res) => {
    return res.data;
  });
};


export const getallticketAction = (data) => {
  return postRequest("getallticket", data).then((res) => {
    return res.data;
  });
};

export const ticketapproveAction = (data) => {
  return postRequest("ticketapprove", data).then((res) => {
    return res.data;
  });
};

export const ticketrejectAction = (data) => {
  return postRequest("ticketreject", data).then((res) => {
    return res.data;
  });
};

export const getalltransactionAction = (data) => {
  return postRequest("getalltransaction", data).then((res) => {
    return res.data;
  });
};

export const getagenttransactionAction = (data) => {
  return postRequest("getagenttransaction", data).then((res) => {
    return res.data;
  });
};

export const getplayerofagentlistAction = (data) => {
  return postRequest("getplayerofagentlist", data).then((res) => {
    return res.data;
  });
};

export const getSystemSettingAction = (data) => {
  return postRequest("getSystemSetting", data).then((res) => {
    return res.data;
  });
};

export const updateSystemSettingAction = (data) => {
  return postRequest("updateSystemSetting", data).then((res) => {
    return res.data;
  });
};







export const getSubscriberListAction = (data) => {
  return postRequest("getSubscriberList", data).then((res) => {
    return res.data;
  });
};

export const changePasswordAction = (data) => {
  return postRequest("changePasswordforagent", data).then((res) => {
    return res.data;
  });
};

export const agentLogoutAction = (data) => {
  return postRequest("agentLogout", data).then((res) => {
    return res.data;
  });
};

export const totalchipsofagentincludingpendingAction = (data) => {
  return postRequest("totalchipsofagentincludingpending", data).then((res) => {
    return res.data;
  });
};

export const UserBlockAction = (data) => {
  return postRequest("userblock", data).then((res) => {
    return res.data;
  });
};
export const UserUnBlockAction = (data) => {
  return postRequest("userUnblock", data).then((res) => {
    return res.data;
  });
};


export const getuserDetailsAction = (data) => {
  return postRequest("getuserDetails", data).then((res) => {
    return res.data;
  });
};



export const getStacHistoryAction = (data) => {
  return postRequest("getStacHistory", data).then((res) => {
    return res.data;
  });
};

export const getPurchaseHistoryAction = (data) => {
  return postRequest("getPrchaseHistory", data).then((res) => {
    return res.data;
  });
};

export const getReferalEarningAction = (data) => {
  return postRequest("getReferalEarning", data).then((res) => {
    return res.data;
  });
};


export const addplayerbyagentAction = (data) => {
  return postRequest("addplayerbyagent", data).then((res) => {
    return res.data;
  });
};

export const withdrawchipsrequestAction = (data) => {
  return postRequest("withdrawchipsrequest", data).then((res) => {
    return res.data;
  });
};

export const totalpendingchipsAction = (data) => {
  return postRequest("totalpendingchips", data).then((res) => {
    return res.data;
  });
};

export const totalpendingchipsforextendAction = (data) => {
  return postRequest("totalpendingchipsforextend", data).then((res) => {
    return res.data;
  });
};

export const requestchipsAction = (data) => {
  return postRequest("requestchips", data).then((res) => {
    return res.data;
  });
};

export const totalamountofagentAction = (data) => {
  return postRequest("totalamountofagent", data).then((res) => {
    return res.data;
  });
};

export const updatewithdrawrequestagentAction = (data) => {
  return postRequest("updatewithdrawrequestagent", data).then((res) => {
    return res.data;
  });
};

export const rejectwithdrawrequestagentAction = (data) => {
  return postRequest("rejectwithdrawrequestagent", data).then((res) => {
    return res.data;
  });
};

export const getChipsPriceAction = (data) => {
  return postRequest("getChipsPrice", data).then((res) => {
    return res.data;
  });
};

export const approvepaymentrequestAction = (data) => {
  return postRequest("approvepaymentrequest", data).then((res) => {
    return res.data;
  });
};

export const rejectpaymentrequestAction = (data) => {
  return postRequest("rejectpaymentrequest", data).then((res) => {
    return res.data;
  });
};

export const getagentlistAction = (data) => {
  return postRequest("getagentlist", data).then((res) => {
    return res.data;
  });
};

export const sendchipstoagentAction = (data) => {
  return postRequest("sendchipstoagent", data).then((res) => {
    return res.data;
  });
};

export const sendchipstoplayerAction = (data) => {
  return postRequest("sendchipstoplayer", data).then((res) => {
    return res.data;
  });
};

export const totalchipsofagentAction = (data) => {
  return postRequest("totalchipsofagent", data).then((res) => {
    return res.data;
  });
};

export const adduserbyadminAction = (data) => {
  return postRequest("adduserbyadmin", data).then((res) => {
    return res.data;
  });
};

export const addcoinbyadminAction = (data) => {
  return postRequest("addcoinbyadmin", data).then((res) => {
    return res.data;
  });
};


export const updatewithdrawamountAction = (data) => {
  return postRequest("updatewithdrawamount", data).then((res) => {
    return res.data;
  });
};


export const updatelockingdurationAction = (data) => {
  return postRequest("updatelockingduration", data).then((res) => {
    return res.data;
  });
};