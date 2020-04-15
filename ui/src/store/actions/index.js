import axios from 'axios';
export const GET_ALL_PRODUCTS = '[SCHOOL APP] GET ALL PRODUCTS';
export const GET_ALL_STATES = '[SCHOOL APP] GET ALL STATES';
export const GET_DISTS_FROM_STATE = '[SCHOOL APP] GET DISTS FROM STATE';
export const GET_SCHOOLS_FROM_DIST = '[SCHOOL APP] GET SCHOOLS FROM DIST';
export const GET_PRODUCTS_GROUP = '[SCHOOL APP] GET PRODUCTS GROUP';

const options = {
    headers: {'Access-Control-Allow-Origin': '*'}
  };

  var bProd = false;
  var host = ""
  if ( bProd){
    host= "https://helpschool.appspot.com"
 
  }
export function getAllProducts() {

    const request = axios.get( host + '/api/schools/supplies');
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
    const request = axios.get(host + '/api/states');
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
    const request = axios.get( host + '/api/districts/state/'+params.state);

    return (dispatch) =>
        request.then((response) => {
                dispatch({
                    type: GET_DISTS_FROM_STATE,
                    payload: response.data
                })
            }
        );
}

export function getSchoolsListFromDist(params) {
    //console.log("hello world before calling backend - get schools from dist")
    //console.log(params)
    const request = axios.get(host + '/api/schools/district/'+ params.dist);

    return (dispatch) =>
        request.then((response) => {
            console.log('result=', response);
                dispatch({
                    type: GET_SCHOOLS_FROM_DIST,
                    payload: response.data
                })
            }
        );
}

export function getProductsGroup(params) {
    //console.log("hello world before calling backend - get school supplies")
    //console.log(params)
    const request = axios.get(host + '/api/schools/'+ params.schoolId   + '/supplies', {params});

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
