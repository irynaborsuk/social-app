import { PostsActionTypes, PostState, SET_POSTS, SET_SEARCHES } from './types';
import { RootState } from '../../index';
import { Post, PostResponse } from '../../types';

const initialState: PostState = {
	searchesStrings: '',
	posts: [],
}

export function postsReducer(
	state = initialState,
	action: PostsActionTypes
): PostState {
	switch (action.type) {
		case SET_POSTS:
			return {
				...state, posts: action.payload.map((post: PostResponse) => {
					return {
						...post,
						comments: []
					}
				})
			}
		case SET_SEARCHES:
			return {
				...state, searchesStrings: action.payload
			}

		default:
			return state
	}
}

export const selectSortedPosts = ({ posts: state }: RootState) => {
	const searchByContent = (content: string) => {
		return content.toLowerCase().includes(state.searchesStrings.toLowerCase());
	}

	const allPosts: Post[] = state.posts;
		const parentPosts: Post[] = allPosts.filter((post: Post) => !( !!post.parent));
	const commentPosts: Post[] = allPosts.filter((post: Post) => !!post.parent);

	const filteredPosts: Post[] = parentPosts.map((parent: Post) => {
		return {
			...parent,
			comments: commentPosts.filter((comment: Post) => parent._id === comment.parent)
		}
	});

	const sortedPosts: Post[] = filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	const searchedPosts: Post[] = sortedPosts.filter((post: Post) => {
		const postMatchesSearchQuery: boolean = searchByContent(post.content);
		const commentsMatchesSearchQuery: boolean = post.comments.some((comment: Post) => searchByContent(comment.content));
		return (postMatchesSearchQuery || commentsMatchesSearchQuery);
	})

	return searchedPosts;
}