import React from 'react';

//Child components
import Header from "./components/Header";
import Footer from "./components/Footer";
import FeaturedProducts from "./components/Featured";
import School from "./components/School";
import Introduce from "./components/Introduce";

function Main() {

    return (
        <div className="App">
            <Header/>
            {/* <Introduce/>
            <School/> */}
            {/* <FeaturedProducts/> */}
            <Footer/>
        </div>
    );
}

export default Main;

