import * as Actions from '../actions/index';

const initialState ={
    states: [],
    allProducts: [],
    dists: [],
    schoolsList: [],
    productsGroup: [],
};

const schoolReducer = function (state = initialState, action) {
    switch(action.type) {
        case Actions.GET_ALL_PRODUCTS: {
            var productDetailList = [
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
                }
            ]
            return {...state,  allProducts: productDetailList}
            //return {...state,  allProducts: action.payload}
        }
        case Actions.GET_ALL_STATES: {
            return {...state,  states: action.payload}
        }
        case Actions.GET_DISTS_FROM_STATE: {
            //console.log("school reducer - GET_DISTS_FROM_STATE")
            //console.log(state)
            return {...state,  dists: action.payload, schoolsList: [], productsGroup: []}
        }
        case Actions.GET_SCHOOLS_FROM_DIST: {
            //console.log("School reducer - GET_SCHOOLS_FROM_DIST - ",action.payload[0].name)
            if ( action.payload.length > 0) {
                var schoolListFromBackend = [];
                for ( var index = 0; index < action.payload.length; index++) {
                    schoolListFromBackend.push(
                       {label: action.payload[index].name + "," + action.payload[index].place, 
                                schoolId:action.payload[index].school_id , id: index},
                    )
                }
                return {...state,  schoolsList: schoolListFromBackend, productsGroup: []}
            } else {
                return {...state,  schoolsList: action.payload, productsGroup: []}
            }
  
        }
        case Actions.GET_PRODUCTS_GROUP: {
            var productDetailList = []
            if ( action.payload.length > 0) {
                var productDetailList = []
                for ( var index = 0; index < action.payload.length; index++) {
                    productDetailList.push({ 
                        title: action.payload[index].title,
                        name: action.payload[index].title,
                        counts: action.payload[index].quantity,
                        postedAt: action.payload[index].posted_date,
                        parentId: 3,
                        url: action.payload[index].url,
                        image: "chair.jpg",
                        description: action.payload[index].description,
                        dist: "tirunelVeli"
                    })
                }
                return {...state,  productsGroup: productDetailList}
            } else {
                return {...state,  productsGroup: action.payload}
            }
        }
        default:
            console.log("school reducer - default")
            console.log(state)
            return state;
    }
};

export default schoolReducer;

