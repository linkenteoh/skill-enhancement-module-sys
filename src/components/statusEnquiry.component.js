import React, { Component } from 'react';
import axios from 'axios';
import '../css/components.css'
import { toast } from 'react-toastify';

export default class StatusEnquiry extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: {},
            modules: [],
            certificate: [],
        }
    }

    componentWillMount(){
        this.props.handlePage("statusEnquiry")

        const user = JSON.parse(localStorage.getItem("user"))
        if(user == null){
            this.props.history.push('/Login')
            return
        }else{
            if(!user.verified){
                this.props.history.push('/Profile')
                toast.error("Verify your profile first", {theme:'colored'})
            }

            if(user.role == "staff"){
                this.props.history.push('/Announcement')
                return
            }
        }

        this.setState({user})

        axios.get('http://localhost:5000/results/certStatus/'+user._id)
        .then(res => {
            this.setState({modules: res.data})
        })

        axios.get('http://localhost:5000/users/getCertificate/'+user._id)
        .then(res => {
            console.log(res.data, "Hey")
            this.setState({certificate: res.data})
        })

    }
    
    render(){
        const certs = require.context('../certs', true);

        return(
            <div class="card card0 border-0">
                <h2>Certificate Status Enquiry</h2>
                <div class="line"></div><br></br>
                <div>
                    <div>
                        <h3>{this.state.user.name}</h3>
                        <div>
                            <i class="fas fa-envelope" style={{marginRight:"5px", color:"green"}}></i>                    
                            <span className="text-m" >{this.state.user.email}</span>
                        </div>
                        <div>
                            <i class="fas fa-user-graduate" style={{marginRight:"5px", color:"green"}}></i>
                            <span className="text-m">{this.state.user.programme}</span><br/><br/>
                        </div>
                    </div>

                    {this.state.modules.length == 0 ? (
                        <div>
                            <h6 style={{fontWeight:"normal" }}><i>You have no registered modules yet or maybe failed to achieve the minumun threshold grade for the assessment for at least 1 module.</i></h6><br/>
                            <div className="d-flex flex-column justify-content-center">
                                <div style={{ width: "v100", textAlign:"center"}}>
                                <img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} />
                                </div>
                                <span className="text-center">No records found.</span>
                            </div>
                        </div>
                    ):(
                        <div>
                            <h6 style={{fontWeight:"normal" }}><i>You have completed modules stated below and will be awarded a certificate as a proof of completion.</i></h6><br/>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                    <th scope="col">No.</th>
                                    <th scope="col">Module Title</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.modules.map((module, index) => (
                                        <tr>
                                            <td>{index+1}</td>
                                            <td>{module}</td>
                                        </tr>
                                    ))}
                                    
                                </tbody>
                            </table>
                            <div>
                                {this.state.certificate.length > 0 && <div>
                                    <h6>Congratulations! You have been awarded a certificate</h6>
                                    <a target="_blank" href={certs(`./${this.state.certificate[0]._id}.pdf`).default}>View Your Certificate (PDF)</a> 
                                </div>}
                            </div>
                            <br/>
                        </div>
                    )}
                    
                </div>
            </div>
        )
    }
}