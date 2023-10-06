import React, { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import { sendchipstoagentAction, getagentlistAction , getChipsPriceAction } from "../Action/action";
import toast, { Toaster } from "react-hot-toast";
import config from "../coreFIles/config";
import Cookies from "js-cookie";

const AddChip = () => {
  const [adduser, setadduser] = useState([]);
  const [chips, setchips] = useState({});
  const [msg, setmsg] = useState();
  const [price, setprice] = useState("");
  const [validationError, setvalidationError] = useState();

  useEffect(() => {
    getAgentList();
    getpartner();
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    setchips((old) => {
      return { ...old, [name]: value };
    });
  };

  const inputHandler1 = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    setmsg(price * value);
    console.log("asdf", price * value);
    setchips((old) => {
      return { ...old, [name]: value };
    });
  };

  const getpartner = async () => {
    let res = await getChipsPriceAction();
    if (res) {
      setprice(res.data.chips);
      console.log("123", res.data.chips);
    }
  };

  const getAgentList = async () => {
    let res = await getagentlistAction();
    if (res.success) {
      setadduser(res.data);
      console.log("data", res.data);
    }
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
      chipsError = "Diamond is required and must be grater than zero.";
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

  const registerUser = async (e) => {
    e.preventDefault();
    
    console.log("adduser", chips , msg);
    
    const isValid = validate();
    if (!isValid) {
      return false;
    } else {
      
    let res = await sendchipstoagentAction({chips:chips , amount : msg});
    if (res.success) {
      toast.success(res.msg);
      setTimeout(() => {
        window.location.href = `${config.baseUrl}addchip`;
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
                    <div className="container">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label"
                        >
                          Email
                        </label>
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          name="id"
                          onChange={inputHandler}
                        >

                          <option value="" > Select Email</option>
                          {adduser.map((item) => {
                            return (
                              <option value={item.id} 
                              >{item.username ==0 ||item.username ==""||item.username ==NaN? item.mobile_no :item.username} </option>
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
                            You will get ${msg} from Agent
                          </label>
                        <input
                          type="name"
                          className="form-control"
                          onChange={inputHandler1}
                          name="diamond_chips"
                          onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }}
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
export default AddChip;
