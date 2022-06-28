import React, { Component } from 'react';
import axios from 'axios';
import '../css/components.css'
import { toast } from 'react-toastify';
import Table from './table.component'
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'

export default class QuickCert extends Component{
    constructor(props){
        super(props)
        this.state = {
            importing: false,
        }

        this.handleFileUpload = this.handleFileUpload.bind(this)
    }

    componentWillMount(){
        this.props.handlePage("quickCert")

        
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

                        for(let f = 0; f <= wb.SheetNames.length; f++){
                            const wsname = wb.SheetNames[f];
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
                                        let d = row[j];
                                        if (d.length > 0) {
                                            if (d[0] == '"')
                                                d = d.substring(1, d.length - 1);
                                            if (d[d.length - 1] == '"')
                                                d = d.substring(d.length - 2, 1);
                                        }
                                        if (headers[j]) {
                                            obj[headers[j]] = d;
                                        }
                                    }
                                    console.log(list)
                                        // remove the blank rows
                                    if (Object.values(obj).filter(x => x).length > 0) {
                                        obj.module = []
                                        obj.module.push(wsname)
                                        list.push(obj);
                                    }
                                }
                            }
                        }
                        

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
    
    render(){
        return(
            <div class="card card0 border-0">
                <h2>Quick Certificates Generation</h2>
                <div class="line"></div><br></br>
                <div>
                <button className="btn btn-primary module-btn" onClick={this.importClicked} style={{color:"white", marginRight:"10px"}}><span>Import CSV <i class="fas fa-file-csv "></i></span></button>
                <input
                hidden
                id="fileInput"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={this.handleFileUpload}
                />

                </div>
            </div>
        )
    }
}