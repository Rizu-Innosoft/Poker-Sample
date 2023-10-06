import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import { adduserbyadminAction } from "../Action/action";
import toast, { Toaster } from "react-hot-toast";
import config from "../coreFIles/config";
import Cookies from "js-cookie";

const AddUser = () => {
  const [adduser, setadduser] = useState({});

  useEffect(() => {}, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setadduser((old) => {
      return { ...old, [name]: value };
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    console.log("adduser", adduser);
    adduser.commission = parseInt(adduser.commission)
    let res = await adduserbyadminAction(adduser);
    if (res.success) {
      toast.success(res.msg);
      setTimeout(() => {
        window.location.href = `${config.baseUrl}adduser`;
      }, 2000);
    } else {
      toast.error(res.msg);
    }
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
                  <h3 className="page-title mb-5 pb-2">Add Agent</h3>
                </div>

                {/* <div>{mask}</div> */}
              </div>
            </div>
            {/* Content Header (Page header) */}

            {/* Main content */}

            {/*Edit Modal */}
            <div className="">
              <div className="p-4 ">
                <div className="box">
                <form onSubmit={registerUser}>
                  <div className="modal-body">
                    <div className="container">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          Add Valid Email or Mobile Number with country code e.g-(+9188888xxxxx)
                        </label>
                        <input
                          type="name"
                          className="form-control"
                          onChange={inputHandler}
                          name="email"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          onChange={inputHandler}
                          name="password"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                         Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          onChange={inputHandler}
                          name="currentPassword"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                         Commission
                        </label>
                        <input
                          type="name"
                          className="form-control"
                          onChange={inputHandler}
                          name="commission"
                        />
                      </div>

                      <div className=" ">
                        <button
                          type="submit"
                          class="btn btn-primary my-20 pull-right"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                </div>
              </div>
            </div>
            {/*Edit Modal Ends */}
            {/* /.content */}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};
export default AddUser;
