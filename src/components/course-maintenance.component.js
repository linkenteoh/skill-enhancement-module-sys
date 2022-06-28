import React, { Component, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/components.css'
import Moment from "moment"
import Table from "./table.component"
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

export default class CourseMaintenance extends Component{
    constructor(props){
        super(props)
        this.state = {
          modules: [],
          isLoading: true,
        }
        this.deleteModule = this.deleteModule.bind(this)
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
        
        if(this.props.role != "staff"){
          this.props.history.push('/Announcement')
          return
        }
        
        this.props.handlePage("courseMaintenance")
        axios.get('http://localhost:5000/courses/')
        .then(res => {
          this.setState({modules: res.data, isLoading: false});
          console.log(this.state.modules);
        })
        .catch(error => {
          console.log("Error", error);
        })
    }

    deleteModule(id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
            let modules = [...this.state.modules]
            modules = modules.filter(a => a._id != id)
            axios.delete('http://localhost:5000/courses/'+id)
            .then(res => {
                toast.success("Module deleted successfully.", {theme:'colored'})
                this.setState({modules})
            })
        }
    })
    }
    
    render(){
        const columns = [
                  {
                    Header: 'Name',
                    accessor: 'courseTitle',
                  },
                  {
                    Header: 'Register Start',
                    accessor: 'startDate',
                    Cell: ({ cell }) => {
                      return Moment(cell.row.values.startDate)
                        .local()
                        .format("dddd, DD MMM YY")          
                    }
                  },
                  {
                    Header: 'Until',
                    accessor: 'endDate',
                    Cell: ({ cell }) => {
                      return Moment(cell.row.values.endDate)
                        .local()
                        .format("dddd, DD MMM YY")          
                    }
                  },
                  {
                    Header: 'Status',
                    accessor: 'published',
                    sortType: 'basic',
                    Cell: ({ cell }) => {
                      if(cell.row.values.published){
                      return (<span className="btn-published">Published</span>)
                      }else{
                        return (<span className="btn-unpublished">Unpublished</span>)
                      }
                    }
                  },
                  {
                    Header: 'Action',
                    accessor: '_id',
                    disableSortBy: true,                    
                    Cell: ({ cell }) => {
                      return (
                        <div>
                          <Link title="Edit" style={{marginRight:"15px"}} to={"/Module Maintenance/Edit Module/"+cell.row.values._id}><i class="fas fa-edit"></i></Link>
                          <i class="fas fa-trash fa-edit" onClick={() => this.deleteModule(cell.row.values._id)} title="Delete"></i>

                        </div>
                        
                      )
                    }
                  },
            ]
        
        if(this.state.isLoading){
          return(
            <div className="card card0 border-0">
              <h2>Module Maintenance</h2>
              <div class="line"></div><br></br>
              <div style={{textAlign:"center"}}><img src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
            </div>
          )
        }

        if(this.state.modules.length != 0){
          return(
              <div class="card card0 border-0">
                  <h2>Module Maintenance</h2>
                  <div class="line"></div><br></br>
                  <div>
                      <Link className="btn btn-primary module-btn" to="/Module Maintenance/New Module">New module</Link>                      
                      <Table columns={columns} data={this.state.modules}/>
                  </div>
              </div>
          )
        }else{
          return (
            <div class="card card0 border-0">
                  <h2>Module Maintenance</h2>
                  <div class="line"></div><br></br>
                    <div>
                      <div className="d-flex justify-content-between">
                        {/* <input
                          className="form-control search-input"
                          placeholder={`Search ...`}
                        /> */}

                        <Link className="btn btn-primary" to="/Module Maintenance/New Module">New module</Link>                      

                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <div style={{ width: "v100", textAlign:"center"}}>
                          <img style={{ width:"600px"}} src={require("./screens/noresults.png").default} />
                        </div>
                        <span className="text-center"> No records found.</span>
                      </div>
                    </div>
                  
                  <div></div>
            </div>
          )
        }
    }
}