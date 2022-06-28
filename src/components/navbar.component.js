import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: null,
      authenticated: this.props.authenticated,
      user: {},
    }

    this.logoutHandler = this.logoutHandler.bind(this);
  }

  handleClick(page){
    this.setState({ currentPage: page })
  }

  logoutHandler(){
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // this.props.history.push('/login');
    window.location = '/Login';
  }

  // componentWillMount(){
  //   if(localStorage.getItem("authToken")){
  //     this.setState({
  //       authenticated: true,
  //     })
  //   }
  // }

  componentWillReceiveProps(props) {
    this.setState({ authenticated: false })
    if(localStorage.getItem("authToken")){
      if(localStorage.getItem("user")){
         let user = JSON.parse(localStorage.getItem("user")) 
      this.setState({user})
    }
      this.setState({
        authenticated: true,
      })
    }
  } 

  render() {
    return (
      <div>
      
      <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
        <div className="position-sticky">
          <div className="list-group list-group-flush mx-3 mt-4">

            {!this.state.authenticated && <Link to="/Register" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'register' ? 'active anchor':'' }`} onClick={() => this.handleClick('register')}>
            <i class="fa fa-user-plus fa-fw me-3" aria-hidden="true"></i> <span>Register</span>
            </Link>}

            {!this.state.authenticated && <Link to="/Login" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'login' ? 'active anchor':'' }`} onClick={() => this.handleClick('login')}>
              <i className="fas fa-sign-in-alt fa-fw me-3"></i> <span>Login</span>
            </Link>}

            {this.state.authenticated && <Link to="/Announcement" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'announcement' ? 'active anchor':'' }`} onClick={() => this.handleClick('announcement')}>
              <i className="fas fa-bullhorn fa-fw me-3"></i> <span>Announcement</span>
            </Link>}

            {this.state.authenticated && this.props.role == "staff" && <Link to="/User Maintenance" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'userMaintenance' ? 'active anchor':'' }`} onClick={() => this.handleClick('userMaintenance')}>
              <i className="fa fa-users fa-fw me-3"></i> <span>User</span>
            </Link>}


            {this.state.authenticated && this.props.role == "student" && <Link to="/Module" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'course' ? 'active anchor':'' }`} onClick={() => this.handleClick('course')}>
              <i className="fab fa-discourse fa-fw me-3"></i> <span>Module</span>
            </Link>}

            {this.state.authenticated && this.props.role == "student" && <Link to="/Certificate Status Enquiry" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'statusEnquiry' ? 'active anchor':'' }`} onClick={() => this.handleClick('statusEnquiry')}>
              <i className="fas fa-exclamation-circle fa-fw me-3"></i> <span>Status Enquiry</span>
            </Link>}

            {this.state.authenticated && this.props.role == "staff" && <Link to="/Module Maintenance" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'courseMaintenance' ? 'active anchor':'' }`} onClick={() => this.handleClick('courseMaintenance')}>
            <i className="fab fa-discourse fa-fw me-3"></i> <span>Module</span>
            </Link>}

            {this.state.authenticated && this.props.role == "staff" && <Link to="/Grading" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'grading' ? 'active anchor':'' }`} onClick={() => this.handleClick('grading')}>
              <i className="far fa-star fa-fw me-3"></i> <span>Grading</span>
            </Link>}

            {this.state.authenticated && this.props.role == "staff" && <Link to="/Certificate Issuance" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'certIssuance' ? 'active anchor':'' }`} onClick={() => this.handleClick('certIssuance')}>
              <i className="fas fa-certificate fa-fw me-3"></i> <span>Certificates Issuance</span>
            </Link>}

            {this.state.authenticated && this.props.role == "staff" && <Link to="/Report" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'report' ? 'active anchor':'' }`} onClick={() => this.handleClick('report')}>
              <i className="fas fa-file fa-fw me-3"></i> <span>Report</span>
            </Link>}

            <Link to="/Certificate Registry" className={`list-group-item list-group-item-action py-2 ripple ${this.props.currentPage == 'certRegistry' ? 'active anchor':'' }`} onClick={() => this.handleClick('certRegistry')}>
              <i className="fas fa-certificate fa-fw me-3"></i> <span>Certificates Registry</span>
            </Link>

          </div>
        </div>
      </nav>

      <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <a className="navbar-brand" href="#">
            <img
              src="https://web.tarc.edu.my/portal/images/tarucLogo.png"
              height="25"
              alt=""
              loading="lazy"
            />
            <span>  TARUC SEM System</span>
          </a>

          <ul className="navbar-nav ms-auto d-flex flex-row">

            {this.state.authenticated &&
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center position-relative parent-h"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
                
              >
                {this.state.user.email}
                <div 
                  className="position-absolute child-h">

                  {this.props.role == "student" &&
                  <li>
                  <Link style={{textDecoration:'none'}} to="/Profile"><span className="dropdown-item">My profile</span></Link>
                  </li>
                  }
                  <li>
                    <a className="dropdown-item" onClick={this.logoutHandler}>Logout</a>
                  </li>
                </div>
          
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
              >
                {this.props.role == "student" &&
                <li>
                  <a className="dropdown-item" href="#">My profile</a>
                </li>
                }
                <li>
                  <a className="dropdown-item" href="#">Settings</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">Logout</a>
                </li>
              </ul>
            </li>
            }
          </ul>
        </div>
      </nav>
    </div>
    );
  }
}