import React, { Fragment } from 'react';
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
import { useAxiosInterceptors } from './hooks/axios';

function App() {
	useAxiosInterceptors();
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
						<Route path="/poststatistics"><PostStatistic/></Route>
					</>
				</StatisticsProvider>
			</Fragment>
		</Switch>
	);
}

export default App;
