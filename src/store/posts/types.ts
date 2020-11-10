import { Post, PostResponse } from '../../types';

export const SET_POSTS = 'SET_POSTS';
export const SET_SEARCHES = 'SET_SEARCHES';

interface SetPosts {
	type: typeof SET_POSTS;
	payload: PostResponse[];
}

interface SetSearches {
	type: typeof SET_SEARCHES;
	payload: string;
}

export interface PostState {
	searchesStrings: string;
	posts: Post[];
}

export type PostsActionTypes = SetPosts | SetSearches;