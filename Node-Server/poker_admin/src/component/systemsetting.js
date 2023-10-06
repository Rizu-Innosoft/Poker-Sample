import React, { Component, useEffect, useState } from 'react'
// import config from '../config/config'
import config from '../coreFIles/config'
import Header from '../directives/header'
import Footer from '../directives/footer'
import Sidebar from '../directives/sidebar'
import {getSystemSettingAction , updateSystemSettingAction } from '../Action/action';
import toast, { Toaster } from "react-hot-toast";

const Systemsetting = () => {
    const [data, setdata] = useState()
    useEffect(() => {
        getsystemsetting()
    }, [])

     const getsystemsetting = async () => {
        let res = await getSystemSettingAction();
        if (res.success) {
         setdata(res.data)
         console.log(res.data);
        }
    }

    const updatesystemsetting = async (e) => {
        e.preventDefault();
        console.log("addlockingduration", data);
        let res = await updateSystemSettingAction(data);
        if (res.success) {
            toast.success(res.msg);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            toast.error(res.msg);
        }
    };

    

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setdata((old) => {
            return { ...old, [name]: value };
        });
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
                        <div className="content-header">
                            <div className="d-flex align-items-center">
                                <div className="me-auto">
                                    <h3 className="page-title mb-5 pb-2">Settings</h3>

                                </div>
                            </div>
                            <hr />
                        </div>
                        {/* Content Header (Page header) */}

                        {/* Main content */}
                        <section className="content">
                            <div className="row">
                                <div className="col-lg-12 col-12">
                                    <div className="box">
                                        <div className="box-header with-border">
                                            <h4 className="box-title mx-auto">Poker Management</h4>
                                        </div>
                                        <div className='row mt-20 mb-20'>
                                            <div className='row'>
                                                <div className='col-md-3'>
                                                </div>
                                                <div className='col-md-6'>
                                                    <form
                                                    onSubmit={updatesystemsetting}
                                                    >
                                                        <div class="form-group row mb-4">
                                                            <label class="col-form-label col-md-12">Rake Management (in %)</label>
                                                            <div class="col-md-12">
                                                                <input class="form-control" type="text" name="rake" value={data?.rake} onChange={inputHandler} onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} />
                                                            </div>
                                                        </div>
                                                        <div class="form-group row mb-4">
                                                            <label class="col-form-label col-md-12">Chip Management (1 chip = ${data?.chips} )</label>
                                                            <div class="col-md-12">
                                                                <input class="form-control" type="text" name="chips" value={data?.chips} onChange={inputHandler} onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} />
                                                            </div>
                                                        </div>
                                                        <div className='text-center'>
                                                            <button className='btn btn-primary updatebtn'>Update Now</button>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className='col-md-3'>
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
export default Systemsetting;