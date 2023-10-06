import React, { Component, useEffect, useState } from 'react'
// import config from '../config/config'
import toast, { Toaster } from 'react-hot-toast';
import { LoginAction } from '../Action/action';
import Cookies from 'js-cookie'
import config from '../coreFIles/config';
import { Input } from "antd";

const Login = () => {

  const [form, setForm] = useState({ username: '', password: '' });
  const [validatioError, setvalidatioError] = useState({});

  if (Cookies.get('loginSuccessPokerAgent')) {
    console.log("cookies", Cookies.get('loginSuccessPokerAgent'));
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

  // const passwordpaste = () => {
  //   $(document).ready(function () {
  //     $("#password").bind("paste", function (e) {
  //       e.preventDefault();
  //     });
  //   });
  // }

  const SubmitForm = async (e) => {
    e.preventDefault()
    const isValid = validate();
    if (!isValid) {

    }
    else {
      let res = await LoginAction(form);
      if (res.success) {
        toast.success(res.msg);
        Cookies.set('loginSuccessPokerAgent', JSON.stringify(res.data));
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
        {/* <div className="container h-p100"> */}
        <Toaster />
        {/* <div className="row align-items-center justify-content-md-center h-p100"> */}
        {/* <div className="col-12"> */}
        <div className="row justify-content-center ">
          <div className="col-lg-5 col-md-5 col-12">
            <div
              classname="rounded10 shadow-lg admin-login"
              style={{ marginLeft: 80, marginRight: 85, marginTop: 115 , 
                // background: "rgba(255, 255, 255, 0.25)" 
              }}
            >
              <div className="content-top-agile p-20 pb-0" style={{ marginTop: 300 }}>
                {/* <center class="loginLogo"><h1 style={{ color: "white" }}>MG POKER</h1>
                </center> */}

                <h2 style={{ color: "black" }}>Poker Agent Panel</h2>
                <h5 style={{ color: "white", paddingTop : 18 }}>Sign in to continue to Poker Panel.</h5>
              </div>
              <div className="px-40 py-10">
                <form action="" method="post">
                  <div className="form-group">
                    <div className="input-group ">
                      <span className="input-group-text"><i className="ti-user" /></span>
                      <input type="text" className="form-control ps-15 " placeholder="Username" onChange={inputHandler} name="username" value={form.username} />
                    </div>
                    <span className="validationErr">{validatioError.usernameError}</span>
                  </div>
                  <div className="form-group">
                    <div className="input-group ">
                      <span className="input-group-text"><i className="ti-lock" /></span>
                      <Input type="password" onPaste={(e) => {
                        e.preventDefault()
                        return false;
                      }} onCopy={(e) => {
                        e.preventDefault()
                        return false;
                      }} className="form-control ps-15 " onpaste="return false" placeholder="Password" onChange={inputHandler} name="password" value={form.password} />
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
                      <button type="submit" onClick={SubmitForm} className="btn btn-primary signbtn">SIGN IN</button>
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
        {/* </div> */}
        {/* </div> */}
        {/* </div> */}
      </div>

    </>
  )

}
export default Login;