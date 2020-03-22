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
            return {...state,  allProducts: action.payload}
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
            return {...state,  productsGroup: action.payload}
        }
        default:
            console.log("school reducer - default")
            console.log(state)
            return state;
    }
};

export default schoolReducer;

