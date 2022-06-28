import React, { Component } from 'react';
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import SweetAlert from 'react-bootstrap-sweetalert'

export default class CertStatus extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: {},
            modules: [],
            userLoad: true,
            certLoad: true,
            generating: false,
        }

        this.generateCert = this.generateCert.bind(this)
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
        this.props.handlePage("certIssuance")
        axios.get('http://localhost:5000/users/'+this.props.match.params.id)
        .then((res) => {
            this.setState({user: res.data, userLoad: false})
        })

        axios.get('http://localhost:5000/results/certStatus/'+this.props.match.params.id)
        .then(res => {
            this.setState({modules: res.data, certLoad: false})
        })

        // const web3 = new Web3()
        // const contract = new web3.eth.Contract(Certificates.abi, '0x6C59dab457Fc12af970a8A9EA8C81A3E8F7e1E80')
        // console.log(contract)

    }
    
    generateCert(){
        Swal.fire({
            title: 'Are you sure?',
            text: "Generated PDF file will be sent to student's email.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                this.setState({generating: true})
                let tempModules = [...this.state.modules]
                let modules = ""
                tempModules.forEach(m => {
                    modules = modules.concat(`<li>${m}</li>`)
                })

                let certDetails = {
                    user: this.state.user,
                    modules,
                    arrayModules: this.state.modules,
                }
                
                axios.post("http://localhost:5000/users/generateCert", certDetails)
                .then((res) => {
                    console.log(res.data)
                    this.setState({generating: false})
                    toast.success("Certificate generated and sent.", {theme:'colored'})
                })
                .catch(err => {
                    this.setState({generating: false})
                    toast.error("Certificate already existing!", {theme:'colored'})
                })
            }
        })
    }

    render(){
        return(
           
            <div class="card card0 border-0">
                <h2>Student Certificate Status</h2>
                <div class="line"></div><br></br>
                {this.state.generating && <SweetAlert custom customIcon="https://c.tenor.com/5o2p0tH5LFQAAAAi/hug.gif" title="Generating Certificate..." showConfirm={false}>Certificate is being generated and it may take awhile to deploy the certificate to blockchain network.</SweetAlert>}


                {this.state.userLoad == this.state.paperLoad == true ? (<div style={{textAlign:"center"}}><img className="img-fluid" src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>):(
                <div>
                    <div>
                        <h2>{this.state.user.name}</h2>
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
                            <h6 style={{fontWeight:"normal" }}><i>This student has no registered modules yet or maybe failed to achieve the minumun threshold grade for the assessment.</i></h6><br/>
                            <div className="d-flex flex-column justify-content-center">
                                <div style={{ width: "v100", textAlign:"center"}}>
                                <img style={{ width:"600px"}}  className="img-fluid"  src={require("../noresults.png").default} />
                                </div>
                                <span className="text-center">No records found.</span>
                            </div>
                        </div>
                    ):(
                        <div>
                            <h6 style={{fontWeight:"normal" }}><i>This student has completed modules stated below and will be awarded a certificate as a proof of completion.</i></h6><br/>
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
                            <br/>
                            <button onClick={this.generateCert} class="btn btn-primary">Generate Certificate</button>
                        </div>
                    )}
                    
                </div>
                )}

            </div>
        )
    }
}