import React from 'react';

//Child components
import Header from "./Header";
import Footer from "./Footer";
//import FeaturedProducts from "./components/Featured";
import School from "./School";
import Introduce from "./Introduce";

function Home() {

    return (
        <div className="Home">
            {/* <Header/> */}
            <Introduce/>
            <School/>
            {/* <FeaturedProducts/> */} 
        </div>
    );
}

export default Home;
