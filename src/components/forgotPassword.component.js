import React, { Component } from 'react';
import axios from 'axios';
import '../css/components.css'
import { toast } from 'react-toastify';


export default class ForgotPassword extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: "",
        }

        this.forgotPasswordHandler = this.forgotPasswordHandler.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
    }

    componentDidMount(){
        this.props.handlePage("login")
    }

    forgotPasswordHandler = async (e) => {
        e.preventDefault();
        const config = {
            header: {
              "Content-Type": "application/json",
            },
        };
        
        var email = this.state.email;
       
        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/forgotpassword",
                { email },
                config
              );

            if(data){
                toast.success("A reset link is sent to your email address.", {
                    theme:"colored"
                });
            }
        } catch (error) {
            toast.error("Email not found", {
                theme:"colored"
            });
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
                            <div class="card3 pb-5">
                                <div class="row  border-line"> 
                                    <img src="https://web.tarc.edu.my/portal/images/tarucLogo1.png" class="logo img-fluid mx-auto d-block"/> 
                                    <h4 class="text-center">Skill Enhancement Modules</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="card2 card border-0 px-4 py-5">
                                <div class="row mb-2">
                                    <h4>Forgot Password</h4>
                                    <small style={{color:"grey"}}><i>Please enter your information</i></small>
                                </div>
                                <div class="row mb-4">
                                    <div class="line"></div>
                                </div>
                                <form onSubmit={this.forgotPasswordHandler}>
                                    <div class="row px-3 d-flex"> <label class="mb-1 label">
                                            <h6 class="mb-0 text-sm">Email Address</h6>
                                        </label> <input class="mb-4" type="text" onChange={this.onChangeEmail} name="email" placeholder="Enter a valid email address"/> 
                                    </div>



                                    <div class="row mb-3 px-3"> <button type="submit" class="btn btn-blue text-center">Send</button> </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}