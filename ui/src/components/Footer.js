import React from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";

function Footer() {

    return (
        <footer className="ftco-footer ftco-section img mt-5">
            <Container>
                <Row>
                    <Col sm={4} xs={12}>
                        <div className="ftco-footer-widget mb-4">
                            <h2 className="ftco-heading-2">About Us</h2>
                            <p>Just a website trying to connect donors to teachers/schools directly</p>
                        </div>
                    </Col>
                    <Col sm={4} xs={12}>
                         <div className="ftco-footer-widget mb-4 ml-md-4">
                            {/* <h2 className="ftco-heading-2">Site Links</h2>
                            <ul className="list-unstyled">
                                <li><a href="/" className="py-2 d-block">Home</a></li>
                                <li><a href="/" className="py-2 d-block">Donate</a></li>
                                <li><a href="/" className="py-2 d-block">Causes</a></li>
                                <li><a href="/" className="py-2 d-block">Event</a></li>
                            </ul> */}
                        </div> 
                    </Col> 
                    <Col sm={4} xs={12}>
                        <div className="ftco-footer-widget mb-4">
                            <h2 className="ftco-heading-2">Have a Questions?</h2>
                            <div className="block-23 mb-3">
                                <ul>
                                    <li>
                                        <a href="#">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            <span
                                                className="text ml-3">email2helpschool@gmail.com
                                                </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    )

}

export default Footer
