import React, {useEffect,  useState} from 'react';
import {Col, Container, Form, Row, ListGroup, Card, Table} from "react-bootstrap";

import * as Actions from './../store/actions';
import {format} from 'date-fns'
import Alert from 'react-bootstrap/Alert'

import {useDispatch, useSelector} from 'react-redux';

function School() {
    const dispatch = useDispatch();
    const states = useSelector(({schoolReducer}) => schoolReducer.states);
    const dists = useSelector(({schoolReducer}) => schoolReducer.dists);
    const schoolsList = useSelector(({schoolReducer}) => schoolReducer.schoolsList);
    const productsGroup = useSelector(({schoolReducer}) => schoolReducer.productsGroup);
    const [activeSchoolIndex, setActiveSchoolIndex] = useState(-1);

    const [state, setState] = useState(-1);
    const [dist, setDist] = useState(-1);
    //const [schoolsList, setSchoolsList] = useState([]);
    const [schoolSupplyId, setSchoolSupplyId] = useState(-1);

    useEffect(() => {
        dispatch(Actions.getAllStates());
        dispatch(Actions.getAllProducts());
    }, [dispatch]);

    useEffect(() => {
        if(state!==-1)
            //console.log("hello world - use effect")
            //console.log(state)
            dispatch(Actions.getDistsFromState({state}));
    }, [dispatch, state]);

    useEffect(() => {
        if(dist!==-1)
            console.log("hello world - use effect  get schools list- ")
            console.log(dist)
            schoolsList.length=0
            dispatch(Actions.getSchoolsListFromDist({dist}));
    }, [dispatch, dist]);

    useEffect(() => {
        if(schoolSupplyId!==-1)
            console.log("hello world - use effect - get school supply  " + schoolSupplyId + " ", schoolsList[schoolSupplyId])
            if ( schoolsList[schoolSupplyId] !== undefined) {
                dispatch(Actions.getProductsGroup({groupId: schoolSupplyId, schoolId: schoolsList[schoolSupplyId].schoolId}));    
            } 
        
    }, [dispatch, schoolsList,schoolSupplyId]);

    // function delay(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    //   }

    function handleState(event)
    {
        //console.log("handle state ", event.target.value)
        setState(event.target.value);
        setDist(-1);
    }

    function handleDist(event)
    {
        setDist(event.target.value);
        setSchoolSupplyId(0); 
        setActiveSchoolIndex(0)
    }

    function handleProductList(id, index)
    {
        setSchoolSupplyId(id);
        setActiveSchoolIndex(index);
    }

    return (
        <section className={"ftco-section"}>
            <Container>
                <Row>
                    <Col><h2>Select a School</h2></Col>
                </Row>
                <Row>
                    <Col sm={4} xs={12}>
                        <Form.Group controlId="school.country">
                            <Form.Control as="select">
                                <option >India</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col  sm={4} xs={12}>
                        <Form.Group controlId="school.state">
                            <Form.Control as="select"
                                          onChange={handleState}
                                          value={state}
                            >
                                <option value={-1}>Select a state</option>
                                {states && states.length>0 && states.map((state, index)=>(
                                    <option key={index} value={state.state_id}>{state.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col  sm={4} xs={12}>
                        <Form.Group controlId="school.dist">
                            <Form.Control as="select"
                                          onChange={handleDist}
                                          value={dist}
                            >
                                <option value={-1}>Select a dist</option>
                                {dists && dists.length>0 && dists.map((dist, index)=>(
                                    <option key={index} value={dist.district_id}>{dist.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} xs={12} className="schoolWrap">
                        {schoolsList && schoolsList.length>0 && (
                            <div className="card block-18 color-3 p-2">
                                <ListGroup variant="flush">
                                    {schoolsList && schoolsList.length>0 && schoolsList.map((list, index)=>(
                                        <ListGroup.Item key={index}  active={index===activeSchoolIndex}
                                                        onClick={()=>handleProductList(list.id, index)}
                                                        style={{background: 'transparent', cursor: 'pointer', color: 'black'}}>{list.label}</ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        )}
                    </Col>
                    <Col sm={8} xs={12}>
                        <Container>
                            <Row>
                            {schoolsList.length !==0  && (     <Alert variant="info">
                            <Alert.Heading></Alert.Heading><b>School Address:</b> Headmaster,{schoolsList[schoolSupplyId].name},{schoolsList[schoolSupplyId].address}</Alert>)}
                                <Col sm={14} className="detailWrap">
                                    {productsGroup && productsGroup.length>0 && (
                                        <Table striped bordered hover size="sm" responsive>
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Title</th>
                                                <th>Needed</th>
                                                <th>Fulfilled</th>
                                                <th>Description</th>
                                                <th>Posted At</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {productsGroup.map((product, index)=>(
                                                <tr key={index}>
                                                    <td>{index+1}</td>
                                                    <td><Card.Link href={product.url} target="_blank">{product.title}</Card.Link></td>
                                                    <td className="text-center">{product.counts}</td>
                                                    <td className="text-center">{product.fulfilled}</td> 
                                                    <td>{product.description}</td>
                                                    <td style={{minWidth: 100}}>{format(new Date(product.postedAt), "dd MMMM yyyy")}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    )}
                                    {schoolsList.length !==0 && productsGroup && productsGroup.length===0 && (     <Alert variant="success">
                                                    <Alert.Heading>No items for the selected school yet ! </Alert.Heading>
                                                    <p>
                                                    But you can still send some of the popular items to the school. ( directly to the headmaster)
                                                        Select from the following popular needed items for donation !  Feel good ! <br/> </p>
                                                    <p>
                                                    1. <a href="https://www.amazon.in/s?k=learning+aids&rh=n%3A1350380031%2Cp_n_age_range%3A1480709031%7C1665125031&dc&qid=1586709457&rnid=1480704031&ref=sr_nr_p_n_age_range_5" target="_blank">
                                                        Learning Aids
                                                    </a><br/>
                                                    2. <a href="https://www.amazon.in/MBTC-Ambient-Folding-Training-Institution/dp/B07GC293H9/ref=sr_1_36?dchild=1&keywords=school+chairs&qid=1586652767&sr=8-36" target="_blank">
                                                        School chairs
                                                    </a><br/>
                                                    3. <a href="https://www.amazon.in/POLESTAR-Casual-bagpack-School-Backpack/dp/B07PQQ8M7B/ref=sr_1_31?crid=2X3C5G567QPY7&dchild=1&keywords=school+bags+for+girls+of+15+years&qid=1586653400&sprefix=school+%2Caps%2C328&sr=8-31" target="_blank">
                                                        School bags
                                                    </a><br/>
                                                    4. <a href="https://www.amazon.in/Intra-Table-School-Rectangle-Kids/dp/B07364S8TZ/ref=sr_1_39?crid=3MOHJVOYD5ATY&dchild=1&keywords=school+bench+for+kids&qid=1586653829&sprefix=school+bench+%2Caps%2C293&sr=8-39" target="_blank">
                                                        School Study Rectangle table + 6 kids chair
                                                    </a></p>
                                                    </Alert>)}
                                    {schoolsList.length===0  && (     <Alert variant="dark">
                                                    <Alert.Heading>No school selected yet ! </Alert.Heading>
                                                    <p>
                                                        1. Please select a school <br/>
                                                        2. Note the school address <br/>
                                                        3. Select the items to donate (OR) send materials you already have <br/>
                                                        4. Go to e-commerce site <br/>
                                                        5. Send the items directly to the 'headmaster' of the school !  <br/>
                                                        6. Feel good ! <br/> </p>
                                                    </Alert>)}
                                                    
                                </Col>
                            </Row>
                        </Container>

                    </Col>
                </Row>
            </Container>
        </section>
    );
}
class NoItemsYet extends React.Component {
    render() {
      return     <Table striped bordered hover size="sm" responsive>
      No items for the selected school.But you can still send some of the popular items to the school. ( directly to the headmaster)
      <thead>
      <tr>
          <th>#</th>
          <th>Title</th>
          <th>Needed</th>
          <th>Fulfilled</th>
          <th>Description</th>
          <th>Posted At</th>
      </tr>
      </thead>
      <tbody>
      {this.props.productsGroup.map((product, index)=>(
          <tr key={index}>
              <td>{index+1}</td>
              <td><Card.Link href={product.url} target="_blank">{product.title}</Card.Link></td>
              <td className="text-center">{product.counts}</td>
              <td className="text-center">{product.fulfilled}</td> 
              {/* <td className="text-center"><Welcome name="venky"/></td> */}
              <td>{product.description}</td>
              <td style={{minWidth: 100}}>{format(new Date(product.postedAt), "dd MMMM yyyy")}</td>
          </tr>
      ))}
      </tbody>
  </Table>
  }
}

class NoItemsMessage extends React.Component {
    render() {
      return     
    //   No items for the selected school.But you can still send some of the popular items to the school. ( directly to the headmaster)


  }
}

export default School;

