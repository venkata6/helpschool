import React from 'react';
import {Col, Container, Form, Button} from "react-bootstrap";
import Alert from 'react-bootstrap/Alert'


import Introduce from "./Introduce";

function Teachers() {

    return (
          <section className={"ftco-section"}>
            <Container>
            <Alert variant="success">
            <p>
                <Alert.Heading>Add school materials you need ! </Alert.Heading>
                 1. Go to any e-commerce site and find the materials you need for your class/students <br/>
                 2. Copy the link and add also how much you need in the form below<br/>
                 3. Fill your full school address <br/>
                 4. Submit the request<br/>
                 5. Your request will be added to database and some donor will buy and send them to the headmaster of your school<br/>
               </p>
            </Alert>
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridUrl">
                  <Form.Label>Product URL</Form.Label>
                  <Form.Control placeholder="Enter URL of the product" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Quantity needed</Form.Label>
                  <Form.Control placeholder="Quantity" />
                </Form.Group>
              </Form.Row>

              <Form.Group controlId="formGridAddress1">
                <Form.Label>Address</Form.Label>
                <Form.Control placeholder="Government Elementary" />
              </Form.Group>

              <Form.Group controlId="formGridAddress2">
                <Form.Label>Address 2</Form.Label>
                <Form.Control placeholder="Street , Village etc" />
              </Form.Group>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Village/Town/City</Form.Label>
                  <Form.Control />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>State</Form.Label>
                  <Form.Control />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control />
                </Form.Group>
              </Form.Row>
{/* 
              <Form.Group id="formGridCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group> */}

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form> 
        </Container>
        </section>
    );
}

export default Teachers;
