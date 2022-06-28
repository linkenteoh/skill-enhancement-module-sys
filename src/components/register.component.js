import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/components.css'
import { toast } from 'react-toastify';

export default class Register extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
        }

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        this.registerHandler = this.registerHandler.bind(this);
    }

    componentWillMount (){
        this.props.handlePage("register");


        if(localStorage.getItem("authToken")){
            this.props.history.push("/Announcement");
        }
    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        })
    }

    onChangePassword(e){
        this.setState({
            password: e.target.value
        })
    }

    onChangeConfirmPassword(e){
        this.setState({
            confirmPassword: e.target.value
        })
    }

    async registerHandler (e) {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        var email = this.state.email;
        var password = this.state.password;
        var confirmPassword = this.state.confirmPassword;  

        if(password != confirmPassword){
            toast.error("Password do not match!", {theme:"colored"})
            this.setState({password: '', confirmPassword: ''})
            return
        }

        if(password.length < 8){
            toast.error("Password should consist of at least 8 characters!", {theme:"colored"})
            this.setState({password: '', confirmPassword: ''})
            return
        }

        try {
            const { data } = await axios.post(
              "/api/auth/register",
              {
                email,
                password,
                role: 'student',
                verified: false,
              },
              config
            );
      
            this.props.handleRole(data.user.role); 
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            this.props.handleUser(data.user)

            toast.success("Registered successfully", {theme:'colored'})
            this.props.history.push("/");
          } catch (error) {
            if(error){
                toast.error(error.response.data.error, {theme:'colored'})
            }
          }
    }

    render(){
        return(
                <div class="card card0 border-0">
                    <div class="row d-flex">
                        <div class="col-lg-6">
                            <div class="card1 pb-5">
                                <div class="row  border-line"> 
                                    <img style={{paddingTop:"40px"}} src="https://web.tarc.edu.my/portal/images/tarucLogo1.png" class="logo img-fluid mx-auto d-block"/> 
                                    <h4 class="text-center">Skill Enhancement Modules</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card2 card border-0 px-4 py-5">
                                <div class="row mb-2">
                                    <h4>Register</h4>
                                    <small style={{color:"grey"}}><i>Please enter your information</i></small>
                                </div>
                                <div class="row mb-4">
                                    <div class="line"></div>
                                </div>
                                <form onSubmit={this.registerHandler}>
                                    <div class="row px-3"> <label class="mb-1 label">
                                            <h6 class="mb-0 text-sm">Email Address</h6>
                                        </label> <input class="mb-4" type="text" value={this.state.email} onChange={this.onChangeEmail} name="email" required pattern="[a-z0-9._%+-]+@student.tarc.edu.my$" placeholder="Enter TARUC email (e.g. wangkj-pm18@student.tarc.edu.my)"/> </div>

                                    <div class="row px-3"> <label class="mb-1 label">
                                            <h6 class="mb-0 text-sm">Password</h6>
                                        </label> <input class="mb-4" type="password" required onChange={this.onChangePassword} value={this.state.password} name="password" placeholder="Enter password"/> </div>

                                    <div class="row px-3"> <label class="mb-1 label">
                                            <h6 class="mb-0 text-sm">Confirm Password</h6>
                                        </label> <input type="password" required onChange={this.onChangeConfirmPassword} value={this.state.confirmPassword} name="password" placeholder="Confirm password"/> </div>

                                    <div class="row mb-4 px-2">
                                        <Link to="/Login">
                                            <a href="#" class="ml-auto mb-0 text-sm">Already have an account?</a>
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