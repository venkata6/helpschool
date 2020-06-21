import * as Actions from '../actions/index';

const initialState ={
    states: [],
    allProducts: [],
    dists: [],
    schoolsList: [],
    productsGroup: [],
    postTeachersRequest:{}
};

const schoolReducer = function (state = initialState, action) {
    switch(action.type) {
        case Actions.GET_ALL_PRODUCTS: {
            const allProductsList = []
            if ( action.payload.length > 0) {
                for ( let index = 0; index < action.payload.length; index++) {
                    allProductsList.push({ 
                        title: action.payload[index].title,
                        name: action.payload[index].title,
                        counts: action.payload[index].quantity,
                        fulfilled: action.payload[index].fulfilled_count,
                        postedAt: action.payload[index].posted_date,
                        parentId: 3,
                        url: action.payload[index].url,
                        image: "chair.jpg",
                        description: action.payload[index].description,
                        dist: "tirunelVeli"
                    })
                }
                console.log("all products " + allProductsList)
                return {...state,  allProducts: allProductsList}
            } else {
                console.log("all products else " + allProductsList)
                return {...state,  allProducts: action.payload}
            }    
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
                const schoolListFromBackend = [];
                for ( let index = 0; index < action.payload.length; index++) {
                    schoolListFromBackend.push({
                        label: action.payload[index].name + "," + action.payload[index].place, 
                        schoolId:action.payload[index].school_id , id: index,
                        name: action.payload[index].name,
                        address: action.payload[index].address})
                }
                return {...state,  schoolsList: schoolListFromBackend, productsGroup: []}
            } else {
                return {...state,  schoolsList: action.payload, productsGroup: []}
            }
  
        }
        case Actions.GET_PRODUCTS_GROUP: {
            const productDetailList = []
            if ( action.payload.length > 0) {
                for (  let index = 0; index < action.payload.length; index++) {
                    productDetailList.push({ 
                        title: action.payload[index].title,
                        name: action.payload[index].title,
                        counts: action.payload[index].quantity,
                        fulfilled: action.payload[index].fulfilled_count,
                        postedAt: action.payload[index].posted_date,
                        parentId: 3,
                        url: action.payload[index].url,
                        image: "chair.jpg",
                        description: action.payload[index].description,
                        dist: "tirunelveli"
                    })
                }
                return {...state,  productsGroup: productDetailList}
            } else {
                return {...state,  productsGroup: action.payload}
            }
        }
        case Actions.POST_TEACHERS_REQUEST: {
            
            if (typeof action.payload.error != "undefined" ) {
                console.log("POST teachers request reducer - error !" + action.payload.error)
                return {...state,  postTeachersRequest: {status:"error",message:action.payload.error}}
            } else {
                console.log("POST teachers request reducer - success !" + action.payload)
                return {...state,  postTeachersRequest: {status:"success",message:"Request submitted sucessfully"}}
            }

        }
        default:
            console.log("school reducer - default")
            console.log(state)
            return state;
    }
};

export default schoolReducer;

