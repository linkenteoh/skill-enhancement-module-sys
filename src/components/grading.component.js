import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/components.css'
import Select from 'react-select';
import Table from './table.component'
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'
import SweetAlert from 'react-bootstrap-sweetalert'
import { toast } from 'react-toastify';


export default class Grading extends Component{
    constructor(props){
        super(props)
        this.state = {
            moduleSelect: [],
            isModuleSelected: false,
            moduleSelected: null,
            currentModule: null, //Object
            assessmentSelect: [],
            assessmentSelected: null, //For select title use
            currentAssessment: null, //Obj
            gradList: [],
            displayList: false,
            assessmentName: null,

            importing: false,
        }

        this.handleModule = this.handleModule.bind(this)
        this.handleAssessment = this.handleAssessment.bind(this)
        this.handleFileUpload = this.handleFileUpload.bind(this)
        this.completed = this.completed.bind(this)
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
        
        this.props.handlePage("grading")
        axios.get("http://localhost:5000/courses")
        .then((res) => {
            let tempArr = []
            res.data.forEach(module => {
                let tempObj = {}
                tempObj.value = module._id
                tempObj.label = module.courseTitle
                tempArr.push(tempObj)
            });
            this.setState({moduleSelect: tempArr})
        })
    }

    handleModule(e){
        if(this.state.isModuleSelected == false){this.setState({isModuleSelected:true})}
        else{
            this.setState({displayList:false})
            this.setState({assessmentSelected: null})
        }//Hide table - Let user choose assessment again

        this.setState({moduleSelected: e.value})
        axios.get("http://localhost:5000/courses/"+e.value)
        .then((res) => {
            this.setState({currentModule: res.data})
        })

        axios.get("http://localhost:5000/papers/getPapers/"+ e.value)
        .then((res) => {
            let tempArr = []
            res.data.forEach(paper => {
                let tempObj = {}
                tempObj.value = paper._id
                tempObj.label = paper.paperName
                tempArr.push(tempObj)
            })
            this.setState({assessmentSelect: tempArr})
        })
    }

    handleAssessment(e){
        this.setState({assessmentSelected: e})
        console.log(e.value)
        axios.get("http://localhost:5000/papers/get/"+e.value)
        .then((res) => {
            this.setState({currentAssessment: res.data})
        })

        axios.post("http://localhost:5000/registrations/gradingList/"+this.state.moduleSelected, {assessmentId: e.value})
        .then((res) => {
            this.setState({gradList: res.data, displayList:true})
            console.log(res.data, "Gradlist")
        })
        .catch(err => console.log(err))
    }

    submitScore(index, initialValue, value){
        console.log(index, initialValue, value)
        if(value){
            if(initialValue == null){
                //ADD
                var result = {
                    score: value,
                    status: value > this.state.currentAssessment.threshold ? true : false,
                    course: this.state.moduleSelected,
                    user: this.state.gradList[index].users[0]._id,
                    paper: this.state.currentAssessment._id,
                    registration: this.state.gradList[index]._id,
                }

                axios.post("http://localhost:5000/results/add", result)
                .then((res) => {
                    let gradList = [...this.state.gradList]
                    gradList[index].threshold[0] = res.data
                    this.setState({gradList})
                })
            }else{
                //UPDATE

                var result = {
                    score: value,
                    status: value > this.state.currentAssessment.threshold ? true : false,
                }
                axios.post("http://localhost:5000/results/update/"+this.state.gradList[index].threshold[0]._id, result)
                .then((res) => {
                    let gradList = [...this.state.gradList]
                    gradList[index].threshold[0] = res.data
                    this.setState({gradList})
                    console.log(this.state.gradList, "here")
                })
            }
        }
    }

    handleFileUpload(e){
        let allowedExtension = ['.csv', '.xlsx', '.xls']
        let proceed = false

        allowedExtension.forEach((ext, index) => {
            if(e.target.value.endsWith(ext)){
                proceed = true
            }
        })

        if(proceed){
            const file = e.target.files[0]

            Swal.fire({
                title: 'File Selected',
                text: `${e.target.files[0].name}`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
              }).then((result) => {
                if (result.isConfirmed) {
                    this.setState({importing: true})
                    const reader = new FileReader()
                    const list = [];
                    reader.onload = (evt) => {
                        const bstr = evt.target.result;
                        const wb = XLSX.read(bstr, { type: 'binary' });
                        /* Get first worksheet */
                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        /* Convert array of arrays */
                        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                        const dataStringLines = data.split(/\r\n|\n/);
                        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
                        
                        for (let i = 1; i < dataStringLines.length; i++) {
                            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
                            if (headers && row.length == headers.length) {
                                const obj = {};
                                for (let j = 0; j < headers.length; j++) {
                                    if(headers[j] == "Email"){
                                        let d = row[j]
                                        if (d[0] == '"')
                                        d = d.substring(1, d.length - 1);
                                        if (d[d.length - 1] == '"')
                                        d = d.substring(d.length - 2, 1);
                                        obj[headers[j]] = d;
                                    }
        
                                    if(headers[j] == "Score"){
                                        let d = row[j]
                                        if (d[0] == '"')
                                        d = d.substring(1, d.length - 1);
                                        if (d[d.length - 1] == '"')
                                        d = d.substring(d.length - 2, 1);
        
                                        d.split('/')
                                        let s = d.split('/')[0].trim()
                                        obj[headers[j]] = s;
                                    }
                                }
        
                                    // remove the blank rows
                                if (Object.values(obj).filter(x => x).length > 0) {
                                    list.push(obj);
                                }
                            }
                        }
                        let gradList = [...this.state.gradList]
                        let counter = 1
                        let updated = false
                        console.log(gradList, "WOIIII")
                        list.forEach((l) => {
                            if(counter == list.length){
                                setTimeout(function(){
                                    this.setState({importing: false})
                                    if(updated)toast.success("Results imported successfully.", {theme:"colored"})
                                    else toast.info("Nothing has been updated.", {theme:"colored"})
                                }.bind(this), 1000)
                            }

                            let index = gradList.findIndex(x => x.users[0].email == l.Email)
                            if(index != -1)
                            {
                                console.log(index,"INDEX")
                                if(gradList[index].threshold.length == 0){
                                    this.submitScore(index, null, l.Score)
                                    counter++
                                    updated = true
                                }else{
                                    let initialValue = gradList[index].threshold[0].score
                                    this.submitScore(index, initialValue, l.Score)
                                    counter++
                                    updated = true
                                }
                            }else{
                                counter++
                            }
                        })

                    }
                    reader.readAsBinaryString(file);
                }
              })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                confirmButtonColor: '#3085d6',
                text: 'Unsupported file selected!',
            })
        }
    }

    importClicked(){
        document.getElementById('fileInput').click()
    }

    completed(){
        Swal.fire({
            title: 'Are you sure?',
            text: 'The results of this module will be published to students once marked as completed.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                console.log(this.state.currentModule.completed)
                let completed = this.state.currentModule.completed
                axios.post('http://localhost:5000/courses/toggleCompleted/'+this.state.moduleSelected, {completed})
                .then((res) => {
                    let currentModule = {...this.state.currentModule}
                    currentModule.completed = !currentModule.completed
                    this.setState({currentModule})
                    console.log(this.state.currentModule, "TOGGELD")
                })
            }
          })
    }
    
    render(){
        const EditableCell = ({
            value: initialValue,
            row: { index },
            column: { id },
          }) => {
            // We need to keep and update the state of the cell normally
            const [value, setValue] = React.useState(initialValue)
          
            const onChange = e => {
              setValue(e.target.value)
            }
          
            // We'll only update the external data when the input is blurred
            const onBlur = () => {
              this.submitScore(index, initialValue, value)
            }
          
            // If the initialValue is changed external, sync it up with our state
            React.useEffect(() => {
              setValue(initialValue)
            }, [initialValue])
          
            return <input style={{width:"48px", height:"3px"}} maxlength = "3" value={value} onChange={onChange} onBlur={onBlur} />
          }

        const columns = [
            {
                Header: 'Name',
                accessor: 'users[0].name',
            },
            {
                Header: 'Email',
                accessor: 'users[0].email'
            },
            {
                Header: 'Programme',
                accessor: 'users[0].programme'
            },
            {
                Header: 'Marks',
                accessor: 'threshold[0].score',
                disableSortBy: true,                    
                Cell: EditableCell,
            },
        ]

        const uneditable_columns = [
            {
                Header: 'Name',
                accessor: 'users[0].name',
            },
            {
                Header: 'Email',
                accessor: 'users[0].email'
            },
            {
                Header: 'Programme',
                accessor: 'users[0].programme'
            },
            {
                Header: 'Marks',
                accessor: 'threshold[0].score',
            },
        ]
        return(
            <div class="card card0 border-0">

                {this.state.importing && <SweetAlert custom customIcon="https://c.tenor.com/5o2p0tH5LFQAAAAi/hug.gif" title="Importing data..." showConfirm={false}>Please wait until all records are imported!</SweetAlert>}

                <h2>Grading</h2>
                <div class="line"></div><br></br>
                <div className="d-flex justify-content-between">
                    <Select
                    className="basic-single"
                    isSearchable={true}
                    options={this.state.moduleSelect}
                    onChange={e => this.handleModule(e)}
                    placeholder="Select module..."
                    />

                    <Select
                    className="basic-single"
                    isSearchable={true}
                    value={this.state.assessmentSelected}
                    options={this.state.assessmentSelect}
                    onChange={e => this.handleAssessment(e)}
                    placeholder="Select assessment..."
                    />
                </div>
                {this.state.displayList ? (
                    <div>
                        <br/>
                        {this.state.gradList.length == 0 ? (
                            <div className="d-flex flex-column justify-content-center">
                                <div style={{ width: "v100", textAlign:"center"}}>
                                <img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} />
                                </div>
                                <span className="text-center">No students have registered this module.</span>
                            </div>
                        ):(
                            <div>
                                {this.state.currentModule.completed == false ? (<button onClick={this.completed} className="btn btn-success module-btn">Mark as completed</button>):(<button onClick={this.completed} className="btn btn-success module-btn">Mark as incomplete</button>)}

                                {this.state.currentModule.completed == false && <button className="btn btn-primary module-btn" onClick={this.importClicked} style={{color:"white", marginRight:"10px"}}><span>Import CSV <i class="fas fa-file-csv "></i></span></button>}
                                <input
                                hidden
                                id="fileInput"
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={this.handleFileUpload}
                            />
                                {this.state.currentModule.completed == true ? (
                                <Table columns={uneditable_columns} data={this.state.gradList}></Table>

                                ):(
                                <Table columns={columns} data={this.state.gradList}></Table>
                                )}
                            </div>
                        )}
                    </div>
                ):(
                    <div className="d-flex flex-column justify-content-center">
                        <div style={{ width: "v100", textAlign:"center"}}>
                        <div><img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} /></div>
                        <span className="text-center">Please select both module and assessment option.</span>
                        </div>
                    </div>
                )}
                
            </div>
        )
    }
}