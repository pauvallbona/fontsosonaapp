import React, {Component} from 'react';
import { Collapse, Navbar, NavbarBrand, Nav, NavbarToggler, NavItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, NavLink, Container} from 'reactstrap';

class AppNavbar extends Component {
    state = {
            isOpen: false
        }
    
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    
    render() {
        return (
        <div>
            <Navbar color="dark" dark expand="sm" className="mb-5" style={{position: "relative",zIndex:'1'}}>
                <Container>
                    <NavbarBrand href="/">Fonts d'Osona</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem ><NavLink href="#" id="maintoggle">Llista</NavLink></NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>Més </DropdownToggle>
                                <DropdownMenu right>
                                     <DropdownItem href="https://github.com/pauvallbona/fontsosonaapp">Github</DropdownItem>

                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </div>
        );
        
    }
}

export default AppNavbar;