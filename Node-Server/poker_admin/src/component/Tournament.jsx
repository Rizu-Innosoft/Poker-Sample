import React, { useEffect, useState } from "react";
// import config from '../coreFIles/config'
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import config from "../coreFIles/config";
import ReactDatatable from "@ashvin27/react-datatable";
import {
  gettournamentdetailsAction,
  addtournamentAction,
  updatetournamentAction,
} from "../Action/action";
import Swal from "sweetalert2";
import moment from "moment";
import { toast, Toaster } from "react-hot-toast";

const Tournament = () => {
  const [gettournamentlist, settournamentList] = useState({});
  //   const [form, setForm] = useState({});
  const [tournament, settournament] = useState({});
  const [addtournament, setaddtournament] = useState({
    tournament_type:0
  });

  useEffect(() => {
    gettournament();
    // insertTournament();
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    settournament((old) => {
      return { ...old, [name]: value };
    });
  };

  const inputHandler1 = (e) => {
    const { name, value } = e.target;
    setaddtournament((old) => {
      return { ...old, [name]: value };
    });
  };

  const gettournament = async () => {
    let res = await gettournamentdetailsAction();
    if (res.success) {
      settournamentList(res.data);
    }
  };

  function editPartner(item) {
    settournament(item);
  }

  const columns = [
    {
      key: "Sno.",
      text: "Sno.",
      cell: (row, index) => index + 1,
    },
    {
      key: "title",
      text: "Tournament Title",
      cell: (item) => {
        return (
          <a
            target="__blank"
            href={`${config.baseUrl}userstournament/` + item.id}
          >
            {item.title}{" "}
          </a>
        );
      },
    },
    {
      key: "description",
      text: "Tournament Description",
      cell: (item) => {
        return `${item.description == null ? "" : item.description}`;
      },
    },

    {
      key: "entryFee",
      text: "Entry Fee",
      cell: (item) => {
        return `${item.entryFee}`;
      },
    },

    {
      key: "tournament_type",
      text: "Tournament Type",
      cell: (item) => {
        return `${item.tournament_type==0 ? "MTT Tournament" :"SNG Tournament"}`;
      },
    },

    {
      key: "beginTime",
      text: "Time(in minutes)",
      cell: (item) => {
        return `${item.beginTime}`;
      },
    },

    // {
    //   key: "total_table",
    //   text: "Total no of Table",
    //   cell: (item) => {
    //     return `${item.total_table}`;
    //   },
    // },

    {
      key: "isCompleted",
      text: "Tournament Status",
      cell: (item) => {
        return `${
          item.isCompleted == 0
            ? "Tournament Pending"
            : item.isCompleted == 1
            ? "Tournament Starts"
            : item.isCompleted == 2
            ? "Tournament Completed"
            : "Unkonwn Status"
        }`;
      },
    },

    {
      key: "startTime",
      text: "Date",
      cell: (item) => {
        return `${moment(item.startTime).format("YYYY-MM-DD")}`;
      },
    },

    {
      key: "action",
      text: "Action",
      cell: (item) => {
        return (
          <>
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

  const editTournament = async (e) => {
    e.preventDefault();
    let res = await updatetournamentAction(tournament);
    if (res.success) {
      toast.success(res.msg);
      document.getElementsByClassName("closeModal")[0].click();
      gettournament();
      // setTimeout(() => {
      //   window.location.href = `${config.baseUrl}userguide`;
      // }, 2000);
    } else {
      toast.error(res.msg);
    }
  };

  const insertTournament = async (e) => {
    e.preventDefault();
    console.log(addtournament);
    let res = await addtournamentAction(addtournament);
    if (res.success) {
      toast.success(res.msg);
      document.getElementsByClassName("closeModal1")[0].click();
      gettournament();
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
                  <div className="box">
                    <div className="box-header with-border">
                      <h4 className="box-title">Tournament List</h4>
                      {/* <a
                        href={`${config.baseUrl}itemAdd `}
                        className="btn btn-sm btn-primary add_btn"
                      >
                        Add New
                      </a> */}
                      <button
                        type="button"
                        // onClick={() => editPartner(item)}
                        className="btn btn-primary "
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                      >
                        Add
                      </button>
                    </div>
                    <div className="box-body">
                      <ReactDatatable
                        config={configForTable}
                        records={gettournamentlist}
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
                        Update Tournament
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <form onSubmit={editTournament}>
                      <div className="modal-body">
                        <div className="container">
                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Title
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter Title"
                              onChange={inputHandler}
                              name="title"
                              value={tournament.title}
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlTextarea1"
                              className="form-label"
                            >
                              Description
                            </label>
                            <textarea
                              className="form-control"
                              id="exampleFormControlTextarea1"
                              rows={3}
                              onChange={inputHandler}
                              name="description"
                              value={tournament.description}
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
                              onChange={inputHandler}
                              name="entryFee"
                              value={tournament.entryFee}
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
                              Add Total Number Of Tables
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler}
                              name="total_table"
                              value={tournament.total_table}
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
                              Add Time
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler}
                              name="beginTime"
                              value={tournament.beginTime}
                              onKeyPress={(event) => {
                                if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Select Tournament Status
                            </label>
                            <select
                              className="form-control"
                              onChange={inputHandler}
                              name="isCompleted"
                              value={tournament.isCompleted}
                            >
                              <option value="0">Tournament Pending </option>
                              <option value="1">Tournament Starts</option>
                            </select>
                          </div>

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
                        Add Tournament Details
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <form onSubmit={insertTournament}>
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
                              //   value={addtournament.title}
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
                              //   value={addtournament.description}
                            />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="">Select Tournament Type</label>
                            <select
                              className="form-control"
                              onChange={(e) => inputHandler1(e)}
                              name="tournament_type"
                            >
                              <option value="0">MTT Tournament </option>
                              <option value="1">SNG Tournament </option>

                            </select>
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
                              placeholder="Enter Entry Fee"
                              onChange={inputHandler1}
                              name="entryFee"
                              //   value={addtournament.title}
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
                              //   value={addtournament.title}
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
                              placeholder="Enter Time"
                              onChange={inputHandler1}
                              name="beginTime"
                              //   value={addtournament.title}
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
export default Tournament;
