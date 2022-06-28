import React, { Component } from 'react';
import './newModule.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { toast } from 'react-toastify';


export default class NewModule extends Component{
    constructor(props){
        super(props)
        this.state = {
            objectives: [],
            schedule: new Date(),
            title: "",
            overview: "",
            startDate: null,
            endDate: null,
        }

        this.addObj = this.addObj.bind(this);
        this.handleObjectives = this.handleObjectives.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleOverview = this.handleOverview.bind(this);
        this.handleSchedule = this.handleSchedule.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.startDate = this.startDate.bind(this);
        this.endDate = this.endDate.bind(this);
    }

    componentDidMount(){
        this.props.handlePage("courseMaintenance");
    }

    addObj(){
        const element = document.getElementById('objectives-input');

        // let objectives = [...this.state.objectives];
        // const setObj = () => {this.setState({ objectives })};


        let input = document.createElement("input");
        input.className = "form-control new-input";
        input.type = "text";

        input.onchange = function (e){
            let objectives = [...this.state.objectives];
            objectives[Array.from(input.parentNode.children).indexOf(input)] = e.target.value;
            this.setState({ objectives });

        }.bind(this);

        element.append(input);
    }

    handleObjectives(e){
        let objectives = [...this.state.objectives];
        objectives[0] = e.target.value;
        this.setState({ objectives });
    }

    handleTitle(e){this.setState({title: e.target.value})}
    handleOverview(e){this.setState({overview: e.target.value})}

    handleSchedule(schedule){this.setState({schedule})}
    startDate(startDate){
        this.setState({startDate})
    }
    endDate(endDate){
        this.setState({endDate})
    }

    submitForm(e){
        e.preventDefault();

        if(this.state.startDate == null|| this.state.endDate == null){
            return toast.error("Please enter both start and end date for the registration process!", {theme:'colored'})
        }

        const module = {
            courseTitle : this.state.title,
            courseOverview : this.state.overview,
            courseObjectives: this.state.objectives,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            published: false,
        }

        axios.post('http://localhost:5000/courses/add', module)
        .then(res => {
                this.props.history.push("/Module Maintenance");
                toast.success("New module added successfully", {
                    theme:"colored"
                });
            }
        );
    }
    
    render(){
        return(
            <div className="card card0 border-0">
                <h2>Course Maintenance</h2>
                <div className="line"></div><br></br>

                <h4>Add New Module</h4><br></br>
                <form onSubmit={this.submitForm}>
                    <div className="row ">
                        <div className="col-md-6">
                            <label for="titleName">Title</label> <i className="fas fa-plus add-btn" style={{opacity: 0} }></i>
                                <input placeholder="Module Title" required onChange={this.handleTitle} className="form-control" id="titleName" type="text" />
                        </div>

                        <div className="col-md-6">
                            <label for="objectives">Objectives</label> <i onClick={this.addObj}  className="fas fa-plus add-btn"></i>

                            <div id="objectives-input">
                                <input placeholder="Objective" required className="form-control" onChange={this.handleObjectives} id="objectives" type="text" />
                            </div>
                        </div>


                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label for="overview">Overview</label><i className="fas fa-plus add-btn" style={{opacity: 0}}></i>
                            <textarea style={{height:"100px"}} placeholder="Module Overview" required onChange={this.handleOverview} id="overview" className="form-control"></textarea>

                        </div>
                    </div>

                    <div className="row">
                        <label>Registration Date (Duration)</label>

                        <div className="col-md-3">
                            <DatePicker 
                                placeholderText="Start date"
                                dateFormat="dd/MM/yyyy"
                                selected={this.state.startDate}
                                onChange={this.startDate}
                                minDate={new Date()}
                            />
                        </div>

                        <div className="col-md-3">
                            <DatePicker 
                                placeholderText="End date"
                                dateFormat="dd/MM/yyyy"
                                selected={this.state.endDate}
                                onChange={this.endDate}
                                minDate={this.state.startDate}
                            
                            />
                        </div>
                    </div>
                    <div>
                        <br></br>
                        <button className="btn btn-primary">Submit</button>
                    </div>
                    <div className="form-text"></div>
                </form>
            </div>
            
            
        )
    }
}