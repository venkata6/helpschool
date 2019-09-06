import React from 'react';
import {Col, Container} from "react-bootstrap";

function Introduce() {

    return (
        <section className="ftco-counter ftco-intro"
                 style={{marginTop: -118, padding: 10}} id="section-counter">
            <Container>
                <div
                    className="col-md-12 d-flex justify-content-center counter-wrap ftco-animate fadeInUp ftco-animated">
                    <div className="block-18 color-2 w-100"
                         style={{padding:0, backgroundColor: "whitesmoke"}}>
                        <div className="text my-3 mx-1" style={{textAlign: "center", fontSize: 24}}>
                            <span style={{color:"chocolate"}}>Donate school supplies. Help students achieve their potential.</span>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <Col sm={4} xs={12}
                         className="d-flex justify-content-center counter-wrap ftco-animate fadeInUp ftco-animated mt-1 mb-2 my-sm-0">
                        <div className="block-18 color-1 align-items-stretch">
                            <div className="text">
                                <h3>1</h3>
                                <p>Select the School</p>
                            </div>
                        </div>
                    </Col>
                    <Col sm={4} xs={12}
                         className="d-flex justify-content-center counter-wrap ftco-animate fadeInUp ftco-animated mt-1 mb-2 my-sm-0">
                        <div className="block-18 color-2 align-items-stretch">
                            <div className="text">
                                <h3 className="mb-4">2</h3>
                                <p>Click the item and order the items from the e-commerce sites and send directly to
                                    school</p>
                            </div>
                        </div>
                    </Col>
                    <Col sm={4} xs={12}
                         className="d-flex justify-content-center counter-wrap ftco-animate fadeInUp ftco-animated mt-1 mb-2 my-sm-0">
                        <div className="block-18 color-3 align-items-stretch">
                            <div className="text">
                                <h3 className="mb-4">3</h3>
                                <p>Track the items and see how your donations make the difference</p>
                            </div>
                        </div>
                    </Col>
                </div>
            </Container>
        </section>
    );
}

export default Introduce;

