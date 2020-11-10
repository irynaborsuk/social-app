import { User } from '../../types';
import { CLEAR_USER_STATE, SET_TOKEN, SET_USER, UserActionTypes } from './types';

export function setUser(newUser: User): UserActionTypes {
	return {
		type: SET_USER,
		payload: newUser
	}
}

export function setToken(newToken: string): UserActionTypes {
	return {
		type: SET_TOKEN,
		payload: newToken
	}
}

export function clearUserState(): UserActionTypes {
	return {
		type: CLEAR_USER_STATE
	}
}