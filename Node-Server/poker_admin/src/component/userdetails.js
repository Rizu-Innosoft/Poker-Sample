import React, { useEffect, useState } from "react";
import config from "../coreFIles/config";
import Header from "../directives/header";
import Sidebar from "../directives/sidebar";
import ReactDatatable from "@ashvin27/react-datatable";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  getuserDetailsAction,
  UserBlockAction,
  UserUnBlockAction,
} from "../Action/action";
import { useParams } from "react-router-dom";

const Userdetails = () => {
  const [totalpurchaseMNT, setTotalPurchaseMNT] = useState(0);
  const [totalpurchaseUSDT, setTotalPurchaseUSDT] = useState(0);
  const [totalstakingearningMNT, setTotalStakingEarningMNT] = useState(0);
  const [totalstakingearningUSDT, setTotalStakingEarningUSDT] = useState(0);
  const [totalwithdrawhistoryMNT, setTotalWithdrawHistoryMNT] = useState(0);
  const [totalwithdrawhistoryUSDT, setTotalWithdrawHistoryUSDT] = useState(0);
  const [getuserdetaillist, setusersDetailList] = useState({});
  const [form, setForm] = useState({
    id: "",
    profile_pic: "",
    previewImage: "",
    first_name: "",
    email: "",
    balance: "",
    balance_usd: "",
    last_name: "",
    bnb_address: "",
    reward_wallet: "",
    refer_by: "",
    stacking_balance: "",
    stacking_balance_usd: "",
    vesting_balance: "",
    vesing_balance_usd: "",
    totalRefEarning: "",
    totalRefEarningUSD: "",
    totalWithdraw: "",
    totalWithdrawUSD: "",
    stage: "",
    blocked: "",
    block: "",
    created_at: "",
    apy: "",
    agreement_pdf: "",
    locking_duration: ""
  });
  const [getpurchasehistoryList, setPurchaseHistoryList] = useState({});
  const [getstackingearningList, setStackingEarningList] = useState({});
  const [getWithdrawHistoryList, setWithdrawHistoryList] = useState({});

  useEffect(() => {
    getuserDetails();
  }, []);


  const getuserDetails = async () => {
    const id = window.location.href.split("/").pop();
    let res = await getuserDetailsAction({ id: id });
    if (res.success) {
      setusersDetailList([res.data]);

      let data = res.data;
      setForm((old) => {
        return {
          ...old,
          id: id,
          previewImage: config.imageUrl + data?.profile_pic,
          first_name: data?.first_name,
          email: data?.email,
          balance: data?.balance,
          balance_usd: data?.balance_usd,
          last_name: data?.last_name,
          bnb_address: data?.bnb_address,
          reward_wallet: data?.reward_wallet,
          refer_by: data?.refer_by,
          stacking_balance: data?.stacking_balance,
          stacking_balance_usd: data?.stacking_balance_usd,
          vesting_balance: data?.vesting_balance,
          vesing_balance_usd: data?.vesing_balance_usd,
          totalRefEarning: data?.totalRefEarning,
          totalRefEarningUSD: data?.totalRefEarningUSD,
          totalWithdraw: data?.totalWithdraw,
          totalWithdrawUSD: data?.totalWithdrawUSD,
          stage: data?.stage,
          blocked: data.blocked,
          block: data?.block,
          created_at: data?.created_at,
          agreement_pdf: data?.agreement_pdf,
          locking_duration: data?.locking_duration
        };
      });
    }
  };


  const UserBlock = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Block this User!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Block it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await await UserBlockAction({ id: id });
        if (res.success) {
          getuserDetails();
          Swal.fire("Rejected!", res.msg, "success");
        } else {
          Swal.fire("Failed!", res.msg, "error");
        }
      }
    });
  };

  const UserUnBlock = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Unblock this User!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Unblock it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await await UserUnBlockAction({ id: id });
        if (res.success) {
          getuserDetails();
          Swal.fire("Rejected!", res.msg, "success");
        } else {
          Swal.fire("Failed!", res.msg, "error");
        }
      }
    });
  };
  const copieBtn = async () => {
    toast.success(`Coppied!!`);
  };


  const columns2 = [
    {
      key: "Sno.",
      text: "Sno.",
      cell: (row, index) => index + 1,
    },

    {
      key: "token",
      text: "Token(token)",
      cell: (item) => {
        return (
          <>
            {item.token} token ~ ${parseFloat(item.usd_amount).toFixed(2)}
          </>
        );
      },
    },

    {
      key: "updated_at",
      text: "Update",
      cell: (item) => {
        return `${moment(item.created_at).format("DD/MM/YYYY")}`;
      },
    },
  ];


  const columns3 = [
    {
      key: "Sno.",
      text: "Sno.",
      cell: (row, index) => index + 1,
    },

    {
      key: "amount",
      text: "Amount",
      cell: (item) => {
        return `${parseFloat(item.amount).toFixed(2)} token ~ $${parseFloat(
          item.usd_amount
        ).toFixed(2)}`;
      },
    },

    {
      key: "history",
      text: "History",
      cell: (item) => {
        return <>{item.history}</>;
      },
    },

    {
      key: "created_at",
      text: "Date",
      cell: (item) => {
        return `${moment(item.created_at).format("DD/MM/YYYY")}`;
      },
    },
  ];



  const columns5 = [
    {
      key: "Sno.",
      text: "Sno.",
      cell: (row, index) => index + 1,
    },
    {
      key: "amount",
      text: "Amount",
      cell: (item) => {
        return `${parseFloat(item.amount).toFixed(2)} token ~ $${parseFloat(
          item.amountUSD
        ).toFixed(2)}`;
      },
    },
    {
      key: "status",
      text: "Status",
      cell: (item) => {
        return <>{item.status}</>;
      },
    },
  ];

  const configForTable = {
    page_size: 10,
    length_menu: [10, 20, 50],
    show_filter: true,
    show_pagination: true,
    pagination: "advance",
    button: {
      excel: true,
      print: false,
    },
  };
  return (
    <>
      <div class="wrapper">
        <Header />
        <Sidebar />
        <Toaster />
        <div className="content-wrapper">
          <div className="container-full">
            <section>
              <div className="container pt-5">
                <div className="row">
                  <div className="col-md-5">
                    <div className="profile_section">
                      <div className="user_profile">
                        <center class="loginLogo">
                          <img src={`${config.baseUrl}/images/avatar-1.png`} />
                        </center>
                      </div>
                    </div>
                    <div className="row">

                      <div className="col-sm-6 mx-auto">
                        <div className="dummys_btn">
                          {form.blocked === 0 ? (
                            <button
                              type="button"
                              onClick={() => UserBlock(form.id)}
                              className="btn btn-sm btn-primary"
                            >
                              Block{" "}
                            </button>
                          ) : form.blocked === 1 ? (
                            <button
                              type="button"
                              onClick={() => UserUnBlock(form.id)}
                              className="btn btn-sm btn-primary"
                            >
                              Unblock{" "}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-7">
                    <div className="user_details">
                      <h3>User Details</h3>
                      <table style={{ width: "100%" }} id="usertableid">
                        <tbody>
                          <tr>
                            <th colspan="2">Full Name:</th>
                            <td colspan="2">
                              {form.first_name} {form.last_name}
                            </td>
                          </tr>

                          <tr>
                            <th colspan="2">Email</th>
                            <td colspan="2">
                              {form.email}
                              &nbsp;
                              <CopyToClipboard text={form.email}>
                                <sapn
                                  title="Click to Copy"
                                  className="mr-copylink"
                                  id="token-buy-button"
                                  onClick={copieBtn}
                                  style={{
                                    cursor: "pointer",
                                    color: "rgb(157 81 255)",
                                  }}
                                >
                                  <i class="fa fa-copy "></i>
                                </sapn>
                              </CopyToClipboard>
                            </td>
                          </tr>


                          <tr>
                            <th colSpan="2">Status</th>
                            <td
                              style={{ color: form.blocked ? "red" : "green" }}
                            >
                              {form.blocked ? "Blocked" : "Active"}
                            </td>

                          </tr>
                          <tr>
                            <th colSpan="2">
                              Registration Date
                            </th>
                            <td
                              style={{ color: form.blocked ? "red" : "green" }}
                            >
                              {moment(form.created_at).format("DD/MM/YYYY")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* <div className="col-md-12 pt-4 mt-3">
                    <div className="box">



                      <div className="box-body">
                        <ul className="nav nav-tabs customtab2" role="tablist">
                          <li className="nav-item">
                            {" "}
                            <a
                              className="nav-link active"
                              data-bs-toggle="tab"
                              href="#profile7"
                              role="tab"
                              aria-selected="false"
                            >
                              <span className="hidden-sm-up">
                                <i className="ion-person" />
                              </span>{" "}
                              <span className="hidden-xs-down">
                                Token History
                              </span>
                            </a>{" "}
                          </li>
                          <li className="nav-item">
                            {" "}
                            <a
                              className="nav-link"
                              data-bs-toggle="tab"
                              href="#last8"
                              role="tab"
                              aria-selected="true"
                            >
                              <span className="hidden-sm-up">
                                <i className="ion-email" />
                              </span>{" "}
                              <span className="hidden-xs-down">
                                Withdraw History
                              </span>
                            </a>{" "}
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div
                            className="tab-pane active"
                            id="profile7"
                            role="tabpanel"
                          >
                            <div className="box">
                              <div className="box-header with-border">
                                <h4 className="box-title">Token History</h4>
                                <span className="pull-right">
                                  <h5>
                                    Total Purchase : {totalpurchaseMNT} token ~ $
                                    {totalpurchaseUSDT}
                                  </h5>
                                </span>
                              </div>

                              <div className="box-body">
                                <div className="showbox">
                                  <ReactDatatable
                                    config={configForTable}
                                    records={getpurchasehistoryList}
                                    columns={columns2}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane"
                            id="messages7"
                            role="tabpanel"
                          >
                            <div className="box">
                              <div className="box-header with-border">
                                <h4 className="box-title">Investment Earning</h4>
                                <span className="pull-right">
                                  <h5>
                                    Investment Earning : {totalstakingearningMNT}{" "}
                                    token ~ ${totalstakingearningUSDT}
                                  </h5>
                                </span>
                              </div>

                              <div className="box-body">
                                <ReactDatatable
                                  config={configForTable}
                                  records={getstackingearningList}
                                  columns={columns3}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="tab-pane" id="last8" role="tabpanel">
                            <div className="box">
                              <div className="box-header with-border">
                                <h4 className="box-title">Withdraw History</h4>
                                <span className="pull-right">
                                  <h5>
                                    Total Withdraw : {totalwithdrawhistoryMNT}{" "}
                                    token ~ ${totalwithdrawhistoryUSDT}
                                  </h5>
                                </span>
                              </div>

                              <div className="box-body">
                                <ReactDatatable
                                  config={configForTable}
                                  records={getWithdrawHistoryList}
                                  columns={columns5}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
export default Userdetails;
