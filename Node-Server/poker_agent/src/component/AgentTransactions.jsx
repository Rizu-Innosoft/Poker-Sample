import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import config from "../coreFIles/config";
import ReactDatatable from "@ashvin27/react-datatable";
import {
  getagenttransactionAction,
  totalchipsofagentAction,
  totalamountofagentAction,
  //   updateupdatebuyrequeststatusAction,
  //   rejectuserbankdetailsAction,
  approvepaymentrequestAction,
  rejectpaymentrequestAction,
} from "../Action/action";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const AgentTransactions = () => {
  const [getbuyrequestlist, setgetbuyrequestList] = useState({type : ""});
  const [userDetails, setuserDetails] = useState({});
  const [totalchips, settotalchips] = useState();
  const [totalamount, settotalamount] = useState();
  const [form, setForm] = useState({type : ""});

  const loginData = !Cookies.get("loginSuccessPokerAgent")
    ? []
    : JSON.parse(Cookies.get("loginSuccessPokerAgent"));

  useEffect(() => {
    getpartner();
    getotalchips();
    getotalamount();
  }, []);

  const getpartner = async () => {
    let res = await getagenttransactionAction({ id: loginData.id });
    if (res) {
      setgetbuyrequestList(res.data);
      console.log("123", res.data);
    }
  };

  const getotalchips = async () => {
    let res = await totalchipsofagentAction({ id: loginData.id });
    if (res) {
      settotalchips(res.data);
      console.log("123", res.data);
    }
  };

  const getotalamount = async () => {
    let res = await totalamountofagentAction({ id: loginData.id });
    if (res) {
      settotalamount(res.data);
      console.log("123", res.data);
    }
  };

  const ChipsWithdrawRequest = async () => {
    form.type = 1;
    console.log(form);
    let res = await getagenttransactionAction({ id: loginData.id , form : form.type });
    if (res.success) {
      setgetbuyrequestList(res.data)
    }
}

const alltransaction = async (e) => {
  // form.type = 1;
  const { name, value } = e.target;
form.type = value
  console.log(form.type);
  let res = await getagenttransactionAction({ id: loginData.id , form : form.type });
  if (res.success) {
    setgetbuyrequestList(res.data)
  }
}

const ChipsSoldToAgent = async () => {
  form.type = 2;
  console.log(form);
  let res = await getagenttransactionAction({ id: loginData.id , form : form.type });
  if (res.success) {
    setgetbuyrequestList(res.data)
  }
}

const ChipsSoldToPlayer = async () => {
  form.type = 3;
  console.log(form);
  let res = await getagenttransactionAction({ id: loginData.id , form : form.type });
  if (res.success) {
    setgetbuyrequestList(res.data)
  }
}

const ChipsPurchaseRequest = async () => {
  form.type = 4;
  console.log(form);
  let res = await getagenttransactionAction({ id: loginData.id , form : form.type });
  if (res.success) {
    setgetbuyrequestList(res.data)
  }
}


  

  const inputHandler = (e) => {
    const { name, value } = e.target;
    getbuyrequestlist((old) => {
      return { ...old, [name]: value };
    });
  };


  function editPartner(item) {
    setuserDetails(item);
  }

  const updatepaymentRequest = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Approve this Transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("updatebuyRequest", id);
        let res = await approvepaymentrequestAction(id);
        console.log("123456", id);
        if (res.success) {
          await Swal.fire("Approved!", res.msg, "success");
          window.location.href = `${config.baseUrl}agenttransactions`;
          getbuyrequestlist();
          setTimeout(() => {}, 1000);
        } else {
          Swal.fire("Failed!", res.msg, "error");
        }
      }
    });
  };

  const rejectpaymentRequest = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Reject this Transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("updatebuyRequest", id);
        let res = await rejectpaymentrequestAction(id);
        // getbuyrequestlist();
        if (res.success) {
          await Swal.fire("Rejected!", res.msg, "success");
          window.location.href = `${config.baseUrl}agenttransactions`;
          window.location.reload();
        } else {
          Swal.fire("Failed!", res.msg, "error");
        }
      }
    });
  };

  // const updatebuyRequest = async (id) => {

  //         let res = await updateupdatebuyrequeststatusAction(id);
  //         if (res.success) {
  //             getpartner();
  //              Swal.fire(
  //                 'Updated',
  //                 res.msg,
  //                 'success'
  //               )
  //         } else {
  //             Swal.fire(
  //                 'Failed!',
  //                 res.msg,
  //                 'error'
  //             )
  //         }
  //     }

  //   const updatebuyRequest = async (id) => {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You want to Approve this Transaction!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, Approve it!",
  //     }).then(async (result) => {
  //       if (result.isConfirmed) {
  //         let res = await updateupdatebuyrequeststatusAction(id);
  //         console.log("123456", id);
  //         if (res.success) {
  //           await Swal.fire("Approved!", res.msg, "success");
  //           window.location.href = `${config.baseUrl}BuyTransactions`;

  //           getbuyrequestlist()
  //           setTimeout(() => {}, 1000);
  //         } else {
  //           Swal.fire("Failed!", res.msg, "error");
  //         }
  //       }
  //     });
  //   };

  //   const rejectbuyRequest = async (id) => {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You want to Reject this Transaction!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, Reject it!",
  //     }).then(async (result) => {
  //       if (result.isConfirmed) {
  //         let res = await rejectuserbankdetailsAction(id);
  //         getbuyrequestlist();
  //         if (res.success) {
  //           Swal.fire("Rejected!", res.msg, "success");
  //           setTimeout(() => {
  //             window.location.href = `${config.baseUrl}buytransactions`;
  //           }, 1000);
  //         } else {
  //           Swal.fire("Failed!", res.msg, "error");
  //         }
  //       }
  //     });
  //   };

  const columns = [
    {
      key: "#",
      text: "Sno.",
      cell: (row, index) => index + 1,
    },

    {
      key: "useremail",
      text: "Email Address",
      cell: (item) => {
        return `${item.useremail == null ? "Admin" : item.useremail}`;
      },
    },
    {
      key: "email",
      text: "Email/Mobile",
      cell: (item) => {
        return `${item.email == null ? item.mobile_no : item.email}`;
      },
    },

    {
      key: "name",
      className : "light",
      text: "Transaction Type",
      cell: (item) => {
        return `${item.name}`;
      },
    },

    // {
    //   key: "amount",
    //   text: "Amount",
    //   cell: (item) => {
    //     return `${item.amount}`;
    //   },
    // },
    // {
    //   key: "new_chips",
    //   text: "Chips",
    //   cell: (item) => {
    //     return `${item.new_chips==0?"":item.new_chips}`;
    //   },
    // },
    {
      key: "new_diamond_chips",
      text: "Diamond Chips",
      cell: (item) => {
        return `${item.new_diamond_chips==0?"":item.new_diamond_chips}`;
      },
    },
    {
      key: "amount",
      text: "Amount",
      cell: (item) => {
        return `${parseInt(item.amount)}`;
      },
    },
    // {
    //   key: "fee",
    //   text: "Fee",
    //   cell: (item) => {
    //     return `${item.fee}`;
    //   },
    // },
    // {
    //   key: "user_transaction_id",
    //   text: "User TransactionId",
    //   cell: (item) => {
    //     return `${item.user_transaction_id}`;
    //   },
    // },
    {
      key: "datetime",
      text: "Date ",
      cell: (item) => {
        return `${item.datetime.substring(0, 10)}`;
      },
    },

    {
      key: "chips_status",
      text: "Chips Status",
      cell: (item) => {
        return (
          <>
            {item.status == 0 || item.status == 3
              ? "Pending"
              : item.status == 1
              ? "Approved"
              : item.status == 2
              ? "Rejected"
              : "Unknown status"}
          </>
        );
      },
    },
    {
      key: "action",
      text: "Payment Status",
      cell: (item) => {
        return (
          <>
            {(item.ttid == 4 || item.ttid == 5 )&& item.payment_status == 0 ? (
              <>
                <button
                  onClick={() => updatepaymentRequest(item)}
                  type="button"
                  className="btn btn-sm btn-primary mb-2"
                >
                  Receive Payment ?
                </button>
                &nbsp;
                <br />
                {/* <button
                  onClick={() => rejectpaymentRequest(item)}
                  type="button"
                  className="btn btn-sm btn-primary"
                >
                  Reject Payment
                </button> */}
              </>
            ) :( item.ttid == 4 ||
              item.ttid == 5) && item.payment_status == 1 ? (
              <>
                <span style={{ color: "green" }}>Received</span>
              </>
            ) :( item.ttid == 4 ||
              item.ttid == 5) && item.payment_status == 2 ? (
              <>
                <span style={{ color: "red" }}>Payment Rejected</span>
              </>
            ) :( item.ttid == 2 ||
              item.ttid == 6) && item.payment_status == 0 ? (
              <>
                <span style={{ color: "red" }}>Payment Pending</span>
              </>
            ) :( item.ttid == 2 ||
              item.ttid == 6) && item.payment_status == 1 ? (
              <>
                <span style={{ color: "red" }}>Received</span>
              </>
            ):( item.ttid == 2 ||
              item.ttid == 6) && item.payment_status == 2 ? (
              <>
                <span style={{ color: "red" }}>Payment Rejected</span>
              </>
            )   :(
              ""
            )}
          </>
        );
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
        <Toaster />

        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <div className="container-full">
            {/* Main content */}
            <div className="content-header">
              <div className="d-flex align-items-center">
                <div className="me-auto">
                  <h3 className="page-title mb-5 pb-2">Transactions details</h3>
                  <br />
                  {/* <h3 className="page-title mb-5 pb-2"> Total Chips - {totalchips}</h3> */}
                </div>
              </div>
            </div>
            {/* Content Header (Page header) */}

            {/* Main content */}
            <section className="content">
              <div className="row">
                <div className="col-lg-12 col-12">
                  <div className="box">
                    <div className="box-header with-border">
                      <h4 className="box-title">Total Chips - {totalchips}</h4>
                      <select className="box-title"  onChange={e=>alltransaction(e)} >Total Chips 
                      <option value="" >All Transactions  Type	</option>
                      <option value="1" >Chips Withdraw Request	</option>
                      <option value="2" >Chips Sold to agent</option>
                      <option value="3" >Chips Sold to player</option>
                      <option value="4" > Chips purchase request </option>
                      </select>
                      <h4 className="box-title">
                        Total withdraw amount - {(totalamount)}
                      </h4>
                      {/* <button onClick={ChipsPurchaseRequest}> Chips purchase request	 </button> 
                      <button onClick={ChipsSoldToAgent}> Chips Sold to agent	 </button> 
                      <button onClick={ChipsSoldToPlayer}> Chips Sold to player	 </button> 
                      <button onClick={ChipsWithdrawRequest}> Chips Withdraw Request	 </button>  */}

                    </div>
                    <div className="box-body">
                      <ReactDatatable
                        config={configForTable}
                        records={getbuyrequestlist}
                        columns={columns}
                        // noDataPlaceholder={() => <div>No data found</div>}
                        noDataPlaceholder="No data found."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* /.content */}
            {/* /.content */}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};
export default AgentTransactions;
