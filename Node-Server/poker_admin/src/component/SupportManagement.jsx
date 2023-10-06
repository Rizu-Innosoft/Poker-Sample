import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import config from "../coreFIles/config";
import ReactDatatable from "@ashvin27/react-datatable";
import {
  getallticketAction,
  ticketapproveAction,
  ticketrejectAction, 
} from "../Action/action";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

const SupportManagement = () => {
  const [allticketlist, setallticketList] = useState({});
  const [userDetails, setuserDetails] = useState({});

  useEffect(() => {
    getpartner();
  }, []);

  const getpartner = async () => {
    let res = await getallticketAction();
    if (res) {
      setallticketList(res.data);
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

  const updatebuyRequest = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Approve this Ticket!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await ticketapproveAction(id);
        console.log("123456", id);
        if (res.success) {
          await Swal.fire("Approved!", res.msg, "success");
          window.location.href = `${config.baseUrl}supportmanagement`;
          allticketlist()
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
      text: "You want to Reject this Ticket!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await ticketrejectAction(id);
        allticketlist();
        if (res.success) {
          Swal.fire("Rejected!", res.msg, "success");
          setTimeout(() => {
            window.location.href = `${config.baseUrl}supportmanagement`;
          }, 1000);
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
      },
    },
    {
      key: "email",
      text: "Email or Mobile",
      cell: (item) => {
        return `${item.email==null?item.mobile_no:item.email}`;
      },
    },

    {
      key: "ticket_number",
      text: "ticket_number",
      cell: (item) => {
        return `${item.ticket_number}`;
      },
    },
    {
      key: "title",
      text: "title",
      cell: (item) => {
        return `${item.title}`;
      },
    },
    {
      key: "reason",
      text: "reason",
      cell: (item) => {
        return `${item.reason}`;
      },
    },
    {
      key: "status",
      text: "Status",
      cell: (item) => {
        return `${item.status == 0 ? "Active" : "Deactive"}`;
      },
    },
    {
      key: "datetime",
      text: "Date ",
      cell: (item) => {
        return `${item.datetime.substring(0,10)}`;
      },
    },

    {
      key: "action",
      text: "Action",
      cell: (item) => {
        return (
          <>
           
            {item.status == 0 ? (
              <>
                <button
                  onClick={() => updatebuyRequest(item)}
                  type="button"
                  className="btn  btn-primary "
                >
                  Approve
                </button>
                &emsp;
                <button
                  onClick={() => rejectbuyRequest(item)}
                  type="button"
                  className="btn  btn-primary"
                >
                  Reject
                </button>
              &emsp;
             
                {/* <a
                  href={`${config.baseUrl}chat/${item.ticket_number}/${item.user_id}`}
                                 className=""
                >
                  <button type="button" className="btn  btn-primary">
                    Chat
                  </button>
                </a> */}
              </>
            ) : item.status == 1 ? (
              <>
                <span style={{ color: "green" }}>Approved</span>
              </>
            ) : item.status == 2 ? (
              <>
                <span style={{ color: "red" }}>Reject</span>
              </>
            ) : (
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
                  <h3 className="page-title mb-5 pb-2">Support Management</h3>
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
                      <h4 className="box-title">Support Management</h4>
                    </div>
                    <div className="box-body">
                      <ReactDatatable
                        config={configForTable}
                        records={allticketlist}
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
export default SupportManagement;
