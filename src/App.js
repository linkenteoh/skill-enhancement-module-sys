import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import 'react-toastify/dist/ReactToastify.css';
import React, { Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';


// Routing
import PrivateRoute from './components/routing/PrivateRoute';

// Screens
import PrivateScreen from './components/screens/PrivateScreen';

import Navbar from "./components/navbar.component";
import Register from "./components/register.component";
import Login from "./components/login.component";
import Profile from "./components/profile.component";
import StatusEnquiry from "./components/statusEnquiry.component";
import Announcement from "./components/announcement.component";
import MakeAnnouncement from "./components/screens/Announcement/makeAnnouncement.component";
import EditAnnouncement from "./components/screens/Announcement/editAnnouncement.component";
import AnnouncementDetail from "./components/screens/Announcement/details.component";
import Course from "./components/course.component";
import UserMaintenance from "./components/screens/Maintenance/user-maintenance.component";
import CourseMaintenance from "./components/course-maintenance.component";
import Grading from "./components/grading.component";
import CertIssuance from "./components/certIssuance.component";
import Report from "./components/report.component";
import CertRegistry from "./components/certRegistry.component";
import Breadcrumb from "./components/breadcrumb.component";
import ForgotPassword from "./components/forgotPassword.component";
import ResetPassword from "./components/resetPassword.component";
import NewModule from "./components/screens/Maintenance/newModule.component";
import EditModule from './components/screens/Maintenance/editModule.component';
import ModuleDetails from "./components/screens/Modules/moduleDetails.component";
import EnrolledModuleDetails from "./components/screens/Modules/enrolledModuleDetails.component";
import CertStatus from './components/screens/Issuance/certStatus.component';
import Page404 from './components/screens/Error/404';
import CertCheck from './components/screens/Registry/certcheck.component';
import EditUser from './components/screens/Maintenance/editUser.component';
import QuickCert from './components/quickcert.component'

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <br/>
    
//       <main style={{marginTop: "58px"}} >
//         <div className="container">
//           <Route path="/" exact component = {ExercisesList} />
//           <Route path="/edit/:id" component = {EditExercise} />
//           <Route path="/create" component = {CreateExercise} />
//           <Route path="/user" component = {CreateUser} />
//           <Route path="/login" component = {Login}/>
//         </div>
//       </main>
//     </Router>
//   );
// }
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: null,
      role: null,
      authenticated: false,
      user: {},
    };

    this.handlePage = this.handlePage.bind(this);
    this.handleRole = this.handleRole.bind(this);
    this.handleUser = this.handleUser.bind(this);
  }

  handlePage(currentPage){this.setState({currentPage})}
  handleRole(role){this.setState({role})}
  handleUser(user){this.setState({authenticated: true, user: user})}

  componentWillMount(){
    if(localStorage.getItem("user")){
      this.setState({authenticated: true, user: JSON.parse(localStorage.getItem("user"))})
    }
  }

  componentDidMount(){
    toast.configure();
    console.log(this.state.user, this.state.authenticated)

    if (window.performance) {
      if (performance.navigation.type == 1) {
        if(localStorage.getItem("user")){
          const user = JSON.parse(localStorage.getItem("user"));
          this.setState({role: user.role})
        }
  

      } else {
        if(localStorage.getItem("user")){
          const user = JSON.parse(localStorage.getItem("user"));
          this.setState({role: user.role})
        }
      }
    }
  }

  

  render() {
    return (
      <Router>
      <Switch>

      <Route path="/certcheck/:id" exact render={(props) => <CertCheck {...props} />}/>
      <Fragment>            
        <Navbar currentPage = {this.state.currentPage} role = {this.state.role}/>
        <br/>
        <main style={{marginTop: "32px"}} >
         
        {this.state.authenticated ? (
          <div>
            {this.state.user.verified ? (
              <div style={{width:"100%", backgroundColor:"none", marginTop:"28px"}}>ㅤ</div>
              ):(
              <div>
                  {this.state.role == "student" && 
                  <div className="alert-verify">
                    <div className="containers">
                      <span style={{color:"white"}}>Your profile is not verified yet!</span> <Link to="/Profile"><span className="btn btn-primary">Verify now</span></Link>
                    </div>
                  </div>
                  }

                  {
                    this.state.role == "staff" &&
                    <div style={{width:"100%", backgroundColor:"none", marginTop:"28px"}}>ㅤ</div>

                  }
              </div>
            )}
          </div>
        ):(
          <div style={{width:"100%", backgroundColor:"none", marginTop:"28px"}}>ㅤ</div>
        )}

         <div className="containers">
           <Breadcrumb />
            <Route path="/" exact render={(props) => <Announcement 
              {...props} 
              handlePage = {this.handlePage} 
              role = {this.state.role} />}/>

            <Route path="/Login" render={(props) => <Login 
            {...props} 
            handlePage = {this.handlePage} 
            handleRole = {this.handleRole}
            handleUser = {this.handleUser}
            role = {this.state.role}/>}/>

            <Route path="/Register" render={(props) => <Register 
            {...props} 
            handlePage = {this.handlePage} 
            handleRole = {this.handleRole} 
            handleUser = {this.handleUser}
            role = {this.state.role}/>}/>

            <Route path="/Forgot Password" render={(props) => <ForgotPassword 
            {...props} handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route path="/Reset Password/:resetToken" render={(props) => <ResetPassword 
            {...props} handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route path="/Profile" render={(props) => <Profile 
            {...props} handlePage = {this.handlePage} 
            handleUser = {this.handleUser}
            role = {this.state.role} />}/>

            <Route exact path="/Module" render={(props) => <Course 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Certificate Status Enquiry" render={(props) => <StatusEnquiry 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Announcement" render={(props) => <Announcement 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Announcement/Make Announcement" render={(props) => <MakeAnnouncement 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Announcement/Edit Announcement/:id" render={(props) => <EditAnnouncement 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Announcement/Details/:id" render={(props) => <AnnouncementDetail
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Module/Details/:id" render={(props) => <ModuleDetails 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Module/Module Details/:id" render={(props) => <EnrolledModuleDetails 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/User Maintenance" render={(props) => <UserMaintenance 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/User Maintenance/Edit User/:id" render={(props) => <EditUser 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>
              
            <Route exact path="/Module Maintenance" render={(props) => <CourseMaintenance 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Module Maintenance/New Module" render={(props) => <NewModule 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Module Maintenance/Edit Module/:id" render={(props) => <EditModule 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route path="/Grading" render={(props) => <Grading 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Certificate Issuance" render={(props) => <CertIssuance 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route exact path="/Certificate Issuance/Certificate Status/:id" render={(props) => <CertStatus 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

          <Route exact path="/Quick Certs" render={(props) => <QuickCert 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            <Route path="/Report" render={(props) => <Report 
            {...props} 
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>
            
            <Route path="/Certificate Registry" render={(props) => <CertRegistry 
            {...props} 
            exact
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

            {/* <Redirect from='*' to='/Page404' />  */}


            <Route path="/Page404" render={(props) => <Page404 
            {...props} 
            exact
            handlePage = {this.handlePage} 
            role = {this.state.role} />}/>

         </div>
       </main>
      </Fragment>

      </Switch>
     </Router>
    );
  }
}

export default App;
