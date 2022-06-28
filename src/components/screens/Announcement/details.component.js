import React, { Component } from 'react';
import axios from 'axios';
// import {Editor, EditorState} from 'draft-js';
// import 'draft-js/dist/Draft.css';

import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './makeAnnouncement.css'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import moment from 'moment'

export default class AnnouncementDetail extends Component{
    constructor(props){
        super(props)
        this.state = {
            announcement: null,
            loading: true,
        }
    }

    componentWillMount(){
        this.props.handlePage("announcement")
        let user = JSON.parse(localStorage.getItem("user"))
        if(user == null){
            this.props.history.push('/Login')
            return
        }

        axios.get('http://localhost:5000/announcement/'+ this.props.match.params.id)
        .then(res => this.setState({announcement:res.data, loading:false}))

    }

    render(){
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
                        <button className="btn btn-primary" onClick={() => this.props.history.push('/Announcement')} style={{float:"left", marginBottom:"12px"}}><i class="fas fa-arrow-left"></i> Back to home</button>
                    </div>
                    <input disabled defaultValue={this.state.announcement.title}/>
                    <div className="annContent" dangerouslySetInnerHTML={{ __html: this.state.announcement.message }} />

                    <div className="d-flex justify-content-between">
                        <div>Sender: {this.state.announcement.sender}</div>
                        <div>Date: {moment(this.state.announcement.date).local().format('DD/MM/YYYY')}</div>
                    </div>
                </div>
            )
        }
    }
}
