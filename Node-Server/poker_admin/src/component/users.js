import React, { Component, useEffect, useState } from 'react'
import config from '../coreFIles/config';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../directives/header';
import Footer from '../directives/footer';
import Sidebar from '../directives/sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { getUsersListAction, UserBlockAction, UserUnBlockAction, getAgentsListAction } from '../Action/action';
import moment from 'moment';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Users = () => {
    const [form, setForm] = useState({ from_date: '', to_date: '' });
    const [usersList, setusersList] = useState({});
    const [loader, setLoader] = useState(true);
    const [type, settype] = useState(true)
    const [agentsList, setagentsList] = useState({});

    useEffect(() => {
        getUsersList();
        getAgentsList();

    }, [])

    const getUsersList = async () => {
        setLoader(true)
        console.log(form);
        let res = await getUsersListAction(form);
        if (res.success) {
            setLoader(false)
            setusersList(res.data)
        }
    }

    const getUsersListCustom = async () => {
        // setLoader(true)
        console.log(form);
        form.type = ""
        let res = await getUsersListAction(form);
        if (res.success) {
            // setLoader(false)
            setusersList(res.data)
        }
    }

    const getAgentsList = async () => {
        console.log(form);

        let res = await getAgentsListAction(form);
        if (res.success) {
            console.log((res.data))
            setagentsList(res.data)
        }
    }

    const getAgentsListCustom = async () => {
        console.log(form);
        form.type = ""
        let res = await getAgentsListAction(form);
        if (res.success) {
            console.log((res.data))
            setagentsList(res.data)
        }
    }

    const getUsersListReset = async () => {
        setLoader(true)
        let res = await getUsersListAction();
        if (res.success) {
            setLoader(false)
            setusersList(res.data)
        }
    }

    const getUsersListToday = async () => {
        form.type = 2;
        setLoader(true)
        let res = await getUsersListAction(form);
        if (res.success) {
            setLoader(false)
            setusersList(res.data)
        }
    }

    const getUsersListLastWeek = async () => {
        form.type = 3;
        setLoader(true)
        let res = await getUsersListAction(form);
        if (res.success) {
            setLoader(false)
            setusersList(res.data)
        }
    }

    const getUsersListlastMonth = async () => {
        form.type = 4;
        setLoader(true)
        let res = await getUsersListAction(form);
        if (res.success) {
            setLoader(false)
            setusersList(res.data)
        }
    }

    const getUsersListReset1 = async () => {
        setLoader(true)
        let res = await getAgentsListAction();
        if (res.success) {
            setLoader(false)
            setagentsList(res.data)
        }
    }

    const getUsersListToday1 = async () => {
        form.type = 2;
        setLoader(true)
        let res = await getAgentsListAction(form);
        if (res.success) {
            setLoader(false)
            setagentsList(res.data)
        }
    }

    const getUsersListLastWeek1 = async () => {
        form.type = 3;
        setLoader(true)
        let res = await getAgentsListAction(form);
        if (res.success) {
            setLoader(false)
            setagentsList(res.data)
        }
    }

    const getUsersListlastMonth1 = async () => {
        form.type = 4;
        setLoader(true)
        let res = await getAgentsListAction(form);
        if (res.success) {
            setLoader(false)
            setagentsList(res.data)
        }
    }

    const UserBlock = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to Block this User!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Block it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await await UserBlockAction({ 'id': id });
                if (res.success) {
                    getUsersList();
                    // toast.success(res.msg);
                    Swal.fire(
                        'Rejected!',
                        res.msg,
                        'success'
                    )
                } else {
                    Swal.fire(
                        'Failed!',
                        res.msg,
                        'error'
                    )
                }
            }
        })
    }

    const UserUnBlock = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to Unlock this User!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Unblock it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await await UserUnBlockAction({ 'id': id });
                if (res.success) {
                    getUsersList();
                    Swal.fire(
                        'Rejected!',
                        res.msg,
                        'success'
                    )
                } else {
                    Swal.fire(
                        'Failed!',
                        res.msg,
                        'error'
                    )
                }
            }
        })
    }

    const copieBtn = async () => {
        toast.success(`Coppied!!`);
    }

    const columns = [
        {
            key: "Sno.",
            text: "Sno.",
            cell: (row, index) => index + 1
        },

        {
            key: "is_agent",
            text: "Agent",
            cell: (item) => {
                return `${item.is_agent == "" ? "Agent" : "Player"}`;
            }
        },

        {
            key: "email",
            text: "Email / Mobile Number",
            cell: (item) => {
                return (
                    <>{item.email == null || item.email == undefined || item.email == "" ?
                        <>      <a target="__blank" href={`${config.baseUrl}userdetails/` + item.id} > {item.mobile_no} </a>
                            &nbsp; <CopyToClipboard text={item.mobile_no}>
                                <sapn title="Click to Copy" className="mr-copylink" id="token-buy-button" onClick={copieBtn} style={{ cursor: "pointer", color: 'rgb(157 81 255)' }}>
                                    <i class="fa fa-copy "></i></sapn></CopyToClipboard><br /></> :

                        <>      <a target="__blank" href={`${config.baseUrl}userdetails/` + item.id} > {item.email} </a>
                            &nbsp; <CopyToClipboard text={item.email}>
                                <sapn title="Click to Copy" className="mr-copylink" id="token-buy-button" onClick={copieBtn} style={{ cursor: "pointer", color: 'rgb(157 81 255)' }}>
                                    <i class="fa fa-copy "></i></sapn></CopyToClipboard><br /></>}

                    </>
                );
            }
        },

        {
            key: "created_at",
            text: "Joining Date",
            // sortable: true,
            cell: (item) => {
                return (
                    `${item.created_at}`
                );
            }
        },


    ];

    const columns1 = [
        {
            key: "Sno.",
            text: "Sno.",
            cell: (row, index) => index + 1
        },

        // {
        //     key: "is_agent",
        //     text: "Agent",
        //     cell: (item) => {
        //         return `${item.is_agent == "" ? "Agent" : "Player"}`;
        //     }
        // },

        {
            key: "email",
            text: "Email / Mobile Number",
            cell: (item) => {
                return (
                    <>{item.email == null || item.email == undefined || item.email == "" ?
                        <>      <a target="__blank" href={`${config.baseUrl}userdetails/` + item.id} > {item.mobile_no} </a>
                            &nbsp; <CopyToClipboard text={item.mobile_no}>
                                <sapn title="Click to Copy" className="mr-copylink" id="token-buy-button" onClick={copieBtn} style={{ cursor: "pointer", color: 'rgb(157 81 255)' }}>
                                    <i class="fa fa-copy "></i></sapn></CopyToClipboard><br /></> :

                        <>      <a target="__blank" href={`${config.baseUrl}userdetails/` + item.id} > {item.email} </a>
                            &nbsp; <CopyToClipboard text={item.email}>
                                <sapn title="Click to Copy" className="mr-copylink" id="token-buy-button" onClick={copieBtn} style={{ cursor: "pointer", color: 'rgb(157 81 255)' }}>
                                    <i class="fa fa-copy "></i></sapn></CopyToClipboard><br /></>}
                    </>
                );
            }
        },

        {
            key: "datetime",
            text: "Joining Date",
            // sortable: true,
            cell: (item) => {
                return (
                    `${item.datetime}`
                );
            }
        },


    ];

    const configForTable = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        button: {
            excel: true,
            print: false

        }
    }

    const configForTable1 = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        button: {
            excel: true,
            print: false

        }
    }

    const inputHandler = async (e) => {
        const { name, value } = e.target
        setForm((old) => {
            return { ...old, [name]: value }
        })
    }

    // const getRegisterusersbysearch = async () => {
    // let res = await getRegisterusersAction(form);
    // if (res.success) {
    //     setRegisterUsersHistory(res.data)   
    // }
    // } 
    return (

        <>
            <div class="wrapper">
                {/* <div id="loader"></div> */}
                <Toaster />
                <Header />
                <Sidebar />
                <div className="content-wrapper">
                    <div className='d-flex mt-20'>
                    <button className='btn btn-primary ' style={{"margin-left":"100px"}} onClick={() => settype(true)}>Users</button>
                    <button className='btn btn-primary' style={{"margin-left":"100px"}} onClick={() => settype(false)}>Agentss</button>
                    </div>
                   {type == true ? 
                   <div className="container-full">
                        {/* Main content */}
                        <div className="content-header">

                            <div className="d-flex align-items-center">

                                <div className="me-auto">
                                    <h3 className="page-title mb-5 pb-2">Users List</h3>


                                </div>

                            </div>
                            <hr />
                        </div>

                        <section className="content">
                            <div className="row">
                                <div className="col-lg-12 col-12">
                                    <div className='datalistbox' id='datalistboxid'>
                                        <form action="/action_page.php" method="get" id="dataformid">

                                            <form>
                                                <div className='forminner-left'>
                                                    <label className="form-label">
                                                        From
                                                    </label>
                                                    <input type="date" id="datepickerone1" name='from_date' value={form.from_date} onChange={inputHandler} placeholder='dd/mm/yy' required />
                                                    {/* <span>To</span> */}
                                                    <label className="form-label">
                                                        To
                                                    </label>
                                                    <input type="date" id="datepickertwo2" name='to_date' value={form.to_date} onChange={inputHandler} placeholder='dd/mm/yy' required />
                                                    <a href='#' onClick={getUsersListCustom}>Search</a>
                                                </div>
                                            </form>

                                        </form>
                                    </div>

                                    <div className="box">
                                        <div className="box-header with-border">
                                            <h4 className="box-title">Users ( {usersList.length} ) </h4>

                                            <div className='btnblock'>
                                                <button className='mainbutton' onClick={getUsersListReset}>Reset</button>
                                                <button className='mainbutton' onClick={getUsersListToday}>Today</button>
                                                <button className='mainbutton' onClick={getUsersListLastWeek}>Last Week</button>
                                                <button className='mainbutton' onClick={getUsersListlastMonth}> Month</button>
                                            </div>
                                        </div>
                                        <div className="box-body">

                                            {!loader ?
                                                <ReactDatatable
                                                    config={configForTable}
                                                    records={usersList}
                                                    columns={columns}
                                                />
                                                :
                                                <>
                                                    <br />
                                                    <br />
                                                    <center><h4><i className='fa fa-spinner fa-spin'></i> &nbsp; Please wait</h4></center>
                                                    <br />
                                                    <br />
                                                </>
                                            }

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>
                        {/* /.content */}
                        {/* /.content */}
                    </div> :  
                    <div className="container-full">
                        {/* Main content */}
                        <div className="content-header">

                            <div className="d-flex align-items-center">

                                <div className="me-auto">
                                    <h3 className="page-title mb-5 pb-2">Agents List</h3>


                                </div>

                            </div>
                            <hr />
                        </div>

                        <section className="content">
                            <div className="row">
                                <div className="col-lg-12 col-12">
                                    <div className='datalistbox' id='datalistboxid'>
                                        <form action="/action_page.php" method="get" id="dataformid">

                                            <form>
                                                <div className='forminner-left'>
                                                    <label className="form-label">
                                                        From
                                                    </label>
                                                    <input type="date" id="datepickerone1" name='from_date' value={form.from_date} onChange={inputHandler} placeholder='dd/mm/yy' required />
                                                    {/* <span>To</span> */}
                                                    <label className="form-label">
                                                        To
                                                    </label>
                                                    <input type="date" id="datepickertwo2" name='to_date' value={form.to_date} onChange={inputHandler} placeholder='dd/mm/yy' required />
                                                    <a href='#' onClick={getAgentsListCustom}>Search</a>
                                                </div>
                                            </form>

                                        </form>
                                    </div>

                                    <div className="box">
                                        <div className="box-header with-border">
                                            <h4 className="box-title">Agents ( {agentsList.length} ) </h4>

                                            <div className='btnblock'>
                                                <button className='mainbutton' onClick={getUsersListReset1}>Reset</button>
                                                <button className='mainbutton' onClick={getUsersListToday1}>Today</button>
                                                <button className='mainbutton' onClick={getUsersListLastWeek1}>Last Week</button>
                                                <button className='mainbutton' onClick={getUsersListlastMonth1}> Month</button>
                                            </div>
                                        </div>
                                        <div className="box-body">
                                            {console.log("agentsList",agentsList)}
                                        <ReactDatatable
                                                    config={configForTable1}
                                                    records={agentsList}
                                                    columns={columns1}
                                                />
                                            {/* {!loader ?
                                                
                                                :
                                                <>
                                                    <br />
                                                    <br />
                                                    <center><h4><i className='fa fa-spinner fa-spin'></i> &nbsp; Please wait</h4></center>
                                                    <br />
                                                    <br />
                                                </>
                                            } */}

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>
                        {/* /.content */}
                        {/* /.content */}
                    </div> }
                   
                </div>


                <Footer />

            </div>
        </>


    )

}
export default Users;