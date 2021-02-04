import React, { useContext, useEffect, useState } from 'react';
import { Post } from '../types';
import { useSelector } from 'react-redux';
import { selectSortedPosts } from '../store/posts/reducers';

interface PostsStatistics {
	postCount: number;
}

export type PostsStatisticsContextState = PostsStatistics[];

const PostsStatisticsContext = React.createContext<PostsStatisticsContextState>([{
	postCount: 0
}]);

export const usePostsStatistics = () => useContext(PostsStatisticsContext);

const PostsStatisticsProvider = ({ children }: { children: JSX.Element }) => {
	const posts: Post[] = useSelector(selectSortedPosts);
	const [postsStatistics, _setPostsStatistics] = useState<PostsStatisticsContextState>([{ postCount: 0 }]);

	useEffect(function setStatistics() {
		_setPostsStatistics([{ postCount: 3 }])
	}, [posts]);

	return (
		<PostsStatisticsContext.Provider value={postsStatistics}>
			{children}
		</PostsStatisticsContext.Provider>
	)
};

export default PostsStatisticsProvider;