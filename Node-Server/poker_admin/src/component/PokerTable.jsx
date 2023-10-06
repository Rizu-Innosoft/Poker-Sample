import React, { useEffect, useState } from "react";
// import config from '../coreFIles/config'
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import config from "../coreFIles/config";
import ReactDatatable from "@ashvin27/react-datatable";
import {
  getpokertableAction,
  addpokertableAction,
  updatepokertableAction,
  deleteexpertAction,
} from "../Action/action";
import Swal from "sweetalert2";
import moment from "moment";
import { toast, Toaster } from "react-hot-toast";

const PokerTable = () => {
  const [getpokertablelist, setpokertableList] = useState([]);
  //   const [form, setForm] = useState({});
  const [pokertable, setpokertable] = useState({});
  const [addpokertable, setaddpokertable] = useState({});

  useEffect(() => {
    getpokertable();
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setpokertable((old) => {
      return { ...old, [name]: value };
    });
  };

  const inputHandler1 = (e) => {
    const { name, value } = e.target;
    setaddpokertable((old) => {
      return { ...old, [name]: value };
    });
  };

  const getpokertable = async () => {
    let res = await getpokertableAction();
    if (res.success) {
      setpokertableList(res.data);
    }
  };

  function editPartner(item) {
    setpokertable(item);
  }

  const columns = [
    {
      key: "Sno.",
      text: "Sno.",
      cell: (row, index) => index + 1,
    },
    {
      key: "title",
      text: "Title",
      cell: (item) => {
        return `${item.title}`;
      },
    },
    {
      key: "description",
      text: "Description",
      cell: (item) => {
        return `${item.description == null ? "" : item.description}`;
      },
    },

    {
      key: "min_player",
      text: "Minimum Player",
      cell: (item) => {
        return `${item.min_player}`;
      },
    },

    {
      key: "max_player",
      text: "Maximum Player",
      cell: (item) => {
        return `${item.max_player}`;
      },
    },

    {
      key: "status",
      text: "Poker table Status",
      cell: (item) => {
        return `${
          item.status == 0
            ? "Active"
            : item.status == 1
            ? "In Active"
            : "Unkonwn Status"
        }`;
      },
    },

    // {
    //   key: "startTime",
    //   text: "Date",
    //   cell: (item) => {
    //     return item.startTime;
    //   },
    // },
    // ${moment(item.startTime).format("YYYY-MM-DD")}

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

  const editpokertable = async (e) => {
    e.preventDefault();
    let res = await updatepokertableAction(pokertable);
    if (res.success) {
      toast.success(res.msg);
      document.getElementsByClassName("closeModal")[0].click();
      getpokertable();
      // setTimeout(() => {
      //   window.location.href = `${config.baseUrl}userguide`;
      // }, 2000);
    } else {
      toast.error(res.msg);
    }
  };

  const insertpokertable = async (e) => {
    e.preventDefault();
    let res = await addpokertableAction(addpokertable);
    if (res.success) {
      toast.success(res.msg);
      document.getElementsByClassName("closeModal1")[0].click();
      getpokertable();
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
                      <h4 className="box-title">Poker Table List</h4>
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
                        records={getpokertablelist}
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
                        Update Poker table
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <form onSubmit={editpokertable}>
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
                              value={pokertable.title}
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
                              value={pokertable.description}
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Minimun Players
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler}
                              name="min_player"
                              value={pokertable.min_player}
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
                              Max Players
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler}
                              name="max_player"
                              value={pokertable.max_player}
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
                              Select Poker table Status
                            </label>
                            <select
                              className="form-control"
                              onChange={inputHandler}
                              name="status"
                              value={pokertable.status}
                            >
                              <option value="0">Active </option>
                              <option value="1">In-Active</option>
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
                        Add Poker table
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <form onSubmit={insertpokertable}>
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
                              placeholder="Enter title"
                              onChange={inputHandler1}
                              name="title"
                              //   value={addpokertable.title}
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
                              onChange={inputHandler1}
                              placeholder="Enter description"
                              name="description"
                              //   value={addpokertable.description}
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Minimum Players
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler1}
                              name="min_player"
                              //   value={addpokertable.title}
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
                              Maximum Players
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter title"
                              onChange={inputHandler1}
                              name="max_player"
                              //   value={addpokertable.title}
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
                              Select Poker Table Status
                            </label>
                            <select
                              className="form-control"
                              onChange={inputHandler1}
                              name="status"
                              // value={pokertable.status}
                            >
                              <option value="0">Active </option>
                              <option value="1">In-Active</option>
                            </select>
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
export default PokerTable;
