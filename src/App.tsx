import React, { Fragment, useEffect } from 'react';
import './App.css';
import {
	Switch,
	Route
} from 'react-router-dom';
import Login from './components/containers/Login';
import Registration from './components/containers/Registration';
import Header from './components/UI/Header';
import Home from './components/containers/Home';
import Profile from './components/containers/Profile';
import StatisticsProvider from './providers/statistics.provider';
import PostStatistic from './components/containers/PostStatistic';
import axios, { useAxiosInterceptors } from './hooks/axios';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { AxiosResponse } from 'axios';
import { PostResponse } from './types';
import { setPosts } from './store/posts/actions';

function App() {
	useAxiosInterceptors();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const getPosts = async () => {
		try {
			const response: AxiosResponse<PostResponse[]> = await axios.get('./post')
			dispatch(setPosts(response.data));
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	useEffect(() => {
		getPosts();
	}, []);

	return (
		<Switch>
			<Route path="/login"><Login/></Route>
			<Route path="/registration"><Registration/></Route>

			<Fragment>
				<Header/>
				<StatisticsProvider>
					<>
						<Route path="/" exact><Home/></Route>
						<Route path="/profile"><Profile/></Route>
						<Route path="/posts-statistics"><PostStatistic/></Route>
					</>
				</StatisticsProvider>
			</Fragment>
		</Switch>
	);
}

export default App;
