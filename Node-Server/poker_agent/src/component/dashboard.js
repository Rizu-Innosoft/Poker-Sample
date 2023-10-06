import React, { useEffect, useState } from 'react'
import Header from '../directives/header'
import Footer from '../directives/footer'
import Sidebar from '../directives/sidebar'
import { getDashboardStatisticsAction , getcommissionpriceAction, totalamountreceivedfromadminAction, totalamountofagentAction, totalchipsofagentAction, totalpendingchipsAction, totalpendingchipsforextendAction } from '../Action/action';
import Cookies from 'js-cookie';

const Dashboard = () => {

  const [totalchips, settotalchips] = useState();
  const [totalamount, settotalamount] = useState();
  const [totalchipspending, settotalchipspending] = useState();
  const [totalchipspendingforextend, settotalchipspendingforextend] = useState();
  const [totalamountreceived, settotalamountreceived] = useState();
  const [commission, setcommission] = useState();


  const loginData = (!Cookies.get('loginSuccessPokerAgent')) ? [] : JSON.parse(Cookies.get('loginSuccessPokerAgent'));

  useEffect(() => {
    getotalchips()
    getotalamount()
    getotalchipspending()
    getotalchipspendingforextend()
    totalamountreceivedfromadmin()
    getcommission()
  }, []);

  const getotalamount = async () => {
    let res = await totalamountofagentAction({id:loginData.id});
    if (res) {
      settotalamount(res.data);
      console.log("123", res.data);
    }
  };

  const getcommission = async () => {
    let res = await getcommissionpriceAction({id:loginData.id});
    if (res) {
      setcommission(res.data.commission);
      // console.log("123", res.data);
    }
  };

  const getotalchips = async () => {
    let res = await totalchipsofagentAction({id:loginData.id});
    if (res) {
      settotalchips(res.data);
      console.log("123", res.data);
    }
  };

  const getotalchipspendingforextend = async () => {
    let res = await totalpendingchipsforextendAction({id:loginData.id});
    if (res) {
      settotalchipspendingforextend(res.data);
      console.log("123", res.data);
    }
  };

  
  const getotalchipspending = async () => {
    let res = await totalpendingchipsAction({id:loginData.id});
    if (res) {
      settotalchipspending(res.data);
      console.log("123", res.data);
    }
  };

  const totalamountreceivedfromadmin = async () => {
    let res = await totalamountreceivedfromadminAction({id:loginData.id});
    if (res) {
      settotalamountreceived(res.data);
      console.log("123", res.data);
    }
  };

 

  return (

    <>
      <div class="wrapper">
        {/* <div id="loader"></div> */}
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <div className="container-full">
            <div className="content-header">
              <div className="d-flex align-items-center">
                <div className="me-auto">
                  <h3 className="page-title mb-5 pb-2">Wallet Management</h3>

                </div>
              </div>

            </div>
            {/* Content Header (Page header) */}
            {/* Main content */}
            <section className="content pt-0">
              <div className="row">
                <div className="col-xl-12 col-12">
                  <div className="row">
                    <div className="col-lg-4 col-12">
                      <div className="box">
                        <div className="box-body">
                          <div className="no-line-chart d-flex align-items-end justify-content-between">
                            <div>
                              <p className="mb-0"><h4>Total Chips</h4></p>
                              <p className="mb-0">
                                <h5>{totalchips == null ? 0 : totalchips }</h5>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12">
                      <div className="box">
                        <div className="box-body">
                          <div className="no-line-chart d-flex align-items-end justify-content-between">
                            <div>
                              <p className="mb-0"><h4>Total Withdrawable Amount</h4></p>
                              <p className="mb-0">
                                <h5>{totalamount == null ? 0 :parseInt(totalamount) }</h5>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12">
                      <div className="box">
                        <div className="box-body">
                          <div className="no-line-chart d-flex align-items-end justify-content-between">
                            <div>
                              <p className="mb-0"><h4>Pending Chips For Withdraw</h4></p>
                              <p className="mb-0">
                                <h5>{totalchipspending==null ? 0 : totalchipspending  }</h5>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-lg-4 col-12">
                      <div className="box">
                        <div className="box-body">
                          <div className="no-line-chart d-flex align-items-end justify-content-between">
                            <div>
                              <p className="mb-0"><h4>Requested Chips</h4></p>
                              <p className="mb-0">
                                <h5>{totalchipspendingforextend==null||totalchipspendingforextend==0 ? 0 : totalchipspendingforextend}</h5>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="col-lg-4 col-12">
                      <div className="box">
                        <div className="box-body">
                          <div className="no-line-chart d-flex align-items-end justify-content-between">
                            <div>
                              <p className="mb-0"><h4>Total Amount Received </h4></p>
                              <p className="mb-0">
                                <h5>{totalamountreceived==null||totalamountreceived==0 ? 0 : totalamountreceived}</h5>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12">
                      <div className="box">
                        <div className="box-body">
                          <div className="no-line-chart d-flex align-items-end justify-content-between">
                            <div>
                              <p className="mb-0"><h4>Commission</h4></p>
                              <p className="mb-0">
                                <h5>{commission == null ? 0 : commission }</h5>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* /.content */}
          </div>
        </div>

        <Footer />
      </div>
    </>


  )

}
export default Dashboard;