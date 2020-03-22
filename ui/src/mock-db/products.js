import mock from './mock';

const schoolsDB = {
    states: [
        {name:"TamilNadu", value:"tamilNadu"},
    ],
    dists: [
        {name: "TirunelVeli", value: "tirunelVeli", state: "tamilNadu"},
        {name: "Viruthunagar", value: "viruthunagar", state: "tamilNadu"}
    ],
    productsList: [
        {label: "GOVT HSS (B),ERUVADI,Kalakad", dist: "tirunelVeli", id: 0},
        {label: "GOVT HS NETOOR,Thenkuvalaveli,Alangulam", dist: "tirunelVeli", id: 1},
        {label: "GOVT HSS,REDDIARPATTI", dist: "tirunelVeli", id: 2},
        {label: "GHSS-PULLUKATTUVALASAI,Gunaramanallur,Keelapavoor", dist: "tirunelVeli", id: 3},
        {label: "GOVT GIRLS HSS,Thiruthangal", dist: "viruthunagar", id: 0},
        {label: "SRN BOYS HSS,Thiruthangal", dist: "viruthunagar", id: 1},
    ],
    productsDetails: [
        {
            title: "Need of Chairs",
            name: "Steel Chairs",
            counts: 15,
            postedAt: '07/08/2019',
            parentId: 0,
            url: "https://www.amazon.in/bi3-Portable-Seating-Multipurpose-Folding/dp/B07PQ83G39/ref=sr_1_6?qid=1562582426&refinements=p_36%3A3444811031&s=kitchen&sr=1-6",
            image: "chair.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "tirunelVeli"
        },
        {
            title: "Need Water Pots",
            name: "Water Pots",
            counts: 3,
            postedAt: '07/09/2019',
            parentId: 0,
            url: "https://www.indiamart.com/proddetail/earthen-water-pot-15487268412.html",
            image: "pots.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "tirunelVeli"
        },
        {
            title: "Wanted LED Lights",
            name: "LED Lights",
            counts: 5,
            postedAt: '07/10/2019',
            parentId: 0,
            url: "https://www.amazon.in/Philips-Base-9-Watt-Bulb-Light/dp/B00UHF3XDO?ref_=fsclp_pl_dp_3",
            image: "lights.jpeg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "tirunelVeli"
        },
        {
            title: "Wanted LED Lights",
            name: "LED Lights",
            counts: 5,
            postedAt: '07/09/2019',
            parentId: 1,
            url: "https://www.amazon.in/Philips-Base-9-Watt-Bulb-Light/dp/B00UHF3XDO?ref_=fsclp_pl_dp_3",
            image: "lights.jpeg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "tirunelVeli"
        },
        {
            title: "Need Water Pots",
            name: "Water Pots",
            counts: 3,
            postedAt: '07/09/2019',
            parentId: 1,
            url: "https://www.indiamart.com/proddetail/earthen-water-pot-15487268412.html",
            image: "pots.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "tirunelVeli"
        },
        {
            title: "Need Water Pots",
            name: "Water Pots",
            counts: 3,
            postedAt: '07/09/2019',
            parentId: 2,
            url: "https://www.indiamart.com/proddetail/earthen-water-pot-15487268412.html",
            image: "pots.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "tirunelVeli"
        },
        {
            title: "Wanted LED Lights",
            name: "LED Lights",
            counts: 5,
            postedAt: '07/09/2019',
            parentId: 2,
            url: "https://www.amazon.in/Philips-Base-9-Watt-Bulb-Light/dp/B00UHF3XDO?ref_=fsclp_pl_dp_3",
            image: "lights.jpeg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "tirunelVeli"
        },
        {
            title: "Need of Chairs",
            name: "Steel Chairs",
            counts: 15,
            postedAt: '07/08/2019',
            parentId: 3,
            url: "https://www.amazon.in/bi3-Portable-Seating-Multipurpose-Folding/dp/B07PQ83G39/ref=sr_1_6?qid=1562582426&refinements=p_36%3A3444811031&s=kitchen&sr=1-6",
            image: "chair.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "tirunelVeli"
        },
        {
            title: "Need of Chairs",
            name: "Steel Chairs",
            counts: 15,
            postedAt: '07/08/2019',
            parentId: 4,
            url: "https://www.amazon.in/bi3-Portable-Seating-Multipurpose-Folding/dp/B07PQ83G39/ref=sr_1_6?qid=1562582426&refinements=p_36%3A3444811031&s=kitchen&sr=1-6",
            image: "chair.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design"
        },
        {
            title: "Need Water Pots",
            name: "Water Pots",
            counts: 3,
            postedAt: '07/09/2019',
            parentId: 0,
            url: "https://www.indiamart.com/proddetail/earthen-water-pot-15487268412.html",
            image: "pots.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "viruthunagar"
        },
        {
            title: "Need Water Pots",
            name: "Water Pots",
            counts: 3,
            postedAt: '07/09/2019',
            parentId: 0,
            url: "https://www.indiamart.com/proddetail/earthen-water-pot-15487268412.html",
            image: "pots.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "viruthunagar"
        },
        {
            title: "Wanted LED Lights",
            name: "LED Lights",
            counts: 5,
            postedAt: '07/09/2019',
            parentId: 0,
            url: "https://www.amazon.in/Philips-Base-9-Watt-Bulb-Light/dp/B00UHF3XDO?ref_=fsclp_pl_dp_3",
            image: "lights.jpeg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "viruthunagar"
        },
        {
            title: "Need Water Pots",
            name: "Water Pots",
            counts: 3,
            postedAt: '07/09/2019',
            parentId: 1,
            url: "https://www.indiamart.com/proddetail/earthen-water-pot-15487268412.html",
            image: "pots.jpg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "viruthunagar"
        },
        {
            title: "Wanted LED Lights",
            name: "LED Lights",
            counts: 5,
            postedAt: '07/10/2019',
            parentId: 1,
            url: "https://www.amazon.in/Philips-Base-9-Watt-Bulb-Light/dp/B00UHF3XDO?ref_=fsclp_pl_dp_3",
            image: "lights.jpeg",
            description: "Lightweight, portable and folds flat for easy storage. Large and comfortable padding.Functional Comfortable Design",
            dist: "viruthunagar"
        },
    ]

};

// mock.onGet('/api/school/getStates').reply((config) => {
//     return [200, schoolsDB.states];
// });

// mock.onGet('/api/school/getAllProducts').reply((config) => {
//     return [200, schoolsDB.productsDetails];
// });

// mock.onGet('/api/school/getDists').reply((request) => {
//     const {state} = request.params;

//     return [200, schoolsDB.dists.filter(dist=>dist.state===state)];
// });
// mock.onGet('/api/school/getProductsListFromDist').reply((request) => {
//     const {dist} = request.params;

//     return [200, schoolsDB.productsList.filter(product=>product.dist===dist)];
// });
// mock.onGet('/api/school/getProductsGroup').reply((request) => {
//     const {groupId, dist} = request.params;

//     return [200, schoolsDB.productsDetails.filter(product=>product.parentId===groupId && product.dist===dist)];
// });
