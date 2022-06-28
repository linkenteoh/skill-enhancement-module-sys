import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/components.css'
import { toast } from 'react-toastify';

export default class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
        }

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.loginHandler = this.loginHandler.bind(this);
    }

    componentWillMount (){
        this.props.handlePage("login");


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

    async loginHandler (e) {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        var email = this.state.email;
        var password = this.state.password;  
        
        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password },
                config
            )
            console.log(data.user)
            this.props.handleUser(data.user)

            localStorage.setItem("authToken", data.token);
            this.props.handleRole(data.user.role); 
            localStorage.setItem("user", JSON.stringify(data.user));
            this.props.history.push("/Announcement");
            toast.success("You are logged in!", {theme:'colored'})

        }catch (error){
            toast.error("Invalid credentials", {
                theme:"colored"
            });

            console.log({error});

            this.setState({
                password: "",
                email: ""
            })
        }
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
                                    <h4>Sign in</h4>
                                    <small style={{color:"grey"}}><i>Please enter your information</i></small>
                                </div>
                                <div class="row mb-4">
                                    <div class="line"></div>
                                </div>
                                <form onSubmit={this.loginHandler}>
                                    <div class="row px-3"> <label class="mb-1 label">
                                            <h6 class="mb-0 text-sm">Email Address</h6>
                                        </label> <input class="mb-4" type="text" value={this.state.email} onChange={this.onChangeEmail} name="email" placeholder="Enter a valid email address"/> </div>
                                    <div class="row px-3"> <label class="mb-1 label">
                                            <h6 class="mb-0 text-sm">Password</h6>
                                        </label> <input type="password" onChange={this.onChangePassword} value={this.state.password} name="password" placeholder="Enter password"/> </div>
                                    <div class="row mb-4 px-2">
                                        <Link to="/Forgot Password">
                                            <a href="#" class="ml-auto mb-0 text-sm">Forgot Password?</a>
                                        </Link>
                                    </div>
                                    

                                    <div class="row mb-3 px-3"> <button type="submit" class="btn btn-blue text-center">Login</button> </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}