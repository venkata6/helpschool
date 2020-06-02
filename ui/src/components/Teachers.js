import React, {useRef,  useState} from 'react';
import {Col, Container, Form, Button} from "react-bootstrap";
import Alert from 'react-bootstrap/Alert'
import {useDispatch,useSelector} from 'react-redux';
import * as Actions from './../store/actions';

import Introduce from "./Introduce";

function Teachers() {

  const dispatch = useDispatch();

  const [status, setStatus] = useState("");

  const teacherNameRef = useRef(null)
  const teacherPhoneRef = useRef(null)
  const teacherEmailRef = useRef(null)
  const productUrlRef = useRef(null)
  const quantityRef = useRef(null)
  const schoolNameRef = useRef(null)
  const addressRef = useRef(null)
  const districtRef = useRef(null)
  const stateRef = useRef(null)
  const pincodeRef = useRef(null)
  const postTeachersRequest = useSelector(({schoolReducer}) => schoolReducer.postTeachersRequest);

  // function handleChange(event) {
  //   alert(event.target.name + ":" + event.target.value )
  //   alert(teacherNameRef.current.value)
  //   setTeacherName( event.target.value)
  // }

  function handleSubmit(event){
     
      event.preventDefault();
      const item = {
        teacher_name: teacherNameRef.current.value,
        teacher_email: teacherEmailRef.current.value,
        teacher_phone: teacherPhoneRef.current.value,
        url: productUrlRef.current.value,
        quantity_needed: quantityRef.current.value,
        address: schoolNameRef.current.value,
        place: addressRef.current.value,
        district: districtRef.current.value,
        state: stateRef.current.value,
        country: "India",
        photo_link: "",
        extra_info: "{}",
        pincode: pincodeRef.current.value}
     
      console.log(item)  
      dispatch(Actions.postTeacherRequest(item));
      setStatus("success")
      setStatus("failure")

      console.log("Submit clicked: ", event.target)
  }
   
  return (
          <section className={"ftco-section"}>
            <Container>
            <Alert variant="success">
            <p>
                <Alert.Heading>Add school materials you need ! </Alert.Heading>
                 1. Go to any e-commerce site and find the materials you need for your class/students <br/>
                 2. Copy the link and add also how much you need in the form below<br/>
                 3. Fill your full school address ( all fields except teacher's email are mandatory) <br/>
                 4. Submit the request<br/>
                 5. Your request will be added to database and some donor will buy and send them to the headmaster of your school<br/>
               </p>
            </Alert>
            {postTeachersRequest.status !== "success"  && (
            <Form  onSubmit={handleSubmit} >
            <Form.Row>
                <Form.Group as={Col} controlId="formTeacherName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control ref={teacherNameRef} placeholder="Teacher's name"/>
                </Form.Group>

                <Form.Group as={Col} controlId="formTeacherPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control ref={teacherPhoneRef} placeholder="Teacher's phone number" />
                </Form.Group>

                <Form.Group as={Col} controlId="formTeacherEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control ref={teacherEmailRef} type="email" placeholder="Teacher's email"/>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridUrl">
                  <Form.Label>Product URL</Form.Label>
                  <Form.Control ref={productUrlRef} placeholder="Enter URL of the product" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Quantity needed</Form.Label>
                  <Form.Control ref={quantityRef} placeholder="Quantity" />
                </Form.Group>
              </Form.Row>

              <Form.Group controlId="formGridAddress1">
                <Form.Label>School Name</Form.Label>
                <Form.Control ref={schoolNameRef} placeholder="School Name with street name - Example - Government Elementary, 10th street " />
              </Form.Group>

              <Form.Group controlId="formGridAddress2">
                <Form.Label>Village/Town/City</Form.Label>
                <Form.Control ref={addressRef} placeholder="Village, town, city etc" />
              </Form.Group>

              <Form.Row>
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>District</Form.Label>
                  <Form.Control  ref={districtRef} placeholder="District"/>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>State</Form.Label>
                  <Form.Control ref={stateRef} placeholder="state" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control ref={pincodeRef} placeholder="pincode" />
                </Form.Group>
              </Form.Row>
              <Button variant="primary" type="submit" >
                Submit
              </Button>
              <p></p>
              </Form> )}
              {postTeachersRequest.status === "success"  && (     <Alert variant="success">
                                                    <Alert.Heading>Success ! </Alert.Heading>
                                                    {postTeachersRequest.message}
                                                    </Alert>)}
              {postTeachersRequest.status === "error"  && (     <Alert variant="dark">
                                               <Alert.Heading>Failed :-(  </Alert.Heading>
                                                {postTeachersRequest.message}
                                               </Alert>)}


            
        </Container>
        </section>
    );
   
  }

export default Teachers;
