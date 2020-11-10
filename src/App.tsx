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
import { useAxiosInterceptors } from './hooks/axios';

function App() {
	useAxiosInterceptors();
	return (
		<Switch>
			<Route path="/login"><Login/></Route>
			<Route path="/registration"><Registration/></Route>

			<Fragment>
				<Header/>
				<Route path="/" exact><Home/></Route>
				<Route path="/profile"><Profile/></Route>
			</Fragment>
		</Switch>
	);
}

export default App;