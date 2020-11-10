import { PostResponse } from '../../types';
import { PostsActionTypes, SET_POSTS, SET_SEARCHES } from './types';

export function setPosts(newPosts: PostResponse[]): PostsActionTypes {
	return {
		type: SET_POSTS,
		payload: newPosts,
	}
}

export function setSearchString(newSetSearchString: string): PostsActionTypes {
	return {
		type: SET_SEARCHES,
		payload: newSetSearchString,
	}
}