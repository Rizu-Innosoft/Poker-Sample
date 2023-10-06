import React, { useEffect, useState } from 'react'
import config from '../coreFIles/config'
import Header from '../directives/header'
import Footer from '../directives/footer'
import Sidebar from '../directives/sidebar'
import ReactDatatable from '@ashvin27/react-datatable'
import { getSubscriberListAction } from '../Action/action';
import Swal from 'sweetalert2';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const Subscribers = () => {

    const [subscriberList, setSubscriberList] = useState({});

    useEffect(() => {
        getSubscriberList();
      }, []);
  
      const getSubscriberList = async () => {
          let res = await getSubscriberListAction();
          if (res.success) {
            setSubscriberList(res.data)
          }
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
            key: "email",
            text: "Email",
            cell: (item) => {
                return (
                    <>
                     {item.email}
                    &nbsp; <CopyToClipboard text={item.email}>
                        <sapn title="Click to Copy" className="mr-copylink" id="token-buy-button" onClick={copieBtn} style={{ cursor: "pointer", color:'rgb(157 81 255)' }}>
                        <i class="fa fa-copy "></i></sapn></CopyToClipboard>
                    </>
                );
            }
        },
        {
          key: "date",
          text: "Date",
          cell: (item) => {
              return (
                `${moment(item.created_date).format('DD/MM/YYYY')}`
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

    return (

        <>
            <div class="wrapper">
                {/* <div id="loader"></div> */}
                <Toaster/>
                <Header />
                <Sidebar />
                <div className="content-wrapper">
                    <div className="container-full">
                        {/* Main content */}
                        <div className="content-header">
                            <div className="d-flex align-items-center">
                                <div className="me-auto">
                                    <h3 className="page-title mb-5 pb-2">Subscribers List</h3>

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
                                            <h4 className="box-title">Subscribers List</h4>
                                        </div>
                                        <div className="box-body">
                                           
                                            <ReactDatatable
                                                config={configForTable}
                                                records={subscriberList}
                                                columns={columns}
                                            />
                                            
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>
                        {/* /.content */}
                        {/* /.content */}
                    </div>
                </div>

                <Footer />
            </div>
        </>


    )

}
export default Subscribers;