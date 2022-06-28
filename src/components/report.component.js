import React, { Component } from 'react';
import axios from 'axios';
import '../css/components.css'
import { Pie } from 'react-chartjs-2'
import Select from 'react-select'

export default class Report extends Component{
    constructor(props){
        super(props)
        this.state = {
            modules: [],
            completedModules: [],
            moduleSelected: null,
            moduleSelectedPR: null,

            loading: true,
            registrations: [],
            programmes: ['default'],
            data: [],
            chartData: null,

            chartTitle: null,
            report: null,
            reportSelected: [],
            reports: [
                {value:'Registrations', label:'Registrations'},
                {value:'PassingRate', label:'Passing Rate'}
            ],

            results: [],
            prLabels : ['Fail', 'Pass']
        }

        this.setChartData = this.setChartData.bind(this)
        this.handleReport = this.handleReport.bind(this)
        this.handleCourseReg = this.handleCourseReg.bind(this)
        this.handleCoursePR = this.handleCoursePR.bind(this)
        this.loadPR = this.loadPR.bind(this)
        this.loadRegistrations = this.loadRegistrations.bind(this)
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
        
        this.props.handlePage("report")
        axios.get('http://localhost:5000/courses/')
        .then(res => {
            let modules = []
            modules.push({label: "All Modules", value:null})
            res.data.forEach(c => {
                if(c.published){
                    modules.push(
                        {label: c.courseTitle, value: c._id}
                    )
                }
                
            })
            this.setState({modules})
        })

        axios.get('http://localhost:5000/courses/completed')
        .then(res => {
            let completedModules = []
            completedModules.push({label: "All Assessment", value:null})

            res.data.forEach(m => {
                completedModules.push(
                    {label: m.courseTitle, value: m._id}
                )
            })
            this.setState({completedModules})

        })

        axios.get('http://localhost:5000/userSettings/getProgrammes')
        .then(res => {
            let formattedLabel = []

            res.data.forEach(p => {
                formattedLabel.push(p.programme)
            })

            this.setState({programmes: formattedLabel})
        })

        axios.get('http://localhost:5000/results/')
        .then(res => {
            this.setState({results: res.data})
        })

        axios.get('http://localhost:5000/registrations/')
        .then(res => {
            this.setState({loading: false})
            this.setState({registrations: res.data})
        })
    }

    handleCourseReg(e){
        this.setState({moduleSelected: e})

        let regs = [...this.state.registrations]
        let labels = this.state.programmes

        if(e.value != null){
            regs = regs.filter(r => r.course == e.value)
        }
        let data = []

        for(let i = 0; i < labels.length; i++){
            data.push(0)
        }
                
        regs.forEach(r => {
            let programme = r.user.programme
            let index = labels.indexOf(programme)
            data[index] = data[index] + 1
        })

        this.setChartData(this.state.programmes, data)
    }

    handleCoursePR(e){
        this.setState({moduleSelectedPR: e})

        if(e.value != null){
            this.setState({
                chartTitle: "Passing Rate of Completed Module ( "+e.label+" )"
            })
        }else{
            this.setState({
                chartTitle: "Passing Rate of All Assessment"
            })
        }

        let results = [...this.state.results]

        if(e.value != null){
            results = results.filter(r => r.course == e.value)
        }

        let data = [0, 0]
        results.forEach(r => {
            if(r.status){
                data[1] = data[1] + 1
            }else{
                data[0] = data[0] + 1
            }
        })

        this.setChartData(this.state.prLabels, data)
    }

    handleReport(e){
        this.setState({reportSelected: e, report: e.label, moduleSelectedPR: null, moduleSelected: null})
        
        if(e.value == "PassingRate"){
            this.loadPR()
            this.setState({chartTitle: "Passing Rate of All Assessment"})
        }else if(e.value == "Registrations"){
            this.loadRegistrations()
        }
    }

    loadRegistrations(){
        let data = []
        let formattedLabel = this.state.programmes
        console.log(formattedLabel)
        let registrations = [...this.state.registrations]

        for(let i = 0; i < formattedLabel.length; i++){
            data.push(0)
        }
        
        registrations.forEach(r => {
            let programme = r.user.programme
            let index = formattedLabel.indexOf(programme)
            data[index] = data[index] + 1
        })

        console.log(data, "FINAL")

        this.setChartData(formattedLabel, data)
    }

    loadPR(){
        let results = [...this.state.results]

        let data = [0, 0]

        results.forEach(r => {
            if(r.status){   
                data[1] = data[1] + 1
            }else{
                data[0] = data[0] + 1
            }
        })
        let prLabels = ['Fail', 'Pass']
        this.setChartData(prLabels, data)
}

    setChartData(labels, data){
        this.setState({
            chartData: {
                labels: labels,
                datasets: [
                    {
                        label: '# of Votes',
                        data: data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            }
        })
    }
    
    render(){
        if(this.state.loading == true){
            return(
                <div className="card card0 border-0">
                <h2>Report</h2>
                <div class="line"></div><br></br>
                <div style={{textAlign:"center"}}><img src="https://64.media.tumblr.com/f3c9c27da8351da3aee0452bffd7f6eb/tumblr_n71kcn1ch11ttqncoo1_500.gifv" alt="LOADING"/></div>
                </div>
            )
        }else{
            return(
                <div class="card card0 border-0">
                    <h2>Report</h2>
                    <div class="line"></div><br></br>
                    <div>
                        <div className="d-flex justify-content-between">

                            <Select
                            className="basic-single"
                            isSearchable={true}
                            value={this.state.reportSelected}
                            options={this.state.reports}
                            onChange={e => this.handleReport(e)}
                            placeholder="Select ..."
                            />
                            
                            
                            {this.state.report == "Registrations" && <Select
                                className="basic-single"
                                isSearchable={true}
                                value={this.state.moduleSelected}
                                options={this.state.modules}
                                onChange={e => this.handleCourseReg(e)}
                                placeholder="Filter by module ..."
                                />}

                            {this.state.report == "Passing Rate" && <Select
                                className="basic-single"
                                isSearchable={true}
                                value={this.state.moduleSelectedPR}
                                options={this.state.completedModules}
                                onChange={e => this.handleCoursePR(e)}
                                placeholder="Choose a module ..."
                                />}

                        </div>
                        {this.state.report == null &&
                            <div className="d-flex flex-column justify-content-center">
                                <div style={{ width: "v100", textAlign:"center"}}>
                                <div><img style={{ width:"600px"}}  className="img-fluid"  src={require("./screens/noresults.png").default} /></div>
                                </div>
                            </div>
                        }

                        {this.state.report == "Registrations" &&
                        <div>
                            <div className="pie-chart">
                                <Pie 
                                    data={this.state.chartData} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: "Total Registrations From Different Programmes"
                                            },
                                            legend: {
                                                display: true,
                                                position: "bottom"
                                            }
                                        }
                                    }}
                                >
                                </Pie>

                            </div>
                        </div>
                        }

                        {this.state.report == "Passing Rate" &&
                        <div>
                            <div className="pie-chart">
                                <Pie 
                                    data={this.state.chartData} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: this.state.chartTitle
                                            },
                                            legend: {
                                                display: true,
                                                position: "bottom"
                                            }
                                        }
                                    }}
                                >
                                </Pie>

                            </div>
                        </div>
                        }
                    </div>
                </div>
            )
        }
    }
}