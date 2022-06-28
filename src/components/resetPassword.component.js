import React, { Component } from 'react';
import axios from 'axios';
import '../css/components.css'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


export default class ResetPassword extends Component{
    constructor(props){
        super(props)
        this.state = {
            password: "",
            confirmPassword: "",
        }

        this.resetHandler = this.resetHandler.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    }
    

    componentWillMount(){
        // if(localStorage.getItem("authToken")){
        //     this.props.history.push('/Announcement')
        // }
        this.props.handlePage("login")
    }

    onChangePassword(e){
        this.setState({password: e.target.value})
    }

    onChangeConfirmPassword(e){
        this.setState({confirmPassword: e.target.value})
    }

    resetHandler = async (e) => {
        e.preventDefault();
        const config = {
            header: {
              "Content-Type": "application/json",
            },
        };
               
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({password: "", confirmPassword: ""})
            return toast.error("Password do not match", {theme:'colored'})
          }
      
          try {
            const password = this.state.password
            const { data } = await axios.put(
              `/api/auth/resetpassword/${this.props.match.params.resetToken}`,
              {
                password,
              },
              config
            );
              
            if(data){
                this.props.history.push('/Login')
                toast.success(data.data, {theme:'colored'})
            }
            console.log(data);
          } catch (error) {
            console.log(error.response)
            toast.error(error.response.data.error, {theme:'colored'})
          }

    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        })
    }
    
    render(){
        return(
            <div class="card card0 border-0">
                    <div class="row d-flex">
                        <div class="col-lg-6">
                            <div class="card1 pb-5">
                                <div class="row  border-line"> 
                                    <img src="https://web.tarc.edu.my/portal/images/tarucLogo1.png" class="logo img-fluid mx-auto d-block"/> 
                                    <h4 class="text-center">Skill Enhancement Modules</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card2 card border-0 px-4 py-5">
                                <div class="row mb-2">
                                    <h4>Reset Password</h4>
                                    <small style={{color:"grey"}}><i>Please enter your information</i></small>
                                </div>
                                <div class="row mb-4">
                                    <div class="line"></div>
                                </div>
                                <form onSubmit={this.resetHandler}>
                                    <div class="row px-3"> <label class="mb-1 label">
                                            <h6 class="mb-0 text-sm">New Password</h6>
                                        </label> <input class="mb-4" type="password" value={this.state.password} onChange={this.onChangePassword} name="email" placeholder="Enter new password"/> </div>
                                    <div class="row px-3"> <label class="mb-1 label">
                                            <h6 class="mb-0 text-sm">Confirm New Password</h6>
                                        </label> <input type="password" onChange={this.onChangeConfirmPassword} value={this.state.confirmPassword} name="password" placeholder="Confirm new password"/> </div>
                                    <div class="row mb-4 px-2">
                                        <Link to="/Forgot Password">
                                            <span></span>
                                        </Link>
                                    </div>
                                    

                                    <div class="row mb-3 px-3"> <button type="submit" class="btn btn-blue text-center">Submit</button> </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}