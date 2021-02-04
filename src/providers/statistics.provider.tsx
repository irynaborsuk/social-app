import React, { useContext, useEffect, useState } from 'react';
import { CreatedBy, Post, PostResponse } from '../types';
import { useSelector } from 'react-redux';
import { selectSortedPosts } from '../store/posts/reducers';

interface Statistics {
	userName: string,
	postsCount: number,
	commentsCount: number,
	contentSymbolsCount: number,
	lastUpdated: string,
	lastCreated: string
}

export type StatisticsContextState = Statistics[];

const initialValues: Statistics = {
	userName: '',
	postsCount: 0,
	commentsCount: 0,
	contentSymbolsCount: 0,
	lastUpdated: '',
	lastCreated: ''
}

const StatisticsContext = React.createContext<StatisticsContextState>([initialValues])

export const useStatistics = () => useContext(StatisticsContext);

const StatisticsProvider = ({ children }: { children: JSX.Element }) => {
	const posts: Post[] = useSelector(selectSortedPosts);
	const [statistics, _setStatistics] = useState<StatisticsContextState>([initialValues])

	const _generateStatistics = (posts: Post[]) => {
		if ( !posts.length) {
			return [];
		}

		// TODO: Learn Map: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map
		// TODO: Learn Set: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Set

		// const usersMap = new Map<string, CreatedBy>();
		//
		// for (const post of posts) {
		// 	if ( !usersMap.has(post.createdBy._id)) {
		// 		usersMap.set(post.createdBy._id, post.createdBy);
		// 	}
		// }
		//
		// const uniqueUsers: CreatedBy[] = Array.from(usersMap.values());

		const uniqueUsers: CreatedBy[] = [];

		posts.forEach(p => {
			const uniqueUserIds: string[] = uniqueUsers.map(u => u._id); // відбирає юзерів по id
			if ( !uniqueUserIds.includes(p.createdBy._id)) { // провіряє якщо юзера ще не добавлено
				uniqueUsers.push(p.createdBy); // добавляє нового юзера в масив
			}
		});

		return uniqueUsers.map((user: CreatedBy) => {
			const allPosts: PostResponse[] = [];

			posts.forEach(({ comments, ...postResponse }) => {
				allPosts.push(postResponse);
				comments.forEach(({ comments, ...postResponse }) => {
					allPosts.push(postResponse);
				})
			})

			const lastUpdatedPost = allPosts.filter(p => p.createdBy._id === user._id)
				.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
				[0].updatedAt;

			const lastCreatedPost = allPosts.filter(p => p.createdBy._id === user._id)
				.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
				[0].createdAt;

			return {
				userName: `${user.firstName} ${user.lastName}`,
				postsCount: posts.filter(p => p.createdBy._id === user._id).length, // filter відібрав всі пости конкретного юзера, .length - показує довжину масива (кількість постів), а не текст постів
				commentsCount: posts.map(p => {
					return p.comments.filter(c => c.createdBy._id === user._id)
				}).reduce((prev, curr) => [...prev, ...curr], []).length,
				contentSymbolsCount: allPosts
					.filter(p => p.createdBy._id === user._id)
					.map(({ content }) => content.split(' ').join('').trim()).join('').trim().length,
				lastUpdated: lastUpdatedPost,
				lastCreated: lastCreatedPost,
			};
		})
	}

	useEffect(function setStatistics() {
		_setStatistics(_generateStatistics(posts));
	}, [posts])

	return (
		<StatisticsContext.Provider value={statistics}>
			{children}
		</StatisticsContext.Provider>
	);
};

export default StatisticsProvider;
