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

export default class MakeAnnouncement extends Component{
    constructor(props){
        super(props)
        this.state = {
            editorState: EditorState.createEmpty(),
            content: "",
            title: "",
            sender: "",
        }

        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.handleTitle = this.handleTitle.bind(this)
        this.handleSender = this.handleSender.bind(this)
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
    }

    handleEditorChange(state){
        this.setState({editorState: state})

        let currentContentAsHTML = convertToHTML(this.state.editorState.getCurrentContent());
        this.setState({content: currentContentAsHTML})
    }

    handleTitle(e){
        this.setState({title: e.target.value})
    }

    handleSender(e){
        this.setState({sender: e.target.value})
    }

    submit(e){
        e.preventDefault()

        Swal.fire({
            title: 'Are you sure?',
            text: "This announcement will be published to every user.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
                let announcement = {
                    title: this.state.title,
                    sender: this.state.sender,
                    message: this.state.content,
                    date: new Date(),
                }
                axios.post('http://localhost:5000/announcement/add', announcement)
                .then(res => {
                    this.props.history.push('/Announcement')
                    toast.success("Announcement published successfully.", {theme:'colored'})
                })
            }
        })
    }

    render(){
        return(
            <div class="card card0 border-0">
                <h2>Make Announcement</h2>
                <div class="line"></div><br></br>
                <form onSubmit={this.submit}>
                    <div>
                        <label>Title</label>
                        <input placeholder="Title" type="text" required onChange={this.handleTitle}/>
                        <br/>
                        <br/>

                        <label>Message</label>
                        <Editor 
                        editorState={this.state.editorState} 
                        onEditorStateChange={this.handleEditorChange}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                        />
                        <br/>
                        <label>Sender</label><br/>
                        <input style={{width:"30%"}} required onChange={this.handleSender}/>
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
