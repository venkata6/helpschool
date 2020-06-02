import axios from 'axios';
export const GET_ALL_PRODUCTS = '[SCHOOL APP] GET ALL PRODUCTS';
export const GET_ALL_STATES = '[SCHOOL APP] GET ALL STATES';
export const GET_DISTS_FROM_STATE = '[SCHOOL APP] GET DISTS FROM STATE';
export const GET_SCHOOLS_FROM_DIST = '[SCHOOL APP] GET SCHOOLS FROM DIST';
export const GET_PRODUCTS_GROUP = '[SCHOOL APP] GET PRODUCTS GROUP';
export const POST_TEACHERS_REQUEST = '[SCHOOL APP] POST TEACHERS REQUEST';

const options = {
    headers: {'Access-Control-Allow-Origin': '*'}
  };

  var bProd = true;
  var host = ""
  if ( bProd){
    host= "https://helpschool.appspot.com"
  } else {
      host="http://localhost:8080"
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

export function postTeacherRequest(item) {
    console.log("hello world before calling backend - POST teacher request - teacher name is  " + item.teacher_name)

    const request = axios.post(host + '/api/teachers/requests',{ 
        teacher_name: item.teacher_name,
        teacher_email: item.teacher_email,
        teacher_phone: item.teacher_phone,
        url: item.url,
        quantity_needed: parseInt(item.quantity_needed) ,
        address: item.address,
        place: item.place,
        district: item.district,
        state: item.state,
        country: "India",
        photo_link: "",
        extra_info: "{}",
        pincode: item.pincode})
 
    console.log("after POST")
      
    return (dispatch) =>
        request.then((response) => {
            console.log('result=', response);
                dispatch({
                    type: POST_TEACHERS_REQUEST,
                    payload: response
                })
            }
        ).catch(function (error) {
            console.log('error=', error.response.data);
            dispatch({
                type: POST_TEACHERS_REQUEST,
                payload: error.response.data
            })
        }).then(function () {
            // always executed
            console.log('always executes');
          });;
    }