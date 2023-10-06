import React, { useEffect, useState } from "react";
// import config from '../coreFIles/config'
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import config from "../coreFIles/config";
import ReactDatatable from "@ashvin27/react-datatable";
import {
  getTournamentUsersAction,
  gettournamentdetailsbyidAction,
  addtournamentAction,
  updatewinneramountAction,
} from "../Action/action";
import Swal from "sweetalert2";
import moment from "moment";
import { toast, Toaster } from "react-hot-toast";
import CopyToClipboard from "react-copy-to-clipboard";

const TournamentUsers = () => {
  const [gettournamentuserslist, settournamentusersList] = useState([]);
  const [gettournamentlist, settournamentList] = useState({});
  const [tournamentmsg, settournamentmsg] = useState();

  //   const [form, setForm] = useState({});
  const [tournamentusers, settournamentusers] = useState({});
  const [addtournamentusers, setaddtournamentusers] = useState({});

  useEffect(() => {
    gettournamentusers();
    // insertTournamentusers();
    console.log("gettournamentlist", gettournamentlist);
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    settournamentusers((old) => {
      return { ...old, [name]: value };
    });
  };

  const inputHandler1 = (e) => {
    const { name, value } = e.target;
    setaddtournamentusers((old) => {
      return { ...old, [name]: value };
    });
  };

  const copieBtn = async () => {
    toast.success(`Coppied!!`);
  };

  const gettournamentusers = async () => {
    const id = window.location.href.split("/").pop();
    let res = await getTournamentUsersAction({ id: id });
    let res1 = await gettournamentdetailsbyidAction({ tournamentId: id });
    if (res.success) {
      settournamentusersList(res.data);
    }
    if (res1.success) {
      settournamentList(res1.data);
    }
    if (res1.success == false) {
      settournamentmsg("Tournament does not start");
    }
    console.log(res1.success);
  };

  function editPartner(item) {
    settournamentusers(item);
    console.log(item);
  }

  const columns = [
    {
      key: "Sno.",
      text: "Sno.",
      cell: (row, index) => index + 1,
    },
    {
      key: "email",
      text: "Email / Mobile Number",
      cell: (item) => {
        return (
          <>
            {item.email == null ||
            item.email == undefined ||
            item.email == "" ? (
              <>
                {" "}
                <a
                  target="__blank"
                  href={`${config.baseUrl}userdetails/` + item.user_id}
                >
                  {" "}
                  {item.mobile_no}{" "}
                </a>
                &nbsp;{" "}
                <CopyToClipboard text={item.mobile_no}>
                  <sapn
                    title="Click to Copy"
                    className="mr-copylink"
                    id="token-buy-button"
                    onClick={copieBtn}
                    style={{ cursor: "pointer", color: "rgb(157 81 255)" }}
                  >
                    <i class="fa fa-copy "></i>
                  </sapn>
                </CopyToClipboard>
                <br />
              </>
            ) : (
              <>
                {" "}
                <a
                  target="__blank"
                  href={`${config.baseUrl}userdetails/` + item.user_id}
                >
                  {" "}
                  {item.email}{" "}
                </a>
                &nbsp;{" "}
                <CopyToClipboard text={item.email}>
                  <sapn
                    title="Click to Copy"
                    className="mr-copylink"
                    id="token-buy-button"
                    onClick={copieBtn}
                    style={{ cursor: "pointer", color: "rgb(157 81 255)" }}
                  >
                    <i class="fa fa-copy "></i>
                  </sapn>
                </CopyToClipboard>
                <br />
              </>
            )}
          </>
        );
      },
    },
    {
      key: "winning_amount",
      text: "Winning amount",
      cell: (item) => {
        return `${
          item.winning_amount == 0 ? "Game in progress" : item.winning_amount
        }`;
      },
    },

    {
      key: "rank",
      text: "Player Rank",
      cell: (item) => {
        return `${item.rank == 0 ? "Game in progress" : item.rank}`;
      },
    },

    {
      key: "is_winner",
      text: "Player Status",
      cell: (item) => {
        return `${
          item.is_winner == 0
            ? "Still Playing"
            : item.is_winner == 1
            ? "Loser"
            : item.is_winner == 2
            ? "Winner"
            : "Unkown Status"
        }`;
      },
    },

    // {
    //   key: "startTime",
    //   text: "Date",
    //   cell: (item) => {
    //     return `${moment(item.startTime).format("YYYY-MM-DD")}`;
    //   },
    // },

    {
      key: "action",
      text: "Add Amount",
      cell: (item) => {
        return (
          <>
            {item.is_winner == 2 ? (
              <button
                type="button"
                onClick={() => editPartner(item)}
                className="btn btn-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                name={item.id}
                value={item.id}
              >
                Edit
              </button>
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
      excel: false,
      print: false,
    },
  };

  const editTournamentusers = async (e) => {
    e.preventDefault();
    let res = await updatewinneramountAction(tournamentusers);
    if (res.success) {
      toast.success(res.msg);
      document.getElementsByClassName("closeModal")[0].click();
      gettournamentusers();
      // setTimeout(() => {
      //   window.location.href = `${config.baseUrl}userguide`;
      // }, 2000);
    } else {
      toast.error(res.msg);
    }
  };

  const insertTournamentusers = async (e) => {
    e.preventDefault();
    let res = await addtournamentAction(addtournamentusers);
    if (res.success) {
      toast.success(res.msg);
      document.getElementsByClassName("closeModal1")[0].click();
      gettournamentusers();
      // setTimeout(() => {
      //   window.location.href = `${config.baseUrl}userguide`;
      // }, 2000);
    } else {
      toast.error(res.msg);
    }
  };

  return (
    <>
      <div class="wrapper">
        {/* <div id="loader"></div> */}
        <Header />
        <Toaster />
        <Sidebar />
        <div className="content-wrapper">
          <div className="container-full">
            {/* Main content */}
            <section className="content">
              <div className="row">
                <div className="col-lg-12 col-12">
                  <h4>{tournamentmsg}</h4> {console.log("asddf", tournamentmsg)}
                  <div className="d-flex">
                    <h4 className="box-title">Tournament Title</h4> &nbsp;&nbsp;
                    <h4 className="box-title">-</h4>
                    <h4
                      className="box-title"
                      style={{ marginLeft: "30px", marginRight: "100px" }}
                    >
                      {gettournamentlist.title}
                    </h4>
                    <h4 className="box-title">Total Winner</h4> &nbsp;&nbsp;
                    <h4 className="box-title">-</h4>
                    <h4 className="box-title" style={{ marginLeft: "30px" }}>
                      {gettournamentlist.total_winner}
                    </h4>
                  </div>
                  <div className="box">
                    <div className="box-header with-border">
                      <h4 className="box-title">Tournament users List</h4>

                      {/* <a
                        href={`${config.baseUrl}itemAdd `}
                        className="btn btn-sm btn-primary add_btn"
                      >
                        Add New
                      </a> */}
                      {/* <button
                        type="button"
                        // onClick={() => editPartner(item)}
                        className="btn btn-primary "
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                      >
                        Add
                      </button> */}
                    </div>
                    <div className="box-body">
                      <ReactDatatable
                        config={configForTable}
                        records={gettournamentuserslist}
                        columns={columns}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/*Edit Modal */}
              <div
                className="modal fade"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5
                        className="modal-title text-light"
                        id="exampleModalLabel"
                      >
                        Update Tournamentusers
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <form onSubmit={editTournamentusers}>
                      <div className="modal-body">
                        <div className="container">
                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Winning Amount
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter Title"
                              onChange={inputHandler}
                              name="winning_amount"
                              value={tournamentusers.winning_amount}
                              onKeyPress={(event) => {
                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </div>

                          {/* <div className="mb-3">
                          <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Select Tournamentusers Status
                            </label>
                            <select
                              className="form-control"
                              onChange={inputHandler}
                              name="isCompleted"
                              value={tournamentusers.isCompleted}

                            >
                              <option value="0">Tournamentusers Pending </option>
                              <option value="1">Tournamentusers Starts</option>
                            </select>
                          </div> */}

                          <div className="modal-footer mt-20">
                            <button type="submit" class="btn btn-primary">
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary closeModal"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/*Edit Modal Ends */}
              {/*Add Modal */}
              <div
                className="modal fade"
                id="exampleModal1"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5
                        className="modal-title text-light"
                        id="exampleModalLabel"
                      >
                        Add Tournamentusers Details
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <form onSubmit={insertTournamentusers}>
                      <div className="modal-body">
                        <div className="container">
                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Add Title
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler1}
                              name="title"
                              //   value={addtournamentusers.title}
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlTextarea1"
                              className="form-label"
                            >
                              Add description
                            </label>
                            <textarea
                              className="form-control"
                              id="exampleFormControlTextarea1"
                              rows={3}
                              onChange={inputHandler1}
                              placeholder="Enter description"
                              name="description"
                              //   value={addtournamentusers.description}
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Add Entry Fee
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler1}
                              name="entryFee"
                              //   value={addtournamentusers.title}
                              onKeyPress={(event) => {
                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </div>
                          {/* 
                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Add Total Number Of Tables
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler1}
                              name="total_table"
                              //   value={addtournamentusers.title}
                              onKeyPress={(event) => {
                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </div> */}

                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Time
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler1}
                              name="beginTime"
                              //   value={addtournamentusers.title}
                              onKeyPress={(event) => {
                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </div>

                          <div className="modal-footer mt-20">
                            <button type="submit" class="btn btn-primary">
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary closeModal1"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/*Add Modal Ends */}
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
export default TournamentUsers;
