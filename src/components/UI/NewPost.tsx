import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { NewPostForm, Post, User } from '../../types';
import axios from '../../hooks/axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../store/user/reducers';
import { Button, CircularProgress, Input } from '@material-ui/core';
import { AxiosResponse } from 'axios';
import { setPosts } from '../../store/posts/actions';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			flexDirection: 'column',
			marginBottom: '10px',
			border: '1px solid #ccc',
			borderRadius: '5px',
		},
		media: {
			height: 0,
			paddingTop: '56.25%',
		},
		expand: {
			transform: 'rotate(0deg)',
			marginLeft: 'auto',
			transition: theme.transitions.create('transform', {
				duration: theme.transitions.duration.shortest
			})
		},
		expandOpen: {
			transform: 'rotate(180deg)'
		},
		avatar: {
			backgroundColor: red[500]
		},
		cardContent: {
			display: 'flex',
			padding: '10px 20px'
		},
		cardContentInput: {
			display: 'flex',
			border: '1px solid #ccc',
			padding: '0 10px',
			borderRadius: '25px',
			marginLeft: '20px'
		}
	})
);

const NewPost = () => {
	const classes = useStyles();
	const loading = false;
	const user: User = useSelector(selectUser);
	const dispatch = useDispatch();
	const [newPostContent, setNewPostContent] = useState('');
	const isClicked = false;
	const { enqueueSnackbar } = useSnackbar();

	const postRequest = async (value: NewPostForm) => {
		try {
			const { data }: AxiosResponse<Post> = await axios.post('/post', {
				content: value.content,
			});
			console.log(data);
			updatePostsList();
		}
		catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	const updatePostsList = async () => {
		try {
			const response: AxiosResponse<Post[]> = await axios.get('./post')
			dispatch(setPosts(response.data));
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className={classes.root}>
			<CardContent className={classes.cardContent}>
				{loading ? (
					<Skeleton animation="wave" variant="circle" width={40} height={40}/>
				) : (
					<Avatar src={user.avatar} className={classes.avatar}/>
				)}
				{loading ? (
					<Skeleton animation="wave" variant="rect"/>
				) : (
					<Input
						name="content"
						type="text"
						value={newPostContent}
						onChange={(event) => setNewPostContent(event.target.value)}
						className={classes.cardContentInput}
						fullWidth={true}
						multiline={true}
						disableUnderline={true}
						placeholder={'Write something to create a new post'}
					/>
				)}
			</CardContent>
			<CardActions disableSpacing>
				{isClicked ?
					<CircularProgress/>
					:
					<Button
						type="submit"
						variant={'outlined'}
						color={'primary'}
						onClick={() => {
							postRequest({
								content: newPostContent
							});
							setNewPostContent('');
						}}
					>Post</Button>
				}
			</CardActions>
		</div>
	);
};

export default NewPost;