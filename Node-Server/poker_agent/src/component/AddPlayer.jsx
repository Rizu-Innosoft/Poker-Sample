import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import { addplayerbyagentAction } from "../Action/action";
import toast, { Toaster } from "react-hot-toast";
import config from "../coreFIles/config";
import Cookies from "js-cookie";
import { Input } from "antd";

const AddPlayer = () => {
  const [adduser, setadduser] = useState({});
  const loginData = !Cookies.get("loginSuccessPokerAgent")
    ? []
    : JSON.parse(Cookies.get("loginSuccessPokerAgent"));

  useEffect(() => {
    setadduser({ id: loginData.id });
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setadduser((old) => {
      return { ...old, [name]: value };
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    console.log("adduser", adduser);

    let res = await addplayerbyagentAction(adduser);
    if (res.success) {
      toast.success(res.msg);
      setTimeout(() => {
        window.location.href = `${config.baseUrl}addplayer`;
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
                  <h3 className="page-title mb-5 pb-2">Add Player</h3>
                </div>

                {/* <div>{mask}</div> */}
              </div>
            </div>
            {/* Content Header (Page header) */}

            {/* Main content */}

            {/*Edit Modal */}
            <div>
              <div className="p-5">
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
                          <Input
                            type="password"
                            className="form-control"
                            onChange={inputHandler}
                            name="password"
                            pattern="^(?=.*\d)(?=.*[a-zA-Z]).{8,}$" 
                            required title="Password must be at least 8 characters long and contain both letters and numbers."
                            onPaste={(e) => {
                              e.preventDefault()
                              return false;
                            }} onCopy={(e) => {
                              e.preventDefault()
                              return false;
                            }}

                          />
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Confirm Password
                          </label>
                          <Input
                            type="password"
                            className="form-control"
                            onChange={inputHandler}
                            name="currentPassword"
                            onPaste={(e) => {
                              e.preventDefault()
                              return false;
                            }} onCopy={(e) => {
                              e.preventDefault()
                              return false;
                            }}
                          />
                        </div>

                        <div className="">
                          <button
                            type="submit"
                            class="btn btn-primary mx-20 my-10 pull-right"
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
export default AddPlayer;
