import React, { Component } from 'react';
import axios from 'axios';
import './moduleDetails.css'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import moment from 'moment'


export default class ModuleDetails extends Component{
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            module: {},
            withinDate: null,
            start: null,
            end: null,
        }
        this.registerModule = this.registerModule.bind(this);
    }

    componentWillMount(){
        let user = JSON.parse(localStorage.getItem("user"))
        if(user == null){
            this.props.history.push('/Login')
            return
        }else{
            if(user.role == "staff"){
                this.props.history.push('/Announcement')
                return
            }
        }

        this.props.handlePage("course")
        axios.get("http://localhost:5000/courses/"+this.props.match.params.id)
            .then((res) => {
                let module = {...res.data}

                let start = moment(module.startDate).local()
                let end = moment(module.endDate).local()
                let test = moment(new Date()).isBetween(start, end)

                this.setState({module, isLoading: false, withinDate: test, start, end})                
            })
    }

    registerModule(){
        Swal.fire({
            title: 'Are you sure?',
            html: "<small>By submitting this registration form, I agreed to attend all the live sessions of the module.</small>",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                const user = JSON.parse(localStorage.getItem("user"));
                
                if(user.verified){
                    console.log(user._id);
                    var registration = {
                        course: this.state.module,
                        user: user,
                    }
                    console.log(this.state.module._id, user._id);
                    axios.post("http://localhost:5000/registrations/checkRegistered", {course: this.state.module._id, user: user._id})
                        .then((res) => {
                            console.log(res);

                            if(res.data.length === 0){
                                axios.post("http://localhost:5000/registrations/add", registration)
                                    .then((res) => {
                                        toast.success("You have successfully registered this module.", {theme:"colored"})
                                        this.props.history.push('/Module/Module Details/'+this.state.module._id)
                                    })
                                    .catch(err => console.log(err))
                            }else{
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    confirmButtonColor: '#3085d6',
                                    text: 'You have already registered this module!',
                                })
                            }
                        })
                }else{
                    toast.error("Please verify your profile first", {theme:'colored'})
                    this.props.history.push('/Profile')
                }
                
            }
          })
    }
    
    render(){
        if(this.state.isLoading){
            return(
                <div class="card card0 border-0">
                    <h3>Module Details</h3>
                    <div class="line"></div><br></br>
                    <div style={{textAlign:"center"}}><img className="img-fluid" src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                </div>
            )
        }else{
            return(
                <div class="card card0 border-0">
                    <div>
                        <h3>Module Details</h3>
                        <i className="text-sm">Registration starts from {this.state.start.format("dddd, DD MMM YY")} until {this.state.end.format("dddd, DD MMM YY")} </i>
                    </div>
                    <div class="line"></div><br></br>
                    <div>
                        <h2 className="courseTitle">{this.state.module.courseTitle}</h2><br/>
                        <label>Module overview:</label>
                        <div>
                            <textarea  style={{height:"100px"}} value={this.state.module.courseOverview} disabled></textarea>
                        </div>

                        <label>Objectives:</label>
                        {this.state.module.courseObjectives.map((obj) => (
                            <li>{obj}</li>
                        ))}<br/>
                        
                        <div className="d-flex justify-content-between threshold">
                            <i className="text-sm">Minumum threshold needs to be achieved in order to pass the module only then a certificate will be awarded.</i>
                           
                            {this.state.withinDate == true ? (<button className="btn btn-primary" onClick={this.registerModule}>Register</button>):(<div>
                                <button disabled className="btn btn-primary">Register</button>
                            </div>) }
                        </div>
                    </div>
                </div>
            )
        }
    }
}
