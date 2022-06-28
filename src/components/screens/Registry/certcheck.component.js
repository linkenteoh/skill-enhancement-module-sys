import React, { Component } from 'react';
import axios from 'axios';
import './certcheck.css'

export default class CertCheck extends Component{
    constructor(props){
        super(props)
        this.state = {
            result: {},
            loading: true,
            verified: false,
        }
    }

    componentWillMount(){
        axios.get('http://localhost:5000/users/checkCert/'+ this.props.match.params.id)
        .then(res => {
            this.setState({result: res.data, loading: false, verified:true})
        })
        .catch(err => {
            alert(err)
            this.setState({loading: false, verified: false})
        })
    }
    
    render(){
        const certs = require.context('../../../certs', true);

        return(
            <div>
                <div className="d-flex justify-content-center">
                    {this.state.loading ? (
                    <div>
                        Loading
                    </div>
                    ):(
                    <div className="border border-primary p-3 mt-3">
                        {this.state.verified ? (
                            <div>
                                <div className="alert alert-success">This certificate is blockchain verifeid</div>
                                <b>Name</b>:<br/> {this.state.result[0]}<br/>
                                <b>Student ID</b>:<br/> {this.state.result[2]}<br/>
                                <b>Completed modules</b>:<br/> {this.state.result[3].map((module, index) => (
                                    <div>
                                        <li>{module}</li>
                                    </div>
                                ))}
                                <b>Issued by</b>:<br/> {this.state.result[1]}<br/>
                                <br/>
                                Certificate (PDF): <a target="_blank" href={certs(`./${this.state.result["_id"]}.pdf`).default}>View</a> <br/>
                                <i className="text-sm txnhash">Txn Hash: <br/>{this.state.result["txnHash"]}</i>
                            </div>
                        ): (
                            <div>No certificate with given ID ({this.props.match.params.id}) is found</div>
                            
                        )}
                        
                    </div>
                    )}
                </div>
            </div>
        )
    }
}