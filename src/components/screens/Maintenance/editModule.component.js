import React, { Component } from 'react';
import axios from 'axios';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import DatePicker from 'react-datepicker'
import moment from"moment"
import ToggleButton from 'react-toggle-button'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import './editModule.css'
import Table from "../../table.component"
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';


export default class EditModule extends Component{
    constructor(props){
        super(props)
        this.state = {
            module: {
                courseTitle: null,
                courseObjectives: null,
                courseOverview: null,
                createdAt: null,
                endDate: null,
                startDate: null,
                completed: null,
                deleteClicked: true,
            },
            isLoading: true,
            papers: [],
            papersLength: null,
            classes: [],
            classesLength: null,
            studList: [],
        }

        this.submitForm = this.submitForm.bind(this);
        this.addObj = this.addObj.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleOverview = this.handleOverview.bind(this);
        this.startDate = this.startDate.bind(this);
        this.endDate = this.endDate.bind(this);

        this.submitPaper = this.submitPaper.bind(this);
        this.handleVenue = this.handleVenue.bind(this);
        this.handleLink = this.handleLink.bind(this);
        this.handleSchedule = this.handleSchedule.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.handleThreshold = this.handleThreshold.bind(this);
        this.deleteClicked = this.deleteClicked.bind(this);
        this.addPaper = this.addPaper.bind(this);

        this.addClass = this.addClass.bind(this);
        this.deleteClassClicked = this.deleteClassClicked.bind(this);
        this.handleClassTitle = this.handleClassTitle.bind(this);
        this.handleClassVenue = this.handleClassVenue.bind(this);
        this.handleClassLecturer = this.handleClassLecturer.bind(this);
        this.handleStartTime = this.handleStartTime.bind(this);
        this.handleEndTime = this.handleEndTime.bind(this);
        this.handleClassLink = this.handleClassLink.bind(this);
        this.handleClassDate = this.handleClassDate.bind(this);
        this.submitClass = this.submitClass.bind(this);

        this.handleKey = this.handleKey.bind(this);
        this.removeStudent = this.removeStudent.bind(this);
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
        
        this.props.handlePage("courseMaintenance")
        axios.get(`http://localhost:5000/courses/${this.props.match.params.id}`)
            .then((res) => {
                res.data.startDate = moment(res.data.startDate).toDate();
                res.data.endDate = moment(res.data.endDate).toDate();
                this.setState({module: res.data})
                this.state.module.courseObjectives.forEach((obj)=>{
                    const element = document.getElementById('objectives-input');

                    let input = document.createElement("input");
                    input.className = "form-control";
                    input.type = "text";
                    input.value = obj;

                    input.onchange = function (e){
                        let objectives = [...this.state.module.courseObjectives];
                        let module = {...this.state.module}
                        objectives[Array.from(input.parentNode.children).indexOf(input)] = e.target.value;
                        module.courseObjectives = objectives;
                        this.setState({ module });

                    }.bind(this);

                    element.append(input);
                })
            })
        
        axios.get(`http://localhost:5000/papers/${this.props.match.params.id}`)
            .then((res) => {
                this.setState({
                    papers: res.data, 
                    papersLength: res.data.length,
                    isLoading: false
                })
            })
            .catch((err) => {
                alert("Encounterd errors while loading papers.")
            })
        
        axios.get(`http://localhost:5000/classes/${this.props.match.params.id}`)
            .then((res) => {
                this.setState({classes: res.data, classesLength: res.data.length});
            })
            .catch((err) => {
                alert("Encounterd errors while loading classes.")
            })

    }   

    handleTitle(e){
        let module = {...this.state.module}
        module.courseTitle = e.target.value;
        this.setState({module});
    }

    handleOverview(e){
        let module = {...this.state.module}
        module.courseOverview = e.target.value;
        this.setState({module});
    }

    startDate(startDate){
        let module = {...this.state.module}
        module.startDate = startDate;
        this.setState({module})
    }

    endDate(endDate){
        let module = {...this.state.module}
        module.endDate = endDate;
        this.setState({module})
    }

    addObj(){
        const element = document.getElementById('objectives-input')

        let input = document.createElement("input");
        input.className = "form-control new-input";
        input.type = "text";

        input.onchange = function (e){
            let objectives = [...this.state.module.courseObjectives];
            let module = {...this.state.module}
            objectives[Array.from(input.parentNode.children).indexOf(input)] = e.target.value;
            module.courseObjectives = objectives;
            this.setState({ module });

        }.bind(this);

        element.append(input);
    }

    submitForm(e){
        e.preventDefault();

        if(this.state.module.startDate == null|| this.state.module.endDate == null){
            return toast.error("Please enter both start and end date for the registration process!", {theme:'colored'})
        }

        const module = {
            courseTitle : this.state.module.courseTitle,
            courseOverview : this.state.module.courseOverview,
            courseObjectives: this.state.module.courseObjectives,
            startDate: this.state.module.startDate,
            endDate: this.state.module.endDate,
            published: this.state.module.published,
        }

        axios.post("http://localhost:5000/courses/update/"+this.props.match.params.id, module)
            .then((res) => {
                toast.success("Module details updated", {
                    theme:"colored"
                });
            })
            .catch(err => {
                toast.error("Some errors occured", {theme:"colored"})
            })
    }

    /* PAPERS SECTION*/

    handleName(e, index){
        let papers = [...this.state.papers]
        papers[index].paperName = e.target.value
        this.setState({papers})
    }

    handleVenue(e, index){
        let papers = [...this.state.papers]
        papers[index].venue = e.target.value
        this.setState({papers})
    }

    handleLink(e, index){
        let papers = [...this.state.papers]
        papers[index].venueLink = e.target.value
        this.setState({papers})
    }

    handleSchedule(date, index){
        let papers = [...this.state.papers]
        papers[index].paperSchedule = date
        this.setState({papers})
    }

    handleTime(e, index){
        let time = e.format('h:mm a')
        let papers = [...this.state.papers]
        papers[index].paperTime = time
        this.setState({papers})
    }
    
    handleThreshold(e, index){
        let papers = [...this.state.papers]
        papers[index].threshold = e.target.value
        this.setState({papers})
    }

    submitPaper(e){
        e.preventDefault()

        let papers = [...this.state.papers]
        for (let index = 0; index < this.state.papersLength; index++) {
            var paper = {
                paperName: papers[index].paperName,
                paperSchedule: papers[index].paperSchedule,
                paperTime: papers[index].paperTime,
                venue: papers[index].venue,
                venueLink: papers[index].venueLink,
                threshold: papers[index].threshold,      
            }
            axios.post("http://localhost:5000/papers/update/"+papers[index]._id, paper)
                .then((res) => {console.log("Update existing papers")})
        }

        var i = this.state.papersLength;

        for (i; i < papers.length; i++) {
            if(papers[i] != null){
                var newPaper ={
                    paperName: papers[i].paperName,
                    paperTime: papers[i].paperTime,
                    venue: papers[i].venue,
                    venueLink: papers[i].venueLink,
                    paperSchedule: papers[i].paperSchedule,
                    threshold: papers[i].threshold,
                    course: this.props.match.params.id
                }
                axios.post("http://localhost:5000/papers/add", newPaper)
                    .then((res) => {
                        papers.splice(i-1, i, res.data);
                        this.setState({papers, papersLength: this.state.papersLength + 1})
                    })
            }
        }
        toast.success("Paper details updated", {
            theme:"colored"
        });
        
    }

    addPaper(){
        let papers = [...this.state.papers]
        papers.push({})
        this.setState({papers, papersLength: this.state.papersLength })
    }

    deleteClicked(index){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
          }).then((result) => {
            if (result.isConfirmed) {
                var papers = [...this.state.papers];
                    var id = papers[index]._id;
                    let hasId = Reflect.has(papers[index], '_id');
                    papers.splice(index, 1);
                    this.setState({papers: papers, isLoading:true});
                    this.setState({isLoading: false})

                    if(hasId){
                        axios.delete("http://localhost:5000/papers/"+id)
                        .then((res) => {
                            // papers.splice(index, 1);
                            this.setState({papersLength: this.state.papersLength - 1})
                            toast.success("Paper deleted successfully.", {theme:"colored"})
                        })  
                        .catch((err) => {
                            // this.setState({papers});
                        })
                    }
            }
        })
    }    

    /* CLASSES */

    addClass(){
        var classes =[...this.state.classes]
        classes.push({})
        this.setState({classes: classes})
    }

    handleClassVenue(e, index){
        let classes = [...this.state.classes]
        classes[index].venue = e.target.value
        this.setState({classes})
    }

    handleClassLecturer(e, index){
        let classes = [...this.state.classes]
        classes[index].lecturer = e.target.value
        this.setState({classes})
    }

    handleClassLink(e, index){
        let classes = [...this.state.classes]
        classes[index].link = e.target.value
        this.setState({classes})
    }

    handleClassDate(date, index){
        let classes = [...this.state.classes]
        classes[index].date = date
        this.setState({classes})
    }

    handleClassTitle(e, index){
        let classes = [...this.state.classes]
        classes[index].title = e.target.value
        this.setState({classes})
    }

    handleStartTime(e, index){
        let startTime = e.format('h:mm a')
        let classes = [...this.state.classes]
        classes[index].startTime = startTime
        this.setState({classes})
        console.log(classes)
    }

    handleEndTime(e, index){
        let endTime = e.format('h:mm a')
        let classes = [...this.state.classes]
        classes[index].endTime = endTime
        this.setState({classes})
    }

    deleteClassClicked(index){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
          }).then((result) => {
            if (result.isConfirmed) {
                let classes = [...this.state.classes]
                let hasId = Reflect.has(classes[index], '_id');
                if(hasId){
                    axios.delete("http://localhost:5000/classes/"+classes[index]._id)
                        .then((res) => {
                            this.setState({classesLength: this.state.classesLength - 1})
                            toast.success("Class deleted successfully.", {theme:"colored"})
                        })  
                        .catch((err) => {
                            console.log("Error.");
                    })
                }
                classes.splice(index, 1)
                this.setState({classes})
            }
        })
    }

    submitClass(e){
        e.preventDefault()

        let classes = [...this.state.classes]
        for (let index = 0; index < this.state.classesLength; index++) {
            var c = {
                title: classes[index].title,
                venue: classes[index].venue,
                date: classes[index].date,
                startTime: classes[index].startTime,
                endTime: classes[index].endTime,
                lecturer: classes[index].lecturer,
                link: classes[index].link,      
            }
            axios.post("http://localhost:5000/classes/update/"+classes[index]._id, c)
                .then((res) => {console.log("Update existing classes")})
        }

        var i = this.state.classesLength;

        for (i; i < classes.length; i++) {
            if(classes[i] != null){
                if(classes[i].startTime == null || classes[i].endTime == null || classes[i].date == null){
                    return toast.error("Date and Time should not be empty!", {theme:'colored'})
                }
                var newClass ={
                    title: classes[i].title,
                    venue: classes[i].venue,
                    date: classes[i].date,
                    startTime: classes[i].startTime,
                    endTime: classes[i].endTime,
                    lecturer: classes[i].lecturer,
                    link: classes[i].link,  
                    course: this.props.match.params.id
                }
                axios.post("http://localhost:5000/classes/add", newClass)
                    .then((res) => {
                        classes.splice(i-1, i, res.data);
                        this.setState({classes,classesLength: this.state.classesLength + 1})
                    })
            }
        }
        toast.success("Class details updated", {
            theme:"colored"
        });
    }

    /* Registered Students */

    handleKey(k){
        if(k == "registeredStudents"){
            if(this.state.studList.length == 0){
                axios.get('http://localhost:5000/registrations/registeredStudents/'+this.props.match.params.id)
                .then((res) => {
                    this.setState({studList: res.data})
                })
            }
        }
    }

    removeStudent(id){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete("http://localhost:5000/registrations/"+id)
                .then((res) => {
                    toast.success("Student excluded from the module successfully.", {theme:"colored"})
                    let tempList = [...this.state.studList]
                    let removedstud = tempList.filter(function(s) {return s.regId !== id})
                    this.setState({studList: removedstud})
                })
            }
        })
    }

    render(){
        const students_columns = [
              {   
                Header: 'Name',
                accessor: 'name',
              }, 
              {
                Header: 'Email',
                accessor: 'email',
              },
              {
                Header: 'Registered at',
                accessor: 'registeredAt',
                Cell: ({ cell }) => {
                    return moment(cell.row.values.registeredAt)
                      .local()
                      .format("dddd, DD MMM YY")          
                  }
              },
              {
                Header: 'Action',
                accessor: 'regId',
                disableSortBy: true,                    
                Cell: ({ cell }) => {
                  return (
                    <div>
                      {/* <Link to={"/Course/Details/"+cell.row.values._id} className="btn btn-primary" style={{color: "white"}}>View</Link> */}
                      <button className="btn btn-danger" onClick={() => this.removeStudent(cell.row.values.regId)}>Remove</button>
                    </div>
                    
                  )
                }
              },
        ]

        const students_columns_completed = [
            {   
              Header: 'Name',
              accessor: 'name',
            }, 
            {
              Header: 'Email',
              accessor: 'email',
            },
            {
              Header: 'Registered at',
              accessor: 'registeredAt',
              Cell: ({ cell }) => {
                  return moment(cell.row.values.registeredAt)
                    .local()
                    .format("dddd, DD MMM YY")          
                }
            },
      ]

        return(
            <div class="card card0 border-0">
                <h2>Edit Module</h2>
                <div class="line"></div><br></br>
                <div>
                <Tabs
                    defaultActiveKey="basics"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3"
                    onSelect={(k) => this.handleKey(k)}
                    >
                    <Tab eventKey="basics" title="Basics">
                        <form onSubmit={this.submitForm}>
                            <div className="row ">
                                <div className="col-md-6">
                                    <label for="titleName">Title</label> <i className="fas fa-plus add-btn" style={{opacity: 0} }></i>
                                        <input required defaultValue={this.state.module.courseTitle} onChange={this.handleTitle} className="form-control" id="titleName" type="text" />
                                </div>

                                <div className="col-md-6">
                                    <label for="objectives">Objectives</label> <i onClick={this.addObj}  className="fas fa-plus add-btn"></i>

                                    <div id="objectives-input">
                                        {/* <input required className="form-control" onChange={this.handleObjectives} id="objectives" type="text" /> */}
                                    </div>
                                </div>


                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <label for="overview">Overview</label><i className="fas fa-plus add-btn" style={{opacity: 0}}></i>
                                    <textarea required style={{height:"100px"}} defaultValue={this.state.module.courseOverview} onChange={this.handleOverview} id="overview" className="form-control"></textarea>

                                </div>

                                <div className="col-md-6">
                                    
                                    <label for="overview">Publish</label><i className="fas fa-plus add-btn" style={{opacity: 0}}></i>
                                    <ToggleButton
                                        inactiveLabel={"No"}
                                        activeLabel={"Yes"}
                                        containerStyle={{width:'100px'}} 
                                        trackStyle={{padding:'20px',width:'100px'}} 
                                        thumbAnimateRange={[3, 64]} 
                                        activeLabelStyle={{ fontSize:'15px', paddingBottom:'15px' }} 
                                        inactiveLabelStyle={{ fontSize:'15px', paddingBottom:'15px' }}
                                        thumbStyle={{ padding:'16px' }}
                                        value={this.state.module.published}
                                        onToggle={(value) => {
                                            console.log(this.state.module)
                                            if(this.state.module.courseTitle == "" || this.state.module.courseObjectives == null || this.state.module.courseOverview == null || this.state.module.startDate == null || this.state.module.endDate == null){
                                                return toast.error("Please make sure all basics information are filled!", {theme:'colored'})
                                            }
                                            let module = {...this.state.module}
                                            module.published = !value;
                                            this.setState({
                                                module,
                                            })
                                        }} />
                                    <i className="form-text">Students will be able to view this module once published.</i>

                                    
                                </div>
                            </div>

                            <div className="row">
                                <label>Registration Date (Duration)</label>

                                <div className="col-md-3">
                                    <DatePicker 
                                        placeholderText="Start date"
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.module.startDate}
                                        onChange={this.startDate}
                                        minDate={new Date()}
                                    />
                                </div>
                                

                                <div className="col-md-3">
                                    <DatePicker 
                                        placeholderText="End date"
                                        dateFormat="dd/MM/yyyy"
                                        selected={this.state.module.endDate}
                                        onChange={this.endDate}
                                        minDate={this.state.module.startDate}
                                    
                                    />
                                </div>
                            </div>
                            <div>
                                <br></br>
                                <button className="btn btn-primary">Save</button>
                            </div>
                            <div className="form-text"></div>
                        </form>
                    </Tab>

                    <Tab eventKey="assessment" title="Assessment">
                    {this.state.isLoading ? (<div style={{textAlign:"center"}}><img className="img-fluid" src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>): (
                        <div>
                            <div>
                                <button className="btn btn-primary" onClick={this.addPaper}>Add Assessment</button>
                            </div>
                            {this.state.papers.length == 0 ? (
                                <div className="d-flex flex-column justify-content-center">
                                    <div style={{ width: "v100", textAlign:"center"}}>
                                    <img style={{ width:"600px"}}  className="img-fluid"  src={require("../noresults.png").default} />
                                    </div>
                                    <span className="text-center">No records found.</span>
                                </div>
                            ): (
                                <form onSubmit={this.submitPaper}>
                            <div className="d-flex justify-content-center flex-wrap paper-parent">
                                    {this.state.papers.map((paper, index) => (
                                    <div key={index} className="paper-container">
                                        <h3>Assessment {index + 1}</h3>

                                        <label>Name*</label><i onClick={() => this.deleteClicked(index)} className="fas fa-trash add-btn" style={{ color:"brown" }}title="Remove paper"></i>
                                        <input className="form-control" required placeholder="Assessment title" defaultValue={paper.paperName} onChange={(e) => this.handleName(e, index)}></input>

                                        <label>Venue*</label> <i className="form-text"></i>
                                        <input className="form-control"  required defaultValue={paper.venue} onChange={(e) => this.handleVenue(e, index)} placeholder="Google Forms / A001"></input>

                                        <label>Date</label> <i className="form-text">(Leave blank if not applicable)</i>
                                        {/* <input onChange={(e) => this.handleSchedule(e, index)}></input> */}
                                        <DatePicker 
                                            className="form-control"
                                            placeholderText="Date"
                                            dateFormat="dd/MM/yyyy"
                                            selected={paper.paperSchedule ? moment(paper.paperSchedule).toDate() : null}
                                            onChange={(e) => this.handleSchedule(e, index)}
                                            minDate={new Date()}
                                        
                                        />
                                        <label>Time</label> <i className="form-text">(Leave blank if not applicable)</i>
                                        <TimePicker
                                            showSecond={false}
                                            defaultValue={paper.paperTime ? moment(paper.paperTime, 'HH:mm a'): null} //C.startTime
                                            className="xxx"
                                            placeholder="Time"
                                            onChange={(e) => this.handleTime(e, index)}
                                            format='h:mm a'
                                            use12Hours
                                            inputReadOnly
                                        />
                                        {/* <input className="form-control" defaultValue={paper.paperTime} onChange={(e) => this.handleTime(e, index)}></input> */}

                                        <label>Link</label> <i className="form-text">(Leave blank if not applicable)</i>
                                        <input placeholder="Google Meet's link" className="form-control" defaultValue={paper.venueLink} onChange={(e) => this.handleLink(e, index)}></input>

                                        <label>Score thresholds*</label>
                                        <input placeholder="Score thresholds" maxlength = "2" required className="form-control" defaultValue={paper.threshold} onChange={(e) => this.handleThreshold(e, index)} min="1" max="100"/>
                                        <br/>
                                    </div>
                                ))}
                                
                            </div>
                            {this.state.papers.length != 0 && <button className="btn btn-primary">Save</button>}
                            </form>
                            )}
                        <br/>
                        </div>
                    )}
                    </Tab>

                    <Tab eventKey="classes" title="Classes">
                    {this.state.isLoading ? (<div style={{textAlign:"center"}}><img className="img-fluid" src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>): (
                        <div>
                            <div>
                                <button className="btn btn-primary" onClick={this.addClass}>Add Class</button>
                            </div>
                            {this.state.classes.length == 0 ? (
                                <div className="d-flex flex-column justify-content-center">
                                    <div style={{ width: "v100", textAlign:"center"}}>
                                    <img style={{ width:"600px"}}  className="img-fluid"  src={require("../noresults.png").default} />
                                    </div>
                                    <span className="text-center">No records found.</span>
                                </div>
                            ): (
                                <form onSubmit={this.submitClass}>
                            <div className="d-flex justify-content-center flex-wrap paper-parent">
                                    {this.state.classes.map((c, index) => (
                                    <div key={index} className="paper-container">
                                        <h3>Class {index + 1}</h3>

                                        <label>Title*</label><i onClick={() => this.deleteClassClicked(index)} className="fas fa-trash add-btn" style={{ color:"brown" }}title="Remove paper"></i>
                                        <input required className="form-control" placeholder="e.g. Meeting your supervisor..." defaultValue={c.title} onChange={(e) => this.handleClassTitle(e, index)}></input>
                                        <label>Venue*</label>
                                        <input required className="form-control" defaultValue={c.venue} onChange={(e) => this.handleClassVenue(e, index)} placeholder="e.g. Google Meet / A001"></input>

                                        <label>Lecturer*</label> 
                                        <input required className="form-control" defaultValue={c.lecturer} onChange={(e) => this.handleClassLecturer(e, index)} placeholder="Lecturer's name"></input>

                                        <label>Start Time*</label> <i className="form-text"></i>
                                        <TimePicker
                                            className="form-control"
                                            showSecond={false}
                                            defaultValue={c.startTime ? moment(c.startTime, 'HH:mm a'): null} //C.startTime
                                            className="xxx"
                                            placeholder="Start Time"
                                            onChange={(e) => this.handleStartTime(e, index)}
                                            format='h:mm a'
                                            use12Hours
                                            inputReadOnly
                                        />

                                        <label>End Time*</label> <i className="form-text"></i>
                                        <TimePicker
                                            showSecond={false}
                                            defaultValue={c.endTime ? moment(c.endTime, 'HH:mm a'): null} //C.startTime
                                            className="xxx"
                                            placeholder="End Time"
                                            onChange={(e) => this.handleEndTime(e, index)}
                                            format='h:mm a'
                                            use12Hours
                                            inputReadOnly
                                        />
                                        <label>Date*</label> <i className="form-text"></i>
                                        {/* <input onChange={(e) => this.handleSchedule(e, index)}></input> */}
                                        <DatePicker 
                                            className="form-control"
                                            placeholderText="Date"
                                            dateFormat="dd/MM/yyyy"
                                            selected={c.date ? moment(c.date).toDate() : null}
                                            onChange={(e) => this.handleClassDate(e, index)}
                                            minDate={new Date()}
                                        
                                        />
                                        <label>Link</label> <i className="form-text">(Leave blank if not applicable)</i>
                                        <input className="form-control" defaultValue={c.link} onChange={(e) => this.handleClassLink(e, index)} placeholder="Meeting Link"></input>
                                        <br/>

                                    </div>
                                ))}
                            </div>
                            {this.state.classes.length != 0 && <button className="btn btn-primary">Save</button>}
                            </form>
                            )}
                        <br/>
                        </div>
                    )}
                    </Tab>

                    <Tab title="Registered Students" eventKey="registeredStudents" >
                        {this.state.studList.length == 0 ? (
                            <div className="d-flex flex-column justify-content-center">
                                <div style={{ width: "v100", textAlign:"center"}}>
                                <img style={{ width:"600px"}}  className="img-fluid"  src={require("../noresults.png").default} />
                                </div>
                                <span className="text-center">No records found.</span>
                            </div>
                        ):(
                            <div>
                              {this.state.module.completed == true ? (<Table columns={students_columns_completed} data={this.state.studList}></Table>):(
                                  <Table columns={students_columns} data={this.state.studList}></Table>
                              )}
                            </div>
                        )}
                    </Tab>
                </Tabs>
                </div>
            </div>
        )
    }
}