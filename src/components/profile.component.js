import React, { Component } from 'react';
import axios from 'axios';
import '../css/components.css'
import { toast } from 'react-toastify'
import Select from 'react-select'

export default class Profile extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: {},
            session: [],
            programme: [],
        }

        this.handleName = this.handleName.bind(this)
        this.handleProgramme = this.handleProgramme.bind(this)
        this.handleSession = this.handleSession.bind(this)
        this.handleIC = this.handleIC.bind(this)
        this.handleStudId = this.handleStudId.bind(this)
        this.submit = this.submit.bind(this)
    }

    componentWillMount(){
        // let user = JSON.parse(localStorage.getItem("user"))
        const user = JSON.parse(localStorage.getItem('user'))

        if(user == null){
            this.props.history.push('/Login')
            return
        }else{
            if(user.role == "staff"){
                this.props.history.push('/Announcement')
                return
            }
        }

        this.props.handlePage("profile")
        user.sessionDefault = {value: user.session, label: user.session}
        user.programmeDefault = {value: user.programme, label: user.programme}
        this.setState({user})

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

    handleName(e){
        let user = {...this.state.user}
        user.name = e.target.value
        this.setState({user})
    }

    handleProgramme(e){
        let user = {...this.state.user}
        user.programmeDefault = e
        user.programme = e.label
        this.setState({user})
    }
    
    handleSession(e){
        let user = {...this.state.user}
        user.sessionDefault = e
        user.session = e.label
        this.setState({user})
    }

    handleIC(e){
        let user = {...this.state.user}
        user.icNo = e.target.value
        this.setState({user})
    }

    handleStudId(e){
        let user = {...this.state.user}
        user.studId = e.target.value
        this.setState({user})
    }

    submit(e){
        e.preventDefault()
        console.log(this.state.user)
        axios.post('http://localhost:5000/users/update/' + this.state.user._id, this.state.user)
        .then((res) => {
            let user = {...this.state.user}
            if(!user.verified){
                user.verified = true
            }
            
            localStorage.setItem("user", JSON.stringify(user))
            this.props.handleUser(user)
            toast.success("Profile updated!", {theme:'colored'}) 
        })
        .catch(err => console.log(err))
    }

    render(){
        return(
            <div className="card card0 border-0">
                <h2>Profile Settings</h2>
                <i className="text-sm">Please fill in all the necessary fields to obtain verified status</i>
                <div className="line"></div><br></br>
                <div>
                <form onSubmit={this.submit}>
                    <div className="row mt-2">
                        <div className="col-md-6"><label className="labels">Name</label><input required onChange={this.handleName} type="text" defaultValue={this.state.user.name} className="form-control" placeholder="Full name" /></div>
                        <div className="col-md-6"><label className="labels">Email</label><input required type="text" className="form-control" disabled defaultValue={this.state.user.email}/></div>
                    </div>
                    <div class="row mt-3">
                        <div className="col-md-6">
                            <label className="labels">Programme</label>
                            <Select
                            className="basic-full"
                            isSearchable={true}
                            options={this.state.programme}
                            onChange={e => this.handleProgramme(e)}
                            value={this.state.user.programmeDefault}
                            placeholder="Choose a programme"
                            />
                            {/* <input required onChange={this.handleProgramme} defaultValue={this.state.user.programme} type="text" className="form-control" placeholder="Programme abbreviation (e.g. RIT)" /> */}
                        </div>

                        <div className="col-md-6">
                            <label className="labels">Session</label>
                            <Select
                            className="basic-full"
                            isSearchable={true}
                            options={this.state.session}
                            onChange={e => this.handleSession(e)}
                            placeholder="Choose a session"
                            value={this.state.user.sessionDefault}
                            />
                            {/* <input required onChange={this.handleSession} defaultValue={this.state.user.session} type="text" className="form-control" placeholder="Session number (e.g. 202009)" /> */}
                        </div>

                        <div className="col-md-6 mt-2"><label className="labels">IC No.</label><input required pattern="^\d{6}-\d{2}-\d{4}$" onChange={this.handleIC} defaultValue={this.state.user.icNo} type="text" className="form-control" placeholder="XXXXXX-XX-XXXX" /></div>
                        <div className="col-md-6 mt-2"><label className="labels">Student ID</label><input required pattern="^\d{2}[a-zA-Z]{3}\d{5}$" onChange={this.handleStudId} defaultValue={this.state.user.studId} type="text" className="form-control" placeholder="Student ID (e.g. 20PMR10000)"/></div>
                    </div>
                    <div className="mt-3"><button className="btn btn-primary profile-button" type="submit">Save Profile</button></div>
                </form>
                </div>
            </div>
        )
    }
}