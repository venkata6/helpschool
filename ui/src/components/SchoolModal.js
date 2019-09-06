import React, {useState} from 'react';
import {Button, Modal, Container, Row, Col, Card} from "react-bootstrap";

function SchoolModal(props) {
    const [show, setShow] = useState(props.isOpen);

    const handleClose = () => {setShow(false); setTimeout(()=>props.onClose(), 500); };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>{props.data.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className="my-2">
                            <Col sm={3}>Item Name:</Col>
                            <Col sm={8}> {props.data.name}</Col>
                        </Row>
                        <Row className="my-2">
                            <Col sm={4}>Referenced Sites:</Col>
                            <Col sm={8}> <Card.Link href={props.data.url} target="_blank">{props.data.name}</Card.Link></Col>
                        </Row>
                        <Row className="my-2">
                            <Col sm={4}>Description:</Col>
                            <Col sm={8}> {props.data.description}</Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default SchoolModal
