import React, {useEffect} from 'react';
import {Col, Container, Row, Card, ProgressBar} from "react-bootstrap";

import * as Actions from './../store/actions';
import {useDispatch, useSelector} from 'react-redux';


import {format} from 'date-fns'
import Slider from "react-slick";


function FeaturedProducts() {
    const dispatch = useDispatch();
    const allProducts = useSelector(({schoolReducer}) => schoolReducer.allProducts);

    useEffect(() => {
        dispatch(Actions.getAllProducts());
    }, [dispatch]);

    let settings = {
        dots: true,
        infinite: true,
        speed: 2500,
        slidesToShow: 4,
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    return (
        <section className="bg-light pt-2 pb-5">
            <Container>
                <Row>
                    <Col>
                        <h2 className="mb-2 text-center">Featured schools products</h2>
                    </Col>
                </Row>
            </Container>
            <Container fluid={true}>
                <Row>
                    <Col>
                        <div className="p-0 p-sm-4">
                            {allProducts && allProducts.length>0 && (
                                <Slider {...settings}>
                                    {allProducts.map((product, index)=>(
                                        <div key={index} className="featured">
                                            <Card style={{margin: "24px 12px" }}>
                                                <div style={{height: 280,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: '50% 50%',
                                                    backgroundImage: `url(../../assets/images/products/${product.image})`}}/>
                                                <Card.Body>
                                                    <Card.Title><Card.Link href={product.url} target="_blank">{product.title}</Card.Link></Card.Title>
                                                    <Card.Text>
                                                        {product.description}
                                                    </Card.Text>
                                                    <span className="donation-time mb-3 d-block">Last donation 1w ago</span>
                                                    <ProgressBar variant="warning" now={20} style={{height: '.3rem'}} className="mb-2"/>
                                                    <Card.Text>PostedAt: {format(new Date(product.postedAt), "dd MMMM yyyy")}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </div>

                                    ))}

                                </Slider>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

        </section>
    );
}

export default FeaturedProducts;

