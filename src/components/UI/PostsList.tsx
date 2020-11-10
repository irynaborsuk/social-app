import React, { useEffect, Fragment } from 'react';
import axios from '../../hooks/axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectSortedPosts } from '../../store/posts/reducers';
import { setPosts } from '../../store/posts/actions';
import { AxiosResponse } from 'axios';
import PostElement from './PostElement';
import { Post, PostResponse } from '../../types';
import { useSnackbar } from 'notistack';

const PostsList = () => {
	const posts: Post[] = useSelector(selectSortedPosts);
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

	const postsList = posts.map((post: Post) => {
		return (
			<Fragment key={post._id}>
				<PostElement post={post}/>
			</Fragment>
		);
	})

	return (
		<div>
			{postsList}
		</div>
	);
};

export default PostsList;