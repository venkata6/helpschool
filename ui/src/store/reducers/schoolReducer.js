import * as Actions from '../actions/index';

const initialState ={
    states: [],
    allProducts: [],
    dists: [],
    productsList: [],
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
            return {...state,  dists: action.payload, productsList: [], productsGroup: []}
        }
        case Actions.GET_PRODUCTS_LIST_FROM_DIST: {
            return {...state,  productsList: action.payload, productsGroup: []}
        }
        case Actions.GET_PRODUCTS_GROUP: {
            return {...state,  productsGroup: action.payload}
        }
        default:
            return state;
    }
};

export default schoolReducer;

