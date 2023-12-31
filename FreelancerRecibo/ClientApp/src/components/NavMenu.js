import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
      return (
          <header>
              <Navbar className="navbar-expand-lg navbar-light" style={{ backgroundColor: '#007BFF' }}>
                  <div className="container">
                      <NavbarBrand tag={Link} to="/" style={{ color: 'white' }}>
                          ReciboFreelancer
                      </NavbarBrand>
                      <NavbarToggler onClick={this.toggleNavbar} />
                      <Collapse isOpen={!this.state.collapsed} navbar>
                          <ul className="navbar-nav ml-auto">
                              <NavItem>
                                  <NavLink tag={Link} to="/" className="nav-link" style={{ color: 'white' }}>
                                      Recibo
                                  </NavLink>
                              </NavItem>
                              <NavItem>
                                  <NavLink tag={Link} to="/Clientes" className="nav-link" style={{ color: 'white' }}>
                                      Clientes
                                  </NavLink>
                              </NavItem>
                          </ul>
                      </Collapse>
                  </div>
              </Navbar>
          </header>
    );
  }
}
