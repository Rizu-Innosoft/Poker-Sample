import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import config from "../coreFIles/config";
import ReactDatatable from "@ashvin27/react-datatable";
import {
  getalltransactionAction,
    updatewithdrawrequestagentAction,
    rejectwithdrawrequestagentAction,
    approvepaymentrequestAction,
    rejectpaymentrequestAction
} from "../Action/action";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

const Transactions = () => {
  const [getbuyrequestlist, setgetbuyrequestList] = useState({});
  const [userDetails, setuserDetails] = useState({});
  const [form, setForm] = useState({type : ""});

  useEffect(() => {
    getpartner();
  }, []);

  const getpartner = async () => {
    let res = await getalltransactionAction();
    if (res) {
      setgetbuyrequestList(res.data);
      console.log("123", res.data);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setuserDetails((old) => {
      return { ...old, [name]: value };
    });
  };

  function editPartner(item) {
    setuserDetails(item);
  }

  const alltransaction = async (e) => {
    // form.type = 1;
    const { name, value } = e.target;
  form.type = value
    console.log(form.type);
    let res = await getalltransactionAction({  form : form.type });
    if (res.success) {
      setgetbuyrequestList(res.data)
    }
  }

  


    const updatebuyRequest = async (id) => {
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
          console.log("updatebuyRequest",id);
          
          let res = await updatewithdrawrequestagentAction(id);
          console.log("123456", id);
          if (res.success) {
            await Swal.fire("Approved!", res.msg, "success");
            window.location.href = `${config.baseUrl}transactions`;
            getbuyrequestlist()
            setTimeout(() => {}, 1000);
          } else {
            Swal.fire("Failed!", res.msg, "error");
          }
        }
      });
    };

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
          console.log("updatebuyRequest",id);
          
          let res = await approvepaymentrequestAction(id);
          console.log("123456", id);
          if (res.success) {
            await Swal.fire("Approved!", res.msg, "success");
            window.location.href = `${config.baseUrl}transactions`;
            getbuyrequestlist()
            setTimeout(() => {}, 1000);
          } else {
            Swal.fire("Failed!", res.msg, "error");
          }
        }
      });
    };

    const rejectbuyRequest = async (id) => {
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
          console.log("updatebuyRequest",id);
          
          let res = await rejectwithdrawrequestagentAction(id);
          // getbuyrequestlist();
          if (res.success) {
            await Swal.fire("Rejected!", res.msg, "success");
            window.location.href = `${config.baseUrl}transactions`;
            window.location.reload();


            // setTimeout(() => {
            //   window.location.href = `${config.baseUrl}transactions`;
            // }, 1000);
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
          console.log("updatebuyRequest",id);
          
          let res = await rejectpaymentrequestAction(id);
          // getbuyrequestlist();
          if (res.success) {
            await Swal.fire("Rejected!", res.msg, "success");
            window.location.href = `${config.baseUrl}transactions`;
            window.location.reload();


            // setTimeout(() => {
            //   window.location.href = `${config.baseUrl}transactions`;
            // }, 1000);
          } else {
            Swal.fire("Failed!", res.msg, "error");
          }
        }
      });
    };

  const columns = [
    {
      key: "#",
      text: "Sno.",
      cell: (row, index) => index + 1,
    },

    {
      key: "first_name",
      text: "Name",
      cell: (item) => {
        return `${item.first_name}`;
      }
    },
    {
      key: "email",
      text: "Email/Mobile",
      cell: (item) => {
        return `${item.email == null ? item.mobile_no : item.email}`;
      },
    },

    // {
    //   key: "to_address",
    //   text: "To Email",
    //   cell: (item) => {
    //     return `${item.to_address}`;
    //   }
    // },

    {
      key: "name",
      text: "Transaction Type",
      cell: (item) => {
        return `${item.name}`;
      },
    },

    {
      key: "amount",
      text: "Amount",
      cell: (item) => {
        return `${parseFloat(item.amount).toFixed(2)}`;
      },
    },
    {
      key: "new_chips",
      text: "Chips",
      cell: (item) => {
        return `${item.new_chips == 0 ?"":item.new_chips}`;
      },
    },
    {
      key: "new_diamond_chips",
      text: "Diamond",
      cell: (item) => {
        return `${item.new_diamond_chips == 0 ?"":item.new_diamond_chips}`;
      },
    },
    {
      key: "user_transaction_id",
      text: "User TransactionId",
      cell: (item) => {
        return `${item.user_transaction_id==""?"VADE0B248932":item.user_transaction_id}`;
      },
    },
    {
      key: "datetime",
      text: "Date ",
      cell: (item) => {
        return `${item.datetime.substring(0, 10)}`;
      },
    },
    // {
    //   key: "image",
    //   text: "Image",
    //   cell: (item) => {
    //     return (
    //       <a target="_blank" href={config.imageUrl + item.image}>
    //         <img
    //           src={`${config.imageUrl + item.image}`}
    //           width="50px"
    //           height="50px"
    //         />
    //       </a>
    //     );
    //   },
    // },
    {
      key: "action",
      text: "Chips Status",
      cell: (item) => {
        return (
          <>
            {item.status == 0 || item.status == 3 ? (
              <>
                <button
                  onClick={() => updatebuyRequest(item)}
                  type="button"
                  className="btn btn-sm btn-primary mb-2"
                >
                  Approve
                </button>
                &nbsp;
                <br />
                <button
                  onClick={() => rejectbuyRequest(item)}
                  type="button"
                  className="btn btn-sm btn-primary"
                >
                  Reject
                </button>
              </>
            ) : item.status == 1 ? (
              <>
                <span style={{ color: "green" }}>Approved</span>
              </>
            ) : item.status == 2 ? (
              <>
                <span style={{ color: "red" }}>Rejected</span>
              </>
            ) : (
              ""
            )}
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
            {(item.ttid == 2 || item.ttid == 6 )&& item.payment_status == 0 ? (
              <>
                <button
                  onClick={() => updatepaymentRequest(item)}
                  type="button"
                  className="btn btn-sm btn-primary mb-2"
                >
                  Recive Payment ?
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
            ) :( item.ttid == 2 ||
              item.ttid == 6) && item.payment_status == 1 ? (
              <>
                <span style={{ color: "green" }}>Received</span>
              </>
            ) :( item.ttid == 2 ||
              item.ttid == 6) && item.payment_status == 2 ? (
              <>
                <span style={{ color: "red" }}>Payment Rejected</span>
              </>
            ) :( item.ttid == 4 ||
              item.ttid == 5) && item.payment_status == 0 ? (
              <>
                <span style={{ color: "red" }}>Payment Pending</span>
              </>
            ) :( item.ttid == 4 ||
              item.ttid == 5) && item.payment_status == 1 ? (
              <>
                <span style={{ color: "red" }}>Received</span>
              </>
            ):( item.ttid == 4 ||
              item.ttid == 5) && item.payment_status == 2 ? (
              <>
                <span style={{ color: "red" }}>Payment Rejected</span>
              </>
            ) : ( item.ttid == 3 ) ? (
              <>
                <span style={{ color: "red" }}>Chips Of Player</span>
              </>
            )    :(
              ""
            )}
          </>
        );
      },
    }
  ];

  const configForTable = {
    page_size: 10,
    length_menu: [10, 20, 50],
    // show_filter: true,
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
                      {/* <h4 className="box-title">Transactions Details</h4> */}
                      <select className="box-title" 
                       onChange={e=>alltransaction(e)} 
                      >Total Chips 
                      <option value="" >All Transactions  Type	</option>
                      <option value="1" >Chips Withdraw Request	</option>
                      <option value="2" >Chips Sold to agent</option>
                      <option value="3" >Chips Sold to player</option>
                      <option value="4" > Chips purchase request </option>
                      <option value="5" > Total Chips of player  </option>
                      </select>
                    </div>
                    <div className="box-body">
                      <ReactDatatable
                        config={configForTable}
                        records={getbuyrequestlist}
                        columns={columns}
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
export default Transactions;
