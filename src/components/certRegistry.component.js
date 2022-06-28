import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/components.css'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { toast } from 'react-toastify'

export default class CertRegistry extends Component{
    constructor(props){
        super(props)
        this.state = {
            certID: "",
        }

        this.handleID = this.handleID.bind(this)
        this.verify = this.verify.bind(this)
    }

    componentDidMount(){
        this.props.handlePage("certRegistry")
        console.log(this.props.role);
    }
    
    handleID(e){
        this.setState({certID: e.target.value})
    }

    verify(){
        if(!this.state.certID){
            return toast.error("Please enter a certificate ID!", {theme:'colored'})
        }else{
            if(this.state.certID.length != 6){
                return toast.error("The format of certificate ID entered is wrong!", {theme:'colored'})
            }

            axios.get("http://localhost:5000/users/certs/"+this.state.certID)
            .then(res => {
                if(res.data == null){
                    return toast.error("No certificate found with given ID!", {theme:'colored'})
                }
                let url = "/certCheck/"+this.state.certID
                window.open(url, "_blank")
            })
            .catch(err => console.log("Err" + err))
        }
        
        // this.props.history.push('/certCheck/'+this.state.certID)
    }

    render(){
        return(
            <div class="card card0 border-0">
                <h2>Certificates Registry</h2>
                <i className="text-sm">This page is mainly used to verify certificates issued to graduates.</i>
                <div class="line"></div><br></br>
                <div>
                    <h5>Please enter the certificate ID</h5>
                    <div className="d-flex">
                        <input style={{width:"30%", marginRight:"15px"}} onChange={this.handleID} value={this.state.certID} className="form-control"></input>
                        <button onClick={this.verify} style={{height:'35px', marginTop:'3px'}} className="btn btn-primary">Verify</button>
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                                <div style={{ width: "v100", textAlign:"center"}}>
                                <div><img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} /></div>
                                </div>
                    </div>
                </div>
            </div>
        )
    }
}