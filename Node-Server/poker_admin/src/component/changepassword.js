import React, { useEffect, useState } from 'react';
import Header from '../directives/header';
import Footer from '../directives/footer';
import Sidebar from '../directives/sidebar';
import { changePasswordAction } from '../Action/action';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
const loginData = (!Cookies.get('loginSuccessPokerAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessPokerAdmin'));

const Changepassword = () => {

    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    const inputHandler = async (e) => {
        const { name, value } = e.target
        setForm((old) => {
            return { ...old, [name]: value }
        })
      }

    function validate() {
    
        if (form.currentPassword === '') {
            toast.error("Current password is required");
            return false;
        }
        if (form.newPassword === '') {
            toast.error("New password is required");
            return false;
        }
        if (form.confirmPassword === '') {
            toast.error("Confirm password is required");
            return false;
        }
        if (form.newPassword != form.confirmPassword) {
            toast.error("Confirm password dose not match");
            return false;
        }
        return true;
    }
     
    const SubmitForm = async (e) => {
        e.preventDefault()
        const isValid = validate();
        if (!isValid) {
    
        }
        else {
            form.username = loginData.username;
            let res = await changePasswordAction(form);
            if (res.success) {
                toast.success(res.msg);
                setForm((old) => {
                    return { ...old, 'currentPassword': '', 'newPassword':'', 'confirmPassword':'' }
                })
            } else {
                toast.error(res.msg);
            }
        }
    }

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
                                    <h3 className="page-title mb-5 pb-2">Change password</h3>
                                   
                                </div>
                            </div>
                            <hr/>
                        </div>
                        {/* Content Header (Page header) */}

                        {/* Main content */}
                        <section className="content">
                            <div className="row">
                                <div className="col-lg-12 col-12">
                                    <div className="box">
                                    <div className="box-header with-border">
                                            <h4 className="box-title mx-auto">Change password</h4>
                                        </div>
                                        <div className='row mt-20 mb-50'>
                                            <div className='row'>
                                                <div className='col-md-3'>

                                                </div>
                                                <div className='col-md-6'>
                                                <div class="form-group row mb-1">
                                                <label class="col-form-label col-md-12">Old Password</label>
                                                <div class="col-md-12">
                                                    <input class="form-control" type="password" name="currentPassword" value={form.currentPassword} placeholder="Enter current password" onChange={inputHandler} />
                                                </div>
                                            </div>
                                            <div class="form-group row mb-1">
                                                <label class="col-form-label col-md-12">New Password </label>
                                                <div class="col-md-12">
                                                    <input class="form-control" type="password" name="newPassword" value={form.newPassword}  placeholder="Enter new password" onChange={inputHandler} />
                                                </div>
                                            </div>
                                            <div class="form-group row mb-4">
                                                <label class="col-form-label col-md-12">Confirm Password</label>
                                                <div class="col-md-12">
                                                    <input class="form-control" type="password" name="confirmPassword" value={form.confirmPassword} placeholder="Enter confirm password" onChange={inputHandler} />
                                                </div>
                                            </div>
                                           
                                            <div className='text-center'>
                                                <button type="submit" onClick={SubmitForm} className='btn btn-primary changebtn'>Change Password</button>
                                            </div>

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
export default Changepassword;