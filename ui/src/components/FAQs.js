import React, {useRef,  useState} from 'react';
import {Col, Container, Form, Button} from "react-bootstrap";
import Alert from 'react-bootstrap/Alert'

function FAQs() {

   
  return (
    <section className={"ftco-section"}>
    <Container>
    <Alert variant="success">
    <p>
        <Alert.Heading>Frequently Asked Questions </Alert.Heading>
         <div className="faq questions"> <b>1. How do we trust this site ?</b> <br/></div>
          We verify the school address before we input to the system. And the items are send to 'Headmaster' only. We hope that is a deterrent against fraud. <br/>
          In future we plan to add more anti-fraud measures using photos etc. <br/>
          Our goal is to eliminate the NGOs ( hence the operating costs ) for donating to school and as such it requires more effort from the donors. <br/> <br/>
          <div className="faq questions">2. Does the site support private schools ?</div>
          We want to help only government and panchayat union schools as they are in need of help. <br/><br/>

          <div className="faq questions">3. I am a teacher. How to I request materials to my class ?</div>
          Please go to the 'teachers' tab and add the necessary details. We will add the request to the Schools page. Someone will fulfill the requests for you.
          Note: Materials should be a link to any e-commerce site and also e-commerice site usually need a phone number to fulfill the requests 


       </p>
    </Alert>
    </Container>
    </section>
    );
   
  }

export default FAQs;
