import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getItem } from '../common/AsyncStorage';
import { setIsloading } from '../redux/appStateSlice';

class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      async config => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );
  }

  private async getToken(): Promise<string | null> {
    let userDetails = await getItem('userDetails');
    if (userDetails) {
      return userDetails.authToken;
    }
    return null;
  }

  public async get<T>(url: string, params?: any, dispatch?: Function): Promise<AxiosResponse<T>> {
    try {
      if (dispatch) dispatch(setIsloading(true)); 
      let res = await this.api.get<T>(url, { params });
      if (dispatch) dispatch(setIsloading(false)); 
      return res;
    } catch (error: any) {
      if (dispatch) dispatch(setIsloading(false)); 
      if (error.response) {
        const errorMsg = error.response.data?.errorMsg || 'An error occurred';
        return Promise.reject(errorMsg);
      } else if (error.request) {
        return Promise.reject('No response received from server');
      } else {
        return Promise.reject('Server Error');
      }
    }
  }

  public async post<T>(url: string, data?: any, dispatch?: Function): Promise<AxiosResponse<T>> {
    try {
      if (dispatch) dispatch(setIsloading(true)); 
      let res = await this.api.post<T>(url, data);
      if (dispatch) dispatch(setIsloading(false)); 
      return res;
    } catch (error: any) {
      if (dispatch) dispatch(setIsloading(false)); 
      if (error.response) {
        const errorMsg = error.response.data?.errorMsg || 'An error occurred';
        return Promise.reject(errorMsg);
      } else if (error.request) {
        return Promise.reject('No response received from server');
      } else {
        return Promise.reject('Server Error');
      }
    }
  }
}


const api = new ApiService('http://192.168.1.5:5000/');

export default api;
