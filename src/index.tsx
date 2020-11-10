import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { userReducer } from './store/user/reducers';
import { postsReducer } from './store/posts/reducers';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

const devToolsRedux = (window as any)?.__REDUX_DEVTOOLS_EXTENSION__();

const rootReducer = combineReducers({
	user: userReducer,
	posts: postsReducer
});

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, devToolsRedux);

ReactDOM.render(
	<React.StrictMode>
		<SnackbarProvider
			variant={'error'}
			maxSnack={3}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
		>
			<Provider store={store}>
				<Router>
					<App/>
				</Router>
			</Provider>
		</SnackbarProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
