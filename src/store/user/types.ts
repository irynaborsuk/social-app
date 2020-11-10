import { User } from '../../types';

export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
export const CLEAR_USER_STATE = 'CLEAR_USER_STATE';

interface SetUser {
	type: typeof SET_USER;
	payload: User;
}

interface SetToken {
	type: typeof SET_TOKEN;
	payload: string;
}

interface ClearUserState {
	type: typeof CLEAR_USER_STATE;
}

export interface UserState {
	token: string;
	profile: User;
}

export type UserActionTypes = SetUser | SetToken | ClearUserState;