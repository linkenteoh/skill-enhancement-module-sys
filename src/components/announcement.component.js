import React, { Component } from 'react';
import axios from 'axios';
import '../css/components.css'
import Table from './table.component'
import Moment from 'moment'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

export default class Announcement extends Component{
    constructor(props){
        super(props)
        this.state = {
            announcement: [],
            loading: true,
            role: "",
        }

        this.makeAnn = this.makeAnn.bind(this)
        this.editAnn = this.editAnn.bind(this)
        this.deleteAnn = this.deleteAnn.bind(this)
        this.annDetail = this.annDetail.bind(this)
    }

    componentWillMount(){
        this.props.handlePage("announcement")

        let user = JSON.parse(localStorage.getItem("user"))
        if(user == null){
            this.props.history.push('/Login')
            return
        }

        axios.get('http://localhost:5000/announcement/')
        .then((res) => {
            this.setState({announcement: res.data, loading: false})
        })
        
        this.setState({role: user.role})
    }

    makeAnn(){
        this.props.history.push('/Announcement/Make Announcement')
    }

    editAnn(id){
        this.props.history.push('/Announcement/Edit Announcement/'+id)
    }

    deleteAnn(id){
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
                let announcement = [...this.state.announcement]
                announcement = announcement.filter(a => a._id != id)
                axios.delete('http://localhost:5000/announcement/'+id)
                .then(res => {
                    toast.success("Announcement deleted successfully.", {theme:'colored'})
                    this.setState({announcement})
                })
            }
        })
    }

    annDetail(id){
        this.props.history.push('Announcement/Details/'+id)
    }
    
    render(){
        const columns = [
            {
                Header: "Title",
                accessor: "title"
            },
            {
                Header: 'Date',
                accessor: 'date',
                Cell: ({ cell }) => {
                    return Moment(cell.row.values.date )
                        .local()
                        .format("dddd, DD MMM YY")          
                }          
            },
            {
                Header: 'Sender',
                accessor: 'sender'
            },
            {
                Header: 'Action',
                accessor: '_id',
                disableSortBy: true,                    
                Cell: ({ cell }) => {
                    return (
                      <div>
                        {this.state.role == "student" && <i class="fas fa-eye fa-edit" onClick={() => this.annDetail(cell.row.values._id)} style={{marginRight:"15px"}} title="View annoucement"></i>}

                        {this.state.role == "staff" && <i class="fas fa-edit" onClick={() => this.editAnn(cell.row.values._id)} style={{marginRight:"15px"}} title="Edit"></i>}
                        {this.state.role == "staff" && <i class="fas fa-trash fa-edit" onClick={() => this.deleteAnn(cell.row.values._id)} title="Delete"></i>}
                      </div>
                    )
                  }
            }
        ]
        if(this.state.loading){
            return(
                <div className="card card0 border-0">
                    <h2>Announcement</h2>
                    <div class="line"></div><br></br>
                    <div style={{textAlign:"center"}}><img src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                </div>
            )
        }else{
            return(
                <div class="card card0 border-0">
                    <h2>Announcement</h2>
                    <div class="line"></div><br></br>
                    <div>
                    {this.state.role == "staff" && <button onClick={this.makeAnn} className="btn btn-primary module-btn">Make announcement</button>}

                        {this.state.announcement.length == 0 ? (
                            <div className="d-flex flex-column justify-content-center">
                                <div style={{ width: "v100", textAlign:"center"}}>
                                <img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} />
                                </div>
                                <span className="text-center">No announcement yet.</span>
                            </div>
                        ):(
                            <Table columns={columns} data={this.state.announcement}></Table>
                        )}
                    </div>
                </div>
            )
        }
    }
}