import { CLEAR_USER_STATE, SET_TOKEN, SET_USER, UserActionTypes, UserState } from './types';
import { RootState } from '../../index';
import { LocalStorageKeys } from '../../types';


const initialState: UserState = {
	token: localStorage.getItem(LocalStorageKeys.TOKEN) || '',
	profile: {
		_id: '',
		firstName: '',
		lastName: '',
		avatar: '',
		email: ''
	}
}

export function userReducer(
	state = initialState,
	action: UserActionTypes
): UserState {
	switch (action.type) {
		case SET_TOKEN:
			return {
				...state, token: action.payload
			}
		case SET_USER:
			return {
				...state, profile: action.payload
			}
		case CLEAR_USER_STATE:
			return {
				token: '',
				profile: initialState.profile,
			}
		default:
			return state
	}
}

export const selectToken = ({ user: state }: RootState) => state.token;
export const selectUser = ({user: state}: RootState) => state.profile;