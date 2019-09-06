import React from 'react';
import { Container, Nav, Navbar} from "react-bootstrap";

function Header() {

    return (
        <>
            <Navbar bg="transparent" variant="dark" expand="lg" className={"ftco-navbar-light"} sticky="top">
                <Container>
                    <Navbar.Brand href="/">HelpSchool</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" aria-label="Menu"/>
                    <Navbar.Collapse id="basic-navbar-nav" className="subMenuWrap-Right">
                        <Nav className="mr-auto"/>
                        <Nav>
                            <Nav className="mr-auto">
                                <Nav.Link href="/">Home</Nav.Link>
                            </Nav>
                            <Nav className="mr-auto">
                                <Nav.Link href="#">Teachers</Nav.Link>
                            </Nav>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="hero-wrap">
                <div className="overlay"/>
                <Container>
                    <div className="row no-gutters slider-text align-items-center justify-content-center"
                         data-scrollax-parent="true">
                        <div className="col-md-7 ftco-animate text-center fadeInUp ftco-animated"
                             data-scrollax=" properties: { translateY: '70%' }"
                             style={{transform: "translateZ(0px) translateY(0%)"}}>
                        </div>
                    </div>
                </Container>
                <div className="text-right">Image:istockcredit.com-<br/>vikram suryavanshi</div>
            </div>
        </>
    )
}

export default Header
