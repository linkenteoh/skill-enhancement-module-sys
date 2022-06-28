import React, { Component, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import '../css/components.css'
import Select from 'react-select';
import Table from './table.component'
import Swal from 'sweetalert2'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { toast } from 'react-toastify'
import SweetAlert from 'react-bootstrap-sweetalert'


export default class CertIssuance extends Component{
    constructor(props){
        super(props)
        this.state = {
            initialLoading: true,

            sessions: [],
            sessionSelected: null, 

            studList: [],

            issuedList: [],

            generating: false,
            currentIndex: 0,
            constLength: null,
        }

        this.handleSession = this.handleSession.bind(this)
        this.newTab = this.newTab.bind(this)
        this.excludeStudent = this.excludeStudent.bind(this)
        this.generateCert = this.generateCert.bind(this)
        this.viewCert = this.viewCert.bind(this)
    }

    componentWillMount(){
        this.props.handlePage("certIssuance")

        let user = JSON.parse(localStorage.getItem("user"))
        if(user == null){
            this.props.history.push('/Login')
            return
        }else{
            if(user.role != "staff"){
                this.props.history.push('/Announcement')
                return
            }
        }

        

        axios.get("http://localhost:5000/users/getSessions")
        .then((res) => {
            let sessions = []
            res.data.forEach(s => {
                let session = {}
                session.label = session.value = s
                sessions.push(session)
            })
            this.setState({sessions, initialLoading: false})
        })
    }

    handleSession(e){
        this.setState({sessionSelected: e.value})
        // axios.get("http://localhost:5000/users/list/"+e.value)
        // .then((res) => { 
        //     this.setState({studList: res.data})
        // })
        // .catch(err => {console.log(err)})


        axios.get('http://localhost:5000/users/certificate/'+e.value)
        .then(res => {
            this.setState({issuedList: res.data})

            axios.get("http://localhost:5000/users/list/"+e.value)
            .then((res) => {
                this.setState({studList: []})
                let tempArray = [...res.data] 
                let issuedList = [...this.state.issuedList]

                console.log(tempArray, issuedList)


                let filteredArray  = tempArray.filter(function(array_el){
                    return issuedList.filter(function(anotherOne_el){
                       return array_el._id == anotherOne_el._id;
                    }).length == 0
                 });

                let finalArray = []
                var counter = 0;
                
                filteredArray.forEach(s => {
                    axios.get('http://localhost:5000/results/certStatus/'+s._id)
                    .then(res => {
                        var modules = res.data
                        if(modules.length > 0){
                            // finalArray.push(s)
                            counter++
                            let tmpArray = [...this.state.studList]
                            tmpArray.push(s)
                            this.setState({studList: tmpArray, constLength: counter})
                        }
                    })
                })
                
                console.log(this.state.studList)

                // this.setState({studList: finalArray, constLength: finalArray.length})
            })
            .catch(err => {console.log(err)})

        })
        .catch(err => {console.log(err)})

    }

    newTab(value){
        // const url = "/Certificate Issuance/Certificate Status/"+value
        this.props.history.push('/Certificate Issuance/Certificate Status/'+value)
        // window.open(url, '_blank')
    }

    excludeStudent(value){
        Swal.fire({
            title: 'Are you sure?',
            text: "This student will be removed from the list temporarily.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
          }).then((result) => {
            if (result.isConfirmed) {
                let studList = [...this.state.studList]
                studList = studList.filter(s => s._id != value)
                this.setState({studList})
            }
        })
    }
    
    viewCert(id){
        const certs = require.context('../certs', true);

        axios.get('http://localhost:5000/users/getCertificate/'+id)
        .then(res => {
            console.log(res.data)
            const url = certs(`./${res.data[0]._id}.pdf`).default
            window.open(url, '_blank')
        })
        .catch(err => {
            alert('Some errors occured!' + err)
        })
        

    }

    async generateCert(){
        Swal.fire({
            title: 'Are you sure?',
            text: "Certificates will be issued to all students in the list.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                console.log(this.state.studList)
                this.setState({generating: true})
                let studList = [...this.state.studList]
                var listLength = studList.length
                var counter = 0



                const promise = new Promise((resolve, reject) => {
                    studList.forEach(async s => {
                        const { data } = await axios.get('http://localhost:5000/results/certStatus/'+s._id) //StudID
                        let modules = ""
                        data.forEach(m => modules = modules.concat(`<li>${m}</li>`))
    
                        let certDetails = {
                            user: s,
                            modules,
                            arrayModules: data,
                        }
    
                        // const data1 = await axios.post("http://localhost:5000/users/generateCert", certDetails)
                        // console.log(data1.data, "HERE")
    
                        axios.post("http://localhost:5000/users/generateCert", certDetails)
                        .then(async (res) => {
                            this.setState({generating: true})
                            console.log(res.data)
                            counter++
                            let studList = [...this.state.studList]
                            let issuedList = [...this.state.issuedList]
    
                            studList = studList.filter(u => u._id != s._id)
                            issuedList.push(s)
    
                            this.setState({studList, issuedList})
                            if(counter == listLength){
                                resolve("AllGenerated")
                                // this.setState({generating: false})
                                // toast.success(listLength+" Certificate generated and sent to their respective email.", {theme:'colored'})
                            }
                        })
                        .catch(err => {
                            // counter++
                            // if(counter == listLength){
                            //     this.setState({generating: false})
                            // }
                            reject()
                            console.log( {err} , "ERROR OCCURED!")
                        })
                    })
                })

                toast.promise(
                    promise,
                    {
                      pending: 'Certificate is being generated and it may take awhile to deploy the certificate to blockchain network.',
                      success: `${listLength} Certificate generated and sent to their respective email.`,
                      error: 'Promise rejected 🤯'
                    },
                    {theme:'colored'}
                )
            }
        })
    }

    render(){
        const certs = require.context('../certs', true);
        
        const columns = [
            {
                Header: "Name",
                accessor: 'name',
            },
            {
                Header: "Email",
                accessor: 'email',
            },
            {
                Header: "Programme",
                accessor: 'programme'
            },
            {
                Header: "Action",
                accessor: '_id',
                Cell: ({ cell }) => {
                    return (
                      <div>
                        <i class="fas fa-stamp fa-edit" onClick={() => this.newTab(cell.row.values._id)} style={{marginRight:"15px"}} title="View certificate status"></i>
                        <i class="fas fa-user-times fa-edit" onClick={() => this.excludeStudent(cell.row.values._id)} title="Excluse student"></i>
                      </div>
                    )
                  }
            }
        ]

        const issued_columns = [
            {
                Header: "Name",
                accessor: 'name',
            },
            {
                Header: "Email",
                accessor: 'email',
            },
            {
                Header: "Programme",
                accessor: 'programme'
            },
            {
                Header: "Action",
                accessor: '_id',
                Cell: ({ cell }) => {
                    return (
                      <div>
                        <span className="view-cert" onClick={() => this.viewCert(cell.row.values._id)}>View Certificate (PDF)</span>
                      </div>
                    )
                  }
            }
        ]
        if(this.state.initialLoading){
            return(
                <div className="card card0 border-0">
                <h2>Certificates Issuance</h2>
                <div class="line"></div><br></br>
                <div style={{textAlign:"center"}}><img src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                </div>
            )
        }else{
            return(
                <div class="card card0 border-0">
                    {/* {this.state.generating &&
                    <SweetAlert custom customIcon="https://c.tenor.com/5o2p0tH5LFQAAAAi/hug.gif" title="Generating Certificate..." showConfirm={false}>Certificate is being generated and it may take awhile to deploy the certificate to blockchain network.</SweetAlert>
                    } */}

                    <h2>Certificates Issuance</h2>
                    <div class="line"></div><br></br>
                    <div>
                        <Select
                        className="basic-single"
                        isSearchable={true}
                        options={this.state.sessions}
                        onChange={e => this.handleSession(e)}
                        placeholder="Select session..."
                        />
                        <i className="text-sm">Student list will be retrieved from session selected. Only students that have completed and passed at least 1 module will be shown here.</i>
                        <br/>
                        <br/>
                        {this.state.sessionSelected != null ? (
                        <div>
                            <Tabs
                                defaultActiveKey="list"
                                transition={false}
                                id="noanim-tab-example"
                                className="mb-3"
                            >
                                <Tab eventKey="list" title="Student List">
                                    {this.state.studList.length > 0 ? (
                                        <div>
                                            <button onClick={this.generateCert} className="btn btn-primary module-btn">Generate certificate</button>
                                            <Table columns={columns} data={this.state.studList}></Table>
                                        </div>
                                    ):(
                                        <div className="d-flex flex-column justify-content-center">
                                            <div style={{ width: "v100", textAlign:"center"}}>
                                            <img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} />
                                            </div>
                                            <span className="text-center">No pending students to be awarded a certificate.</span>
                                        </div>
                                    )}
                                    
                                </Tab>
                                <Tab eventKey="issued" title="Issued">
                                    {this.state.issuedList.length > 0 ? (
                                        <Table columns={issued_columns} data={this.state.issuedList}></Table>
                                    ):(
                                        <div className="d-flex flex-column justify-content-center">
                                            <div style={{ width: "v100", textAlign:"center"}}>
                                            <img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} />
                                            </div>
                                            <span className="text-center">No issued certificate yet.</span>
                                        </div>
                                    )}
                                </Tab>
                            </Tabs>
                        </div>): (
                            <div className="d-flex flex-column justify-content-center">
                                <div style={{ width: "v100", textAlign:"center"}}>
                                <img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} />
                                </div>
                                <span className="text-center">Please choose a session first</span>
                            </div>
                        )}
                    </div>
                </div>
            )
        }
        
    }
}