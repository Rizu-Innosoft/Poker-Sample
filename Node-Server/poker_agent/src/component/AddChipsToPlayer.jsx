import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import {
  sendchipstoplayerAction,
  getplayerofagentlistAction,
  totalchipsofagentAction,
  getChipsPriceAction,
} from "../Action/action";
import toast, { Toaster } from "react-hot-toast";
import config from "../coreFIles/config";
import Cookies from "js-cookie";

const AddChipToPlayer = () => {
  const [adduser, setadduser] = useState([]);
  const [chips, setchips] = useState({});
  const [totalchips, settotalchips] = useState();
  const [msg, setmsg] = useState();
  const [price, setprice] = useState("");

  const loginData = !Cookies.get("loginSuccessPokerAgent")
    ? []
    : JSON.parse(Cookies.get("loginSuccessPokerAgent"));
  const [validationError, setvalidationError] = useState();

  useEffect(() => {
    getAgentList();
    setchips({ id: loginData.id });
    getotalchips();
    getpartner();
  }, []);

  const getpartner = async () => {
    let res = await getChipsPriceAction();
    if (res) {
      setprice(res.data.chips);
      console.log("123", res.data.chips);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setchips((old) => {
      return { ...old, [name]: value };
    });
   
  };

  const inputHandler1 = (e) => {
    const { name, value } = e.target;
    setmsg(price * value);
    console.log(price * value);
    setchips((old) => {
      return { ...old, [name]: value };
    });
  };

  function validate() {
    let chipsError = "";
    if (
      chips.diamond_chips == "" ||
      chips.diamond_chips == null ||
      chips.diamond_chips == undefined ||
      chips.diamond_chips == 0 ||
      chips.diamond_chips == "0"
    ) {
      chipsError = "diamond chips is required and grater than zero.";
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

  const getAgentList = async () => {
    let res = await getplayerofagentlistAction({ id: loginData.id });
    if (res.success) {
      setadduser(res.data);
      console.log("data", res.data);
    }
  };



  const registerUser = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      return false;
    } else {
      console.log("adduser", chips, msg);

      let res = await sendchipstoplayerAction({ chips: chips, amount: msg });
      if (res.success) {
        toast.success(res.msg);
        setTimeout(() => {
          window.location.href = `${config.baseUrl}addchiptoplayer`;
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
                  <h3 className="page-title mb-5 pb-2">Add Chips </h3>
                </div>

                {/* <div>{mask}</div> */}
              </div>
            </div>
            {/* Content Header (Page header) */}

            {/* Main content */}

            {/*Edit Modal */}
            <div>
              <div className="p-4">
                <div className="box">
                  <form onSubmit={registerUser}>
                    <div className="modal-body">
                      <h4 className="page-title mb-5 pb-2">
                        Total Chips - {totalchips}{" "}
                      </h4>

                      <div className="container">
                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Email
                          </label>
                          
                          <select
                            class="form-control"
                            aria-label="Default select example"
                            name="user_id"
                            onChange={inputHandler}
                          >
                            <option value=""> Select Email</option>
                            {adduser.map((item) => {
                              return (
                                <option value={item.id}>{item.email ==0 ||item.email ==""||item.email ==NaN||item.email ==null? item.mobile_no :item.email} </option>
                              );
                            })}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            Chips
                          </label>
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                          >
                            You will get ${msg} from player
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            onChange={inputHandler1}
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
export default AddChipToPlayer;
