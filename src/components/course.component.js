import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/components.css'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Moment from "moment"
import Table from "./table.component"


export default class Course extends Component{
    constructor(props){
        super(props)
        this.state = {
            modules: [],
            enrolled: [],
            isLoading: true,
        }

        this.click = this.click.bind(this);
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

        this.props.handlePage("course");
        JSON.parse(localStorage.getItem("user"));
        axios.get("http://localhost:5000/courses/studentList")
            .then((res) => {
                let modules = [...res.data]
                this.setState({modules})
                console.log(res.data);
        })

        axios.get("http://localhost:5000/registrations/enrolled/"+JSON.parse(localStorage.getItem("user"))._id)
          .then((res) => {
            let enrolled = [...res.data]
            this.setState({enrolled, isLoading: false})
            console.log(res.data);
          })


    }

    click(){
        console.log(this.state.modules)
    }

    render(){
        const columns_overview = [
            {
              Header: 'Name',
              accessor: 'courseTitle',
            },
            {
              Header: 'Register Start',
              accessor: row => {
                return Moment(row.startDate)
                .local()
                .format("dddd, DD MMM YY")
              }
            },
            {
              Header: 'Until',
              accessor: row => {
                return Moment(row.endDate)
                .local()
                .format("dddd, DD MMM YY")
              },
            },
            {
              Header: 'Action',
              accessor: '_id',
              disableSortBy: true,                    
              Cell: ({ cell }) => {
                return (
                  <div>
                    <Link to={"/Module/Details/"+cell.row.values._id} className="btn btn-view btn-primary" style={{color: "white"}}>View</Link>
                  </div>
                  
                )
              }
            },
      ]

      const columns_enrolled = [
            {
              Header: 'Name',
              accessor: 'courseTitle',
            },
            {
              Header: 'Registered at',
              accessor: row => {
                return Moment(row.registeredAt)
                .local()
                .format("dddd, DD MMM YY")
              }
            },
            {
              Header: 'Status',
              accessor: 'completed',
              disableSortBy: true,
              Cell: ({ cell }) => {
                  if(cell.row.values.completed){return (<span className="btn-completed">Completed</span>)}
                  else{return (<span className="btn-ongoing">Ongoing</span>)}
                  
              }
            },
            {
              Header: 'Action',
              accessor: '_id',
              disableSortBy: true,                    
              Cell: ({ cell }) => {
                return (
                  <div>
                    <Link to={"/Module/Module Details/"+cell.row.values._id} className="btn btn-view btn-primary" style={{color: "white"}}>View</Link>
                  </div>
                  
                )
              }
            },
      ]

      if(this.state.isLoading){
        return(
          <div className="card card0 border-0">
              <h2>Skill Enhancement Module</h2>
              <div class="line"></div><br></br>
              <div style={{textAlign:"center"}}><img src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
            </div>
        )
      }else{
        return(
            <div class="card card0 border-0">
                <h2>Skill Enhancement Module</h2>
                <div class="line"></div><br></br>
                <div>
                <Tabs
                    defaultActiveKey="overview"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3"
                    >
                    <Tab eventKey="overview" title="Overview">
                        {this.state.modules.length == 0 ? (
                            <div className="d-flex flex-column justify-content-center">
                              <div style={{ width: "v100", textAlign:"center"}}>
                              <img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} />
                              </div>
                              <span className="text-center">No records found.</span>
                          </div>
                          ):(
                            <Table columns={columns_overview} data={this.state.modules}/>
                            )}
                    </Tab>
                    <Tab eventKey="enrolled" title="Enrolled">
                      {this.state.enrolled.length == 0 ? (
                          <div className="d-flex flex-column justify-content-center">
                            <div style={{ width: "v100", textAlign:"center"}}>
                            <img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} />
                            </div>
                            <span className="text-center">No records found.</span>
                        </div>
                        ):(
                          <Table columns={columns_enrolled} data={this.state.enrolled} />
                        )}
                    </Tab>
                    </Tabs>
                </div>
            </div>
        )
      }
    }
}