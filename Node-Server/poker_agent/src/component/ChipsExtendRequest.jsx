import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import {
  requestchipsAction,
  getChipsPriceAction,
  totalpendingchipsforextendAction,
} from "../Action/action";
import toast, { Toaster } from "react-hot-toast";
import config from "../coreFIles/config";
import Cookies from "js-cookie";

const ChipsExtendRequest = () => {
  const [adduser, setadduser] = useState({});
  const [price, setprice] = useState("");
  const [msg, setmsg] = useState();
  const [totalchipspending, settotalchipspending] = useState();
  const [validationError, setvalidationError] = useState();

  const loginData = !Cookies.get("loginSuccessPokerAgent")
    ? []
    : JSON.parse(Cookies.get("loginSuccessPokerAgent"));

  useEffect(() => {
    setadduser({ id: loginData.id });
    getpartner();
    getotalchipspending();
  }, []);

  const getotalchipspending = async () => {
    let res = await totalpendingchipsforextendAction({ id: loginData.id });
    if (res) {
      settotalchipspending(res.data);
      console.log("123", res.data);
    }
  };

  function validate() {
    let chipsError = "";
    if (
      adduser.diamond_chips == "" ||
      adduser.diamond_chips == null ||
      adduser.diamond_chips == undefined ||
      adduser.diamond_chips == 0
    ) {
      chipsError = "diamon chips is required or grater than zero.";
    }
    if (chipsError) {
      setvalidationError({
        chipsError,
      });

      return false;
    } else {
      return true;
    }
  }

  const getpartner = async () => {
    let res = await getChipsPriceAction();
    if (res) {
      setprice(res.data.chips);
      console.log("123", res.data.chips);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setmsg(price * value);
    setadduser((old) => {
      return { ...old, [name]: value };
    });
  };

  const chipsRequest = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      console.log("withdrawamounts", adduser);
      return false;
    } else {
      console.log("adduser", adduser, msg);
      let res = await requestchipsAction({ adduser: adduser, amount: msg });
      if (res.success) {
        toast.success(res.msg);
        setTimeout(() => {
          window.location.href = `${config.baseUrl}chipsextendrequest`;
        }, 2000);
      } else {
        toast.error(res.msg);
      }
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
                  <h3 className="page-title mb-5 pb-2">Chips Request</h3>
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
                  <form onSubmit={chipsRequest}>
                    <div className="modal-body">
                      <h4>
                        Total Pending Chips For extend - {totalchipspending}
                      </h4>

                      <div className="container">
                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Chips
                          </label>
                          <br />
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            You have to pay ${msg}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            onChange={inputHandler}
                            name="diamond_chips"
                            onKeyPress={(event) => {
                              if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                          <span className="validationErr danger">
                            {validationError?.chipsError}
                          </span>
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
export default ChipsExtendRequest;
