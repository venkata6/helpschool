import React, {useEffect,  useState} from 'react';
import {Col, Container, Form, Row, ListGroup, Card, Table} from "react-bootstrap";

import * as Actions from './../store/actions';
import {format} from 'date-fns'


import {useDispatch, useSelector} from 'react-redux';

function School() {
    const dispatch = useDispatch();
    const states = useSelector(({schoolReducer}) => schoolReducer.states);
    const dists = useSelector(({schoolReducer}) => schoolReducer.dists);
    const productsList = useSelector(({schoolReducer}) => schoolReducer.productsList);
    const productsGroup = useSelector(({schoolReducer}) => schoolReducer.productsGroup);
    const [activeSchoolIndex, setActiveSchoolIndex] = useState(-1);

    const [state, setState] = useState(-1);
    const [dist, setDist] = useState(-1);
    const [productGroupId, setProductGroupId] = useState(-1);

    useEffect(() => {
        dispatch(Actions.getAllStates());
        dispatch(Actions.getAllProducts());
    }, [dispatch]);

    useEffect(() => {
        if(state!==-1)
            dispatch(Actions.getDistsFromState({state}));
    }, [dispatch, state]);

    useEffect(() => {
        if(dist!==-1)
            dispatch(Actions.getProductsListFromDist({dist}));
    }, [dispatch, dist]);

    useEffect(() => {
        if(productGroupId!==-1)
            dispatch(Actions.getProductsGroup({groupId: productGroupId, dist: dist}));
    }, [dispatch, productGroupId, dist]);

    function handleState(event)
    {
        setState(event.target.value);
        setDist(-1);
    }

    function handleDist(event)
    {
        setDist(event.target.value);
        setProductGroupId(0);
        setActiveSchoolIndex(0)
    }

    function handleProductList(id, index)
    {
        setProductGroupId(id);
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
                                    <option key={index} value={state.value}>{state.name}</option>
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
                                    <option key={index} value={dist.value}>{dist.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4} xs={12} className="schoolWrap">
                        {productsList && productsList.length>0 && (
                            <div className="card block-18 color-3 p-2">

                                <ListGroup variant="flush">
                                    {productsList && productsList.length>0 && productsList.map((list, index)=>(
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
                                <Col sm={12} className="detailWrap">
                                    {productsGroup && productsGroup.length>0 && (
                                        <Table striped bordered hover size="sm" responsive>
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Title</th>
                                                <th>Counts</th>
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
                                                    <td>{product.description}</td>
                                                    <td style={{minWidth: 100}}>{format(new Date(product.postedAt), "dd MMMM yyyy")}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Col>
                            </Row>
                        </Container>

                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default School;

