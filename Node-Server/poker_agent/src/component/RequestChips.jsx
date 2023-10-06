import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import {
  withdrawchipsrequestAction,
  getChipsPriceAction,
  totalpendingchipsAction,
  totalchipsofagentAction,
  totalchipsofagentincludingpendingAction
} from "../Action/action";
import toast, { Toaster } from "react-hot-toast";
import config from "../coreFIles/config";
import Cookies from "js-cookie";

const RequestChips = () => {
  const [adduser, setadduser] = useState({});
  const [price, setprice] = useState("");
  const [msg, setmsg] = useState();
  const [totalchips, settotalchips] = useState();
  const [totalchipspending, settotalchipspending] = useState();
  const [totalchipspendingincluding, settotalchipspendingincluding] = useState();

  const [validationError, setvalidationError] = useState();
  const loginData = !Cookies.get("loginSuccessPokerAgent")
    ? []
    : JSON.parse(Cookies.get("loginSuccessPokerAgent"));

  useEffect(() => {
    setadduser({ id: loginData.id });
    getpartner();
    getotalchips();
    getotalchipspending();
    getotalchipsincludingpending();
  }, []);

  function validate() {
    let chipsError = "";
    if (
      adduser.diamond_chips == "" ||
      adduser.diamond_chips == null ||
      adduser.diamond_chips == undefined ||
      adduser.diamond_chips == 0
    ) {
      chipsError = "diamond chips is required or grater than zero.";
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

  const getotalchips = async () => {
    let res = await totalchipsofagentAction({ id: loginData.id });
    if (res) {
      settotalchips(res.data);
      console.log("123", res.data);
    }
  };

  const getotalchipsincludingpending = async () => {
    let res = await totalchipsofagentincludingpendingAction({ id: loginData.id });
    if (res) {
      settotalchipspendingincluding(res.data);
      console.log("123", res.data);
    }
  };

  const getotalchipspending = async () => {
    let res = await totalpendingchipsAction({ id: loginData.id });
    if (res) {
      settotalchipspending(res.data);
      console.log("123", res.data);
    }
  };

  const getpartner = async () => {
    let res = await getChipsPriceAction();
    if (res) {
      setprice(res.data.chips);
      console.log("123", res.data.chips);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    // console.log(value);
    let value1 = parseInt(value);
    console.log(typeof value1);
    setmsg(price * value);
    setadduser((old) => {
      return { ...old, [name]: value1 };
    });
  };

  const withdrawRequest = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      console.log("withdrawamounts", adduser);
      return false;
    } else {
      console.log("adduser", adduser, msg);
      let res = await withdrawchipsrequestAction({
        adduser: adduser,
        amount: msg,
      });
      if (res.success) {
        toast.success(res.msg);
        setTimeout(() => {
          window.location.href = `${config.baseUrl}requestchips`;
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
                  <h3 className="page-title mb-5 pb-2">Withdraw Request</h3>
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
                  <form onSubmit={withdrawRequest}>
                    <div className="modal-body">
                      <div className="d-flex  justify-content-between">
                        <h4>Total Chips - {totalchips}</h4>
                        <h4>
                          Total Pending Chips For Withdraw - {totalchipspending}
                        </h4>
                       
                      </div>
                      <div className="container">
                        <div className="mb-3 mt-5">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Chips withdraw request
                          </label>
                          <br />
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            You will get ${msg}
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
export default RequestChips;
