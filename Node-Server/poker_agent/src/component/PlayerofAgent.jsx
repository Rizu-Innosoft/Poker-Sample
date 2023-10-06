import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import config from "../coreFIles/config";
import ReactDatatable from "@ashvin27/react-datatable";
import {
  getplayerofagentlistAction,
  //   updateupdatebuyrequeststatusAction,
  //   rejectuserbankdetailsAction,
} from "../Action/action";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const PlayerofAgent = () => {
  const [getbuyrequestlist, setgetbuyrequestList] = useState({});
  const [userDetails, setuserDetails] = useState({});
  const loginData = (!Cookies.get('loginSuccessPokerAgent')) ? [] : JSON.parse(Cookies.get('loginSuccessPokerAgent'));

  useEffect(() => {
    getpartner();
  }, []);

  const getpartner = async () => {
    let res = await getplayerofagentlistAction({id:loginData.id});
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

    // {
    //   key: "first_name",
    //   text: "Name",
    //   cell: (item) => {
    //     return `${item.first_name}`;
    //   }
    // },
    {
        key: "first_name",
        text: "Player Name",
        cell: (item) => {
          return `${item.first_name==null ? "":item.first_name}`;
        },
      },
    {
      key: "email",
      text: "Email/Mobile",
      cell: (item) => {
        return `${item.email == null ? item.mobile_no : item.email}`;
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
    //   key: "fee",
    //   text: "Fee",
    //   cell: (item) => {
    //     return `${item.fee}`;
    //   },
    // },
  
 
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
    // {
    //   key: "action",
    //   text: "Action",
    //   cell: (item) => {
    //     return (
    //       <>
    //         {item.status == 0 ? (
    //           <>
    //             <button
    //               onClick={() => updatebuyRequest(item)}
    //               type="button"
    //               className="btn btn-sm btn-primary mb-2"
    //             >
    //               Approve
    //             </button>
    //             &nbsp;
    //             <br />
    //             <button
    //               onClick={() => rejectbuyRequest(item)}
    //               type="button"
    //               className="btn btn-sm btn-primary"
    //             >
    //               Reject
    //             </button>
    //           </>
    //         ) : item.status == 1 ? (
    //           <>
    //             <span style={{ color: "green" }}>Approved</span>
    //           </>
    //         ) : item.status == 2 ? (
    //           <>
    //             <span style={{ color: "red" }}>Reject</span>
    //           </>
    //         ) : (
    //           ""
    //         )}
    //       </>
    //     );
    //   },
    // },
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
                  <h3 className="page-title mb-5 pb-2">Players list</h3>
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
export default PlayerofAgent;
