import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { selectSortedPosts } from '../../store/posts/reducers';
import PostElement from './PostElement';
import { Post } from '../../types';

const PostsList = () => {
	const posts: Post[] = useSelector(selectSortedPosts);

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
