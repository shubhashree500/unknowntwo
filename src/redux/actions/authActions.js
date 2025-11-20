import baseUrl from '@/config/baseurl';
import axios from 'axios';
import Cookies from 'js-cookie';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const login = (username, password) => async (dispatch) => {
    try {
        console.log("test",username, password)
        const response = await baseUrl.post('/user/create', { username, password });
        console.log(response.data.accessToken);
        console.log(response.data.user.role);
        
        dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    } catch (error) {
        console.error("done",error); 
        dispatch({ type: LOGIN_FAILURE, payload: error.message });
    }
};