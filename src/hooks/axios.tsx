import { default as _axios, AxiosRequestConfig } from 'axios';
import { useHistory } from 'react-router';
import { useStore } from 'react-redux';

const axios = _axios.create({
	baseURL: 'https://tecrut-social-app-api.herokuapp.com/api'
})

export const useAxiosInterceptors = () => {
	const history = useHistory();
	const store = useStore();

	axios.interceptors.request.use((config: AxiosRequestConfig) => {
		const token: string = store.getState().user.token;
		if (token) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${token}`
			}
		}
		return config;
	}, error => {
		Promise.reject(error);
	});

	axios.interceptors.response.use((response) => {
		return response
	}, function (error) {
		if (error.response.status === 401) {
			history.replace('/login');
		}
		return Promise.reject(error);
	});
};

export default axios;