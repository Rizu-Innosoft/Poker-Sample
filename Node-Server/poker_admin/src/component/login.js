import React, { Component, useEffect, useState } from 'react'
// import config from '../config/config'
import toast, { Toaster } from 'react-hot-toast';
import { LoginAction } from '../Action/action';
import Cookies from 'js-cookie'
import config from '../coreFIles/config';

const Login = () => {

  const [form, setForm] = useState({ username: '', password: '' });
  const [validatioError, setvalidatioError] = useState({});

  if (Cookies.get('loginSuccessPokerAdmin')) {
    console.log("cookies",Cookies.get('loginSuccessPokerAdmin'));
    window.location.href = `${config.baseUrl}dashboard`;
  }

  const inputHandler = async (e) => {
    const { name, value } = e.target
    setForm((old) => {
        return { ...old, [name]: value }
    })
  }

  function validate() {
    let usernameError = "";
    let passwordError = "";

    if (form.username === '') {
      usernameError = "Username is required."
    }
    if (form.password === '') {
        passwordError = "Password is required."
    }
    if (usernameError || passwordError) {
        setvalidatioError({
          usernameError, passwordError
        })
        return false
    } else {
        return true
    }
}

const SubmitForm = async (e) => {
    e.preventDefault()
    const isValid = validate();
    if (!isValid) {

    }
    else {
        let res = await LoginAction(form);
        if (res.success) {
            toast.success(res.msg);
            Cookies.set('loginSuccessPokerAdmin', JSON.stringify(res.data));
            setTimeout(() => {
                window.location.href = `${config.baseUrl}dashboard`;
            }, 1200);
        } else {
            toast.error(res.msg);
        }
    }
}

  return (
  
    <>
      <div class="hold-transition theme-primary bg-img ">
        <div className="container h-p100">
        <Toaster />
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="rounded10 shadow-lg admin-login">
                    <div className="content-top-agile p-20 pb-0">
                  <center class="loginLogo"><h1>MG POKER</h1></center>
                     
                      <h2 className="text-white">Poker Admin Panel</h2>
                      <p className="mb-0">Sign in to continue to Poker Panel.</p>
                    </div>
                    <div className="p-40">
                      <form action="" method="post">
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <span className="input-group-text"><i className="ti-user" /></span>
                            <input type="text" className="form-control ps-15 " placeholder="Username" onChange={inputHandler} name="username" value={form.username} />
                          </div>
                            <span className="validationErr">{validatioError.usernameError}</span>
                        </div>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <span className="input-group-text"><i className="ti-lock" /></span>
                            <input type="password" className="form-control ps-15 " placeholder="Password" onChange={inputHandler} name="password" value={form.password} />
                          </div>
                            <span className="validationErr">{validatioError.passwordError}</span>
                        </div>
                        <div className="row">
                          {/* <div className="col-6">
                            <div className="checkbox">
                              <input type="checkbox" id="basic_checkbox_1" />
                              <label htmlFor="basic_checkbox_1">Remember Me</label>
                            </div>
                          </div> */}
                          {/* /.col */}
                          {/* <div className="col-12">
                            <div className="fog-pwd text-end">
                              <a href="javascript:void(0)" className="hover-warning"><i className="ion ion-locked" /> Forgot pwd?</a><br />
                            </div>
                          </div> */}
                          {/* /.col */}
                          <div className="col-12 text-center">
                            <button type="submit" onClick={SubmitForm} className="btn btn-primary signbtn mt-10">SIGN IN</button>
                          </div>
                          {/* /.col */}
                        </div>
                      </form>
                      {/* <div className="text-center">
                        <p className="mt-15 mb-0">Don't have an account? <a href="auth_register.html" className="text-warning ms-5">Sign Up</a></p>
                      </div> */}
                    </div>
                  </div>
                  {/* <div className="text-center">
                    <p className="mt-20 text-white">- Sign With -</p>
                    <p className="gap-items-2 mb-20">
                      <a className="btn btn-social-icon btn-round btn-facebook" href="#"><i className="fa fa-facebook" /></a>
                      <a className="btn btn-social-icon btn-round btn-twitter" href="#"><i className="fa fa-twitter" /></a>
                      <a className="btn btn-social-icon btn-round btn-instagram" href="#"><i className="fa fa-instagram" /></a>
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )

}
export default Login;