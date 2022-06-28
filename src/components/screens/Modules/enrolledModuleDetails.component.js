import React, { Component } from 'react';
import axios from 'axios';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import './moduleDetails.css'
import moment from"moment"

export default class EnrolledDetails extends Component{
    constructor(props){
        super(props)
        this.state = {
            module: {},
            classes: [],
            papers: [],
            results: [],
            isLoading: true,
            classLoad: true,
            paperLoad: true,
            resultsLoad: true,
        }

        this.handleKey = this.handleKey.bind(this);
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
                this.setState({module, isLoading: false})
                console.log(module)
            })
    }

    handleKey(key){
        if(key == "classes"){
            this.loadClasses()
        }else if(key == "assessment"){
            this.loadPapers()
        }else if(key == "results"){
            this.loadResults()
        }
    }

    loadResults(){
        if(this.state.results.length == 0){
            let obj = {
                course: this.props.match.params.id,
                user: (JSON.parse(localStorage.getItem("user"))._id)
            }
            axios.post("http://localhost:5000/results/student", obj)
            .then((res) => {
                this.setState({results: res.data, resultsLoad: false})
                console.log(res.data)
            })
        }
    }

    loadClasses(){
        if(this.state.classes.length == 0){
            axios.get("http://localhost:5000/classes/"+this.props.match.params.id)
                .then((res) => {
                    let classes = [...res.data]
                    this.setState({classes, classLoad:false})
                    console.log(this.state.classes)
                })
        }
    }

    loadPapers(){
        if(this.state.papers.length == 0){
            axios.get("http://localhost:5000/papers/"+this.props.match.params.id)
                .then((res) => {
                    let papers = [...res.data]
                    this.setState({papers, paperLoad:false})
                    console.log(this.state.papers)
                })
        }
    }
    
    render(){
        if(this.state.isLoading){
            return(
                <div class="card card0 border-0">
                        <h3>Enrolled Module Details</h3>
                    <div class="line"></div><br></br>
                    <div style={{textAlign:"center"}}><img className="img-fluid" src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                </div>
            )
        }else{
            return(
                <div class="card card0 border-0">
                    <div>
                        <h3>Enrolled Module Details</h3>
                    </div>
                    <div class="line"></div><br></br>
                    <div>
                        <h2 className="courseTitle">{this.state.module.courseTitle}</h2><br/>
                        <Tabs 
                            onSelect={(k) => this.handleKey(k)}
                        >
                            <Tab title="Overview" eventKey="overview">
                                <div style={{marginTop:"15px"}}>
                                    <label>Module overview:</label>
                                    <div>
                                        <textarea style={{height:"100px"}} value={this.state.module.courseOverview} disabled></textarea>
                                    </div>

                                    <label>Objectives:</label>
                                    {this.state.module.courseObjectives.map((obj) => (
                                        <li>{obj}</li>
                                    ))}<br/>
                                    
                                    <div className="d-flex justify-content-between threshold">
                                        <i className="text-sm">Minumum threshold needs to be achieved in order to pass the module only then a certificate will be awarded.</i>
                                    </div>
                                </div>
                            </Tab>
                            <Tab title="Classes" eventKey="classes">
                                {this.state.classLoad ? (
                                    <div>
                                        <div style={{textAlign:"center"}}><img className="img-fluid" src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                                    </div>
                                ):(
                                    <div>
                                        {this.state.classes.length == 0 ? (
                                            <div className="d-flex flex-column justify-content-center">
                                                <div style={{ width: "v100", textAlign:"center"}}>
                                                <img style={{ width:"600px"}}  className="img-fluid"  src={require("../noresults.png").default} />
                                                </div>
                                                <span className="text-center">No records found.</span>
                                            </div>
                                        ): (
                                        <div className="d-flex justify-content-center flex-wrap paper-parent">
                                                {this.state.classes.map((c, index) => (
                                                <div key={index} className="paper-container">
                                        
                                                    <h3>Class {index + 1}</h3>
                                                    <label>Title</label>
                                                    <input disabled defaultValue={c.title}></input>

                                                    <label>Venue</label>
                                                    <input disabled defaultValue={c.venue}></input>

                                                    <label>Lecturer</label> 
                                                    <input disabled defaultValue={c.lecturer}></input>

                                                    <label>Start Time</label> <i className="form-text"></i>
                                                    <input disabled defaultValue={c.startTime}></input>

                                                    <label>End Time</label> <i className="form-text"></i>
                                                    <input disabled defaultValue={c.endTime}></input>

                                                    <label>Date</label> <i className="form-text"></i>
                                                    <input disabled value={moment(moment(c.date).toDate()).format('DD/MM/YYYY')}></input>
                                                    
                                                    {c.link &&
                                                    <div>
                                                        <label>Link</label> <i className="form-text"></i>
                                                        <div className="cloned-input">
                                                            <a href={c.link}>{c.link}</a>
                                                        </div>
                                                    </div>
                                                    }   

                                                </div>
                                            ))}
                                        </div>
                                        )}
                                    </div>
                                )}
                            </Tab>
                            <Tab title="Assessment" eventKey="assessment">
                                {this.state.paperLoad ? (
                                    <div>
                                        <div style={{textAlign:"center"}}><img className="img-fluid" src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                                    </div>
                                ):(
                                    <div>
                                        {this.state.papers.length == 0 ? (
                                            <div className="d-flex flex-column justify-content-center">
                                                <div style={{ width: "v100", textAlign:"center"}}>
                                                <img style={{ width:"600px"}}  className="img-fluid"  src={require("../noresults.png").default} />
                                                </div>
                                                <span className="text-center">No records found.</span>
                                            </div>
                                        ): (
                                        <div className="d-flex justify-content-center flex-wrap paper-parent">
                                                {this.state.papers.map((paper, index) => (
                                                <div key={index} className="paper-container">
                                                    <h3>Assessment {index + 1}</h3>

                                                    <label>Name</label>
                                                    <input disabled defaultValue={paper.paperName}></input>

                                                    <label>Venue</label> <i className="form-text"></i>
                                                    <input disabled defaultValue={paper.venue}></input>

                                                    {paper.paperSchedule &&
                                                    <div>
                                                        <label>Date</label> <i className="form-text"></i>
                                                        <input disabled value={moment(moment(paper.paperSchedule).toDate()).format('DD/MM/YYYY')}></input>
                                                    </div>
                                                    }

                                                    {paper.paperTime &&
                                                    <div>
                                                        <label>Time</label> <i className="form-text"></i>
                                                        <input disabled defaultValue={paper.paperTime} ></input>
                                                    </div>
                                                    }

                                                    {paper.venueLink &&
                                                    <div>
                                                        <label>Link</label> <i className="form-text"></i>
                                                        <div className="cloned-input">
                                                            <a href={paper.venueLink}>{paper.venueLink}</a>
                                                        </div>
                                                    </div>
                                                    }

                                                </div>
                                            ))}
                                        </div>
                                        )}
                                    </div>
                                )}
                            </Tab>

                            {this.state.module.completed == true ? (
                                <Tab title="Results" eventKey="results" >
                                    <div>
                                        {this.state.resultsLoad ? (
                                            <div>
                                                <div style={{textAlign:"center"}}><img className="img-fluid" src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                                            </div>
                                        ):(
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                    <th scope="col">No.</th>
                                                    <th scope="col">Paper Title</th>
                                                    <th scope="col">Score</th>
                                                    <th scope="col">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.results.map((result, index) => (
                                                        <tr>
                                                            <td>{index+1}</td>
                                                            <td>{result.paper.paperName}</td>
                                                            <td>{result.score}</td>
                                                            <td>{result.status == true ? (<span>Passed</span>):(<span>Failed</span>)}</td>
                                                        </tr>
                                                    ))}
                                                    
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </Tab>
                            ) : (
                                <Tab title="Results" eventKey="results" disabled></Tab>
                            )}
                            
                        </Tabs>
                       
                    </div>
                </div>
            )
        }
    }
}