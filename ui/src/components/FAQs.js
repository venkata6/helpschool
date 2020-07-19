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
         <div className="faq questions"> 1. How do we trust this site ? <br/></div>
          We verify the school address before we input to the system. And the items are send to 'Headmaster' only.  <br/>
          Also though teachers can request materials, we verify manually and add the requests to the site. We hope these are a deterrent against fraud for now. <br/>
          In future we plan to add more anti-fraud measures using photos etc. <br/>
          Our goal is to eliminate the NGOs ( hence the operating costs ) for donating to school and as such it requires more effort from the donors. <br/> <br/>

          <div className="faq questions">2. Does the site support private schools ?</div>
          We want to help only government and panchayat union schools as they are in need of help. <br/><br/>

          <div className="faq questions">3. I am a teacher. How to I request materials to my class ?</div>
          Please go to the 'teachers' tab and add the necessary details. We will add the request to the Schools page. Someone will fulfill the requests for you.
          Note: Materials should be a link to any e-commerce site and also e-commerice site usually need a phone number to fulfill the requests. <br/><br/> 

          <div className="faq questions">4. I want to help a school in my district. How do I do that ?</div>
          We are in the process of slowly adding government primary schools and panchayat union primary schools for each district. It is a slow process to verify the postal address and getting a teacher to participate. <br/>
          But if you dont want to wait, you can help us :-) ,  write to us to giving the postal addrees and teacher to contact for adding the school of your choice.<br/><br/>

          <div className="faq questions">5. I have a question or suggestion, how to reach you ? </div>
          Currently you can reach us through email only , email2helpschool@gmail.com <br/><br/>


       </p>
    </Alert>
    </Container>
    </section>
    );
   
  }

export default FAQs;
