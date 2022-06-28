import React, { Component } from 'react';
import axios from 'axios';
import Table from "../../table.component";
import { Link } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Moment from 'moment'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import Select from 'react-select';


export default class UserMaintenance extends Component{
    constructor(props){
        super(props)
        this.state = {
            students: [],
            staff: [],
            loading: true,

            session: [],
            programme: [],
        }

        this.deleteStaff = this.deleteStaff.bind(this)
        this.deleteStud = this.deleteStud.bind(this)
        this.addStaff = this.addStaff.bind(this)
        this.addProgramme = this.addProgramme.bind(this)
        this.addSession = this.addSession.bind(this)
    }

    componentWillMount(){
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
        
        this.props.handlePage("userMaintenance")
        axios.get('http://localhost:5000/users/')
        .then(res => {
            let tempArray = [...res.data]
            let students = tempArray.filter(u => u.role == "student")
            let staff = tempArray.filter(u => u.role == "staff")

            this.setState({students, staff, loading: false})
        })

        axios.get('http://localhost:5000/userSettings/getSessions')
        .then(res => {
            let tempArr = []
            res.data.forEach(session => {
                let tempObj = {}
                tempObj.value = session._id
                tempObj.label = session.session
                tempArr.push(tempObj)
            })

            this.setState({session: tempArr})
        })
        .catch(err => console.log('Err' + err))

        axios.get('http://localhost:5000/userSettings/getProgrammes')
        .then(res => {
            let tempArr = []
            res.data.forEach(programme => {
                let tempObj = {}
                tempObj.value = programme._id
                tempObj.label = programme.programme
                tempArr.push(tempObj)
            })

            this.setState({programme: tempArr})
        })
        .catch(err => console.log('Err' + err))
    }
    
    deleteStaff(id){
        Swal.fire({
            title: 'Are you sure?',
            html: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('http://localhost:5000/users/'+id)
                .then(res => {
                    console.log(res.data)
                    let staff = [...this.state.staff]
                    staff = staff.filter(s => s._id != id)
                    this.setState({staff})
                    toast.success("Staff deleted successfully", {theme:'colored'})
                })
                .catch(err => {
                    toast.error("Some errors occured!", {theme:'colored'})
                })
            }
          })
    }

    deleteStud(id){
        Swal.fire({
            title: 'Are you sure?',
            html: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                if (result.isConfirmed) {
                    axios.delete('http://localhost:5000/users/'+id)
                    .then(res => {
                        console.log(res.data)
                        let students = [...this.state.students]
                        students = students.filter(s => s._id != id)
                        this.setState({students})
                        toast.success("Student deleted successfully", {theme:'colored'})
                    })
                    .catch(err => {
                        toast.error("Some errors occured!", {theme:'colored'})
                    })
                }
            }
          })
    }

    async addStaff(){
        const { value: formValues } = await Swal.fire({
            title: 'Create new staff account',
            html:
              '<input placeholder="Email address" id="swal-input1" class="swal2-input">' +
              '<input type="password" placeholder="Password" id="swal-input2" class="swal2-input">' +
              '<input type="password" placeholder="Confirm Password" id="swal-input3" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value
              ]
            }
          })
          
          if (formValues) {
            console.log(formValues)
            if(formValues[0] == "" && formValues[1] == "" && formValues[2] == ""){
                toast.error("Please enter all required fields", {theme:'colored'})
            }else if(formValues[0] == ""){
                toast.error("Please enter an email address", {theme:'colored'})
            }else if(formValues[1] ==""){
                toast.error("Please enter password", {theme:'colored'})
            }else if(formValues[2] == ""){
                toast.error("Please enter confirm password", {theme:'colored'})
            }else{
                if(formValues[1] != formValues[2]){
                    toast.error("Password do not match!", {theme:'colored'})
                    return
                }
                let email = formValues[0]
                let password = formValues[1]

                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let isEmailValid = re.test(email)

                if(!isEmailValid){
                    toast.error("Email entered is invalid!", {theme:'colored'})
                    return
                }

                if(password.length < 6){
                    toast.error("Password should consist of at least 6 characters", {theme:'colored'})
                    return
                }

                try {
                    const config = {
                        header: {
                            "Content-Type": "application/json",
                        },
                    };

                    const { data } = await axios.post(
                      "/api/auth/register",
                      {
                        email,
                        password,
                        role: 'staff',
                      },
                      config
                    );
                    console.log(data.user)
                    if(data){
                        let staff = [...this.state.staff]
                        staff.push(data.user)
                        this.setState({staff})
                    }
                    toast.success("Staff added successfully", {theme:'colored'})
                } catch (error) {
                    if(error){
                        toast.error(error.response.data.error, {theme:'colored'})
                    }
                }                
            }
          }

    }

    async addProgramme(){
        const { value: formValues } = await Swal.fire({
            title: 'New Programme',
            html:
                '<input type="text" placeholder="e.g. RIT" id="swal-input1" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                document.getElementById('swal-input1').value,
                ]
            }
        })
          
        if (formValues) {
            if(formValues[0].length != 3){
                return toast.error('Programme abbrevation should consist of 3 alphabets only!', {theme:'colored'})
            }

            var matches = formValues[0].match(/\d+/g);

            if(matches){
                return toast.error('Programme abbrevation should not consist any numeric numbers!', {theme:'colored'})
            }

            let programme = {
                programme: formValues[0]
            }
            axios.post('http://localhost:5000/userSettings/addProgramme', programme)  
            .then(res => {
                toast.success('New programme added', {theme:'colored'})
                
                let tempArr = [...this.state.programme]

                let tempObj = {}
                tempObj.value = res.data._id
                tempObj.label = res.data.programme
                tempArr.push(tempObj)
                
                this.setState({programme: tempArr})

            })
            .catch(err => console.log(err))
        }
    }

    async addSession(){
        const { value: formValues } = await Swal.fire({
            title: 'New Session',
            html:
                '<input type="text" placeholder="e.g. 202009" id="swal-input1" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                document.getElementById('swal-input1').value,
                ]
            }
        })
          
        if (formValues) {
            if(formValues[0].length != 6){
                return toast.error('Session number should consist of 6 numbers only!', {theme:'colored'})
            }

            var matches = formValues[0].match(/[a-zA-z]+/g);

            if(matches){
                return toast.error('Session number should not consist of any letters!', {theme:'colored'})
            }

            let session = {
                session: formValues[0]
            }
            axios.post('http://localhost:5000/userSettings/addSession', session)  
            .then(res => {
                toast.success('New session added', {theme:'colored'})
                
                let tempArr = [...this.state.session]

                let tempObj = {}
                tempObj.value = res.data._id
                tempObj.label = res.data.session
                tempArr.push(tempObj)
                
                this.setState({session: tempArr})

            })
            .catch(err => console.log(err))
        }
    }
    
    render(){
        const columns = [
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Status',
                accessor: 'verified',
                sortType: 'basic',
                Cell: ({ cell }) => {
                    if(cell.row.values.verified){
                        return (<span className="btn-published">Verified</span>)
                    }else{
                        return (<span className="btn-unpublished">Unverified</span>)
                    }
                }
            },
            {
                Header: 'Action',
                accessor: '_id',
                disableSortBy: true,                    
                Cell: ({ cell }) => {
                    return (
                    <div>
                        <Link title="Edit" to={"/User Maintenance/Edit User/"+cell.row.values._id}><i class="fas fa-edit" style={{marginRight:"15px"}}></i></Link>
                        <i class="fas fa-trash fa-edit" onClick={() => this.deleteStud(cell.row.values._id)} title="Delete"></i>
                    </div>
                    
                    )
                }
            },
        ]

        const columns_staff = [
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Created At',
                accessor: 'createdAt',
                sortType: 'basic',
                Cell: ({ cell }) => {
                    return Moment(cell.row.values.createdAt)
                      .local()
                      .format("dddd, DD MMM YY")          
                  }
            },
            {
                Header: 'Action',
                accessor: '_id',
                disableSortBy: true,                    
                Cell: ({ cell }) => {
                    return (
                    <div>
                        <i class="fas fa-trash fa-edit" onClick={() => this.deleteStaff(cell.row.values._id)} title="Delete"></i>
                    </div>
                    
                    )
                }
            },
        ]

        if(this.state.loading){
            return(
                <div className="card card0 border-0">
                  <h2>User maintenance</h2>
                  <div class="line"></div><br></br>
                  <div style={{textAlign:"center"}}><img src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                </div>
              )
        }else{
            return(
                <div class="card card0 border-0">
                    <h2>User Maintenance</h2>
                    <div class="line"></div><br></br>
                    <div>
                        <Tabs
                            defaultActiveKey="student"
                            transition={false}
                            id="noanim-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="student" title="Student">
                                <Table columns={columns} data={this.state.students}></Table>
                            </Tab>

                            <Tab eventKey="staff" title="Staff">
                                <button onClick={this.addStaff} className="module-btn btn btn-primary">Add Staff</button>
                                <Table columns={columns_staff} data={this.state.staff}></Table>
                            </Tab>

                            <Tab eventKey="setting" title="User Settings">
                                <div className="d-flex">
                                    <div className="col-md-6">
                                        <label>Programme</label>
                                        <div className="d-flex">
                                            <Select
                                            className="basic-single"
                                            isSearchable={true}
                                            options={this.state.programme}
                                            // onChange={e => this.handleModule(e)}
                                            placeholder="All programmes.."
                                            />
                                            <button onClick={this.addProgramme} style={{marginLeft:"5px"}} className="btn btn-primary">New programme</button>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Session</label>
                                        <div className="d-flex">
                                            <Select
                                            className="basic-single"
                                            isSearchable={true}
                                            options={this.state.session}
                                            // onChange={e => this.handleModule(e)}
                                            placeholder="All sessions.."
                                            />
                                            <button onClick={this.addSession} style={{marginLeft:"5px"}} className="btn btn-primary">New session</button>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>

                    </div>
                </div>
            )
        }
    }
}