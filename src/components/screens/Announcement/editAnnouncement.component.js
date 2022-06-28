import React, { Component } from 'react';
import axios from 'axios';
// import {Editor, EditorState} from 'draft-js';
// import 'draft-js/dist/Draft.css';

import { EditorState, createFromBlockArray, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './makeAnnouncement.css'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

export default class EditAnnouncement extends Component{
    constructor(props){
        super(props)
        this.state = {
            editorState: null,
            loading: true,
            announcement: null,
        }

        this.handleTitle = this.handleTitle.bind(this)
        this.handleSender = this.handleSender.bind(this)
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.submit = this.submit.bind(this)
    }

    componentWillMount(){
        this.props.handlePage("announcement")
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

        axios.get('http://localhost:5000/announcement/'+this.props.match.params.id)
        .then((res) => {
            console.log(res.data)

            let markup = res.data.message
            let blocksFromHTML = convertFromHTML(markup)
            let state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
              );

            this.setState({editorState: EditorState.createWithContent(state)})
            this.setState({announcement: res.data, loading: false})
        })
    }

    handleTitle(e){
        let announcement = {...this.state.announcement}
        announcement.title = e.target.value
        this.setState({announcement})
    }

    handleSender(e){
        let announcement = {...this.state.announcement}
        announcement.sender = e.target.value
        this.setState({announcement})
    }

    handleEditorChange(state){
        this.setState({editorState: state})
        let currentContentAsHTML = convertToHTML(this.state.editorState.getCurrentContent());

        let announcement = {...this.state.announcement}
        announcement.message = currentContentAsHTML
        this.setState({announcement})
    }

    submit(e){
        e.preventDefault()
        
        axios.post('http://localhost:5000/announcement/update/'+this.props.match.params.id, this.state.announcement)
        .then((res) => {
            toast.success("Announcement updated successfully.", {theme:'colored'})
            this.props.history.push('/Announcement')
        })
    }

    render(){
        if(this.state.loading){
            return(
                <div className="card card0 border-0">
                    <h2>Edit Announcement</h2>
                    <div class="line"></div><br></br>
                    <div style={{textAlign:"center"}}><img src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                </div>
            )
        }else{
            return(
                <div class="card card0 border-0">
                    <h2>Edit Announcement</h2>
                    <div class="line"></div><br></br>

                    <form onSubmit={this.submit}>
                        <div>
                            <label>Title</label>
                            <input placeholder="Title" type="text" defaultValue={this.state.announcement.title} required onChange={this.handleTitle}/>
                            <br/>
                            <br/>

                            <label>Message</label>
                            <Editor 
                            defaultContentState={this.state.announcement.message}
                            editorState={this.state.editorState} 
                            onEditorStateChange={this.handleEditorChange}
                            wrapperClassName="wrapper-class"
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                            />
                            <br/>
                            <label>Sender</label><br/>
                            <input style={{width:"30%"}} defaultValue={this.state.announcement.sender} required onChange={this.handleSender}/>
                        </div>

                        <div>
                            <br/>
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            )
        }
    }
}
