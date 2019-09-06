import axios from 'axios';
export const GET_ALL_PRODUCTS = '[SCHOOL APP] GET ALL PRODUCTS';
export const GET_ALL_STATES = '[SCHOOL APP] GET ALL STATES';
export const GET_DISTS_FROM_STATE = '[SCHOOL APP] GET DISTS FROM STATE';
export const GET_PRODUCTS_LIST_FROM_DIST = '[SCHOOL APP] GET PRODUCTS LIST FROM DIST';
export const GET_PRODUCTS_GROUP = '[SCHOOL APP] GET PRODUCTS GROUP';

export function getAllProducts() {
    const request = axios.get('/api/school/getAllProducts');
    console.log('request=', request);

    return (dispatch) =>
        request.then((response) =>
                dispatch({
                    type: GET_ALL_PRODUCTS,
                    payload: response.data
                })
        );
}
export function getAllStates() {
    const request = axios.get('/api/school/getStates');
    console.log('request=', request);

    return (dispatch) =>
        request.then((response) =>
                dispatch({
                    type: GET_ALL_STATES,
                    payload: response.data
                })
        );
}

export function getDistsFromState(params) {
    const request = axios.get('/api/school/getDists', {params});

    return (dispatch) =>
        request.then((response) => {
                dispatch({
                    type: GET_DISTS_FROM_STATE,
                    payload: response.data
                })
            }
        );
}

export function getProductsListFromDist(params) {
    const request = axios.get('/api/school/getProductsListFromDist', {params});

    return (dispatch) =>
        request.then((response) => {
            console.log('result=', response);
                dispatch({
                    type: GET_PRODUCTS_LIST_FROM_DIST,
                    payload: response.data
                })
            }
        );
}

export function getProductsGroup(params) {
    const request = axios.get('/api/school/getProductsGroup', {params});

    return (dispatch) =>
        request.then((response) => {
            console.log('result=', response);
                dispatch({
                    type: GET_PRODUCTS_GROUP,
                    payload: response.data
                })
            }
        );
}
