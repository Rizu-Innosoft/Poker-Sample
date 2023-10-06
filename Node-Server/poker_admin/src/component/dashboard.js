import React, { useEffect, useState } from 'react'
import Header from '../directives/header'
import Footer from '../directives/footer'
import Sidebar from '../directives/sidebar'
import { getDashboardStatisticsAction  } from '../Action/action';

const Dashboard = () => {

  const [statistics, setStatistics] = useState({ totalUsers: 0, todayRegisteredUsers: 0, totalSubscribers: 0,totalChipsSendToAgent: 0,TotalChipsReceivedFromAgent: 0,TotalChipsRequestedFromAgent: 0,TotalChipsReceivedFromAgentPending: 0, TotalChipsRequestedFromAgentPending: 0, totalMoneyReceivedFromAgent: 0,totalMoneyReceivedFromAgentPending: 0, totalMoneyRequestedReceivedFromAgent: 0,totalMoneyRequestedReceivedFromAgentPending: 0,totalMoneySentToAgent: 0,totalMoneySentToAgentPending: 0});
// s
  useEffect(() => {
    getDashboardStatistics();
  }, []);

  const share = () => {
    navigator.share({
      title: 'POKER',
      url: 'https://espsofttech.org/forensic/admin/',
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
  }

  const getDashboardStatistics = async () => {
    let res = await getDashboardStatisticsAction();
    if (res.success) {
      let data = res.data;
      setStatistics((old) => {
        return {
          ...old,
          'totalUsers': data.totalUsers,
          'todayRegisteredUsers': data.todayRegisteredUsers,
          'totalSubscribers': data.totalSubscribers,
          'totalChipsSendToAgent': data.totalChipsSendToAgent,
          'TotalChipsReceivedFromAgent': data.TotalChipsReceivedFromAgent,
          'TotalChipsRequestedFromAgent': data.TotalChipsRequestedFromAgent,
          'totalMoneyReceivedFromAgent': data.totalMoneyReceivedFromAgent,
          'totalMoneyRequestedReceivedFromAgent': data.totalMoneyRequestedReceivedFromAgent,
          'totalMoneySentToAgent': data.totalMoneySentToAgent,

        }
      })
    }
  }

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
                  <h3 className="page-title mb-5 pb-2">Dashboard</h3>
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
                              <p className="mb-0"><h4>Total Users</h4></p>
                              <p className="mb-0">
                                <h5>{statistics.totalUsers}</h5>
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
                              <p className="mb-0"><h4>Today Registered</h4></p>
                              <p className="mb-0">
                                <h5>{statistics.todayRegisteredUsers}</h5>
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
                              <p className="mb-0"><h4>Total Chips Sent</h4></p>
                              <p className="mb-0">
                                <h5>{statistics.totalChipsSendToAgent + statistics.TotalChipsRequestedFromAgent}</h5>
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
                              <p className="mb-0"><h4>Total Withdrawable Chips</h4></p>
                              <p className="mb-0">
                                <h5>{Math.abs(statistics.TotalChipsReceivedFromAgent)}</h5>
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
                              <p className="mb-0"><h4>Total Amount Received</h4></p>
                              <p className="mb-0">
                                <h5>{parseInt(statistics.totalMoneyReceivedFromAgent)+parseInt(statistics.totalMoneyRequestedReceivedFromAgent)}</h5>
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
                              <p className="mb-0"><h4>Total Amount Sent</h4></p>
                              <p className="mb-0">
                                <h5>{parseInt(statistics.totalMoneySentToAgent)}</h5>
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