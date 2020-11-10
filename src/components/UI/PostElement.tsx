import React, { Fragment, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { CommentForm, Post, UpdatePostRequest, User } from '../../types';
import { Button, Input, Menu, MenuItem } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import axios from '../../hooks/axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../store/user/reducers';
import { AxiosResponse } from 'axios';
import { setPosts } from '../../store/posts/actions';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid #ccc',
			borderRadius: '5px',
			margin: '10px 0'
		},
		media: {
			height: 0,
			paddingTop: '56.25%' // 16:9
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
		menuTag: {
			marginLeft: '15px'
		},
		post: {
			display: 'flex',
			flexDirection: 'column'
		},
		postInput: {
			display: 'flex',
			border: '1px solid #ccc',
			padding: '0 10px',
			borderRadius: '25px',
			margin: '0 20px'
		},
		buttonGroup: {
			display: 'flex',
			justifyContent: 'flex-end',
			marginTop: '10px'
		},
		button: {
			width: '80px',
			marginLeft: '10px'
		},
		commentBlock: {
			display: 'flex',
			borderRadius: '20px',
			margin: '10px 0'
		},
		commentButton: {
			width: '90px',
		},
		cardActionButton: {
			width: '40px',
			height: '30px',
		}
	})
);

interface PostProps {
	post: Post;
}

const PostElement = (props: PostProps) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [moreIconEl, setMoreIconEl] = React.useState<null | HTMLElement>(null);
	const isMoreIconMenuOpen = Boolean(moreIconEl);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [editContent, setEditContent] = useState(props.post.content);
	const user: User = useSelector(selectUser);
	const loading = false;
	const [commentContent, setCommentContent] = useState('');
	const [count, setCount] = useState(0);
	const moment = require('moment');
	const { enqueueSnackbar } = useSnackbar();

	const handleMoreIconClick = (event: React.MouseEvent<HTMLElement>) => {
		setMoreIconEl(event.currentTarget);
	};

	const handleMoreIconClose = () => {
		setMoreIconEl(null);
	};

	const deletePost = async () => {
		try {
			const response = await axios.delete(`./post/?id=${props.post._id}`);
			updatePostsList();
			setIsEdit(false);
			console.log(response)
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	const updatePost = async (value: UpdatePostRequest) => {
		try {
			const response = await axios.patch('/post', {
				_id: value._id,
				content: value.content
			});
			updatePostsList();
			setIsEdit(false);
			console.log(response);
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	const updatePostsList = async () => {
		try {
			const response: AxiosResponse<Post[]> = await axios.get('./post')
			dispatch(setPosts(response.data));
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	const commentRequest = async (value: CommentForm) => {
		try {
			const { data }: AxiosResponse<Comment[]> = await axios.post('/post', {
				content: value.content,
				parent: value.parent
			});
			console.log(data);
			updatePostsList();
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	const renderMoreIcon = (
		<Menu
			anchorEl={moreIconEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMoreIconMenuOpen}
			onClose={handleMoreIconClose}
		>
			<MenuItem onClick={deletePost}>
				<Delete/>
				<div className={classes.menuTag}>Delete</div>
			</MenuItem>
		</Menu>
	);

	const commentsList = props.post.comments.map((comment: Post) => {
		return (
			<Fragment key={comment._id}>
				<PostElement post={comment}/>
			</Fragment>
		)
	});

	return (
		<Card className={classes.root}>
			<CardHeader
				avatar={
					<Avatar src={props.post.createdBy.avatar} className={classes.avatar}/>

				}
				action={
					<div>
						{user._id === props.post.createdBy._id ?
							<IconButton
								aria-label="settings"
								onClick={handleMoreIconClick}
							>
								<MoreVertIcon/>
							</IconButton> : null}
					</div>
				}
				title={[props.post.createdBy.firstName, props.post.createdBy.lastName].join(' ')}
				subheader={moment(props.post.createdAt).calendar()}
			/>
			<CardContent className={classes.post}>
				<div>
					{!isEdit && props.post.content}
				</div>


				{isEdit ?
					<div>
						<Input
							value={editContent}
							fullWidth={true}
							multiline={true}
							onChange={(event) => setEditContent(event.target.value)}
						/>
						<div className={classes.buttonGroup}>
							<Button
								className={classes.button}
								variant={'contained'}
								size={'small'}
								color={'primary'}
								onClick={() => updatePost({
									_id: props.post._id,
									content: editContent
								})}
							>update</Button>
							<Button
								className={classes.button}
								variant={'outlined'}
								size={'small'}
								color={'secondary'}
								onClick={() => {
									setIsEdit(false);
									setEditContent(props.post.content);
								}}
							>cancel</Button>
						</div>
					</div>
					: user._id === props.post.createdBy._id ?
						<div className={classes.buttonGroup}>
							<Button
								className={classes.button}
								variant={'outlined'}
								size={'small'}
								onClick={() => setIsEdit(true)}
							>edit</Button>
						</div> : null}

				<div>{commentsList}</div>

				{!props.post.parent && <div className={classes.commentBlock}>
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
							className={classes.postInput}
							value={commentContent}
							onChange={(event) => setCommentContent(event.target.value)}
							fullWidth={true}
							multiline={true}
							disableUnderline={true}
							placeholder={'Write your comment...'}
						/>
					)}
					<Button
						type="submit"
						color={'primary'}
						className={classes.commentButton}
						size={'small'}
						onClick={() => {
							commentRequest({
								content: commentContent,
								parent: props.post._id
							});
							setCommentContent('');
						}}
					>comment</Button>
				</div>}
			</CardContent>

			{props.post.parent ? null :
				<CardActions disableSpacing>
					{count === 0 ?
						<Button
							className={classes.cardActionButton}
							onClick={() => setCount(count + 1)}
						>
							<FavoriteIcon/>
						</Button> :
						<Button
							className={classes.cardActionButton}
							color={'secondary'}
							onClick={() => setCount(count + 1)}
						>
							<FavoriteIcon/>
							<p style={{padding: '10px'}}>{count}</p>
						</Button>
					}
					<Button>
						<ShareIcon/>
					</Button>
				</CardActions>
			}
			{renderMoreIcon}
		</Card>
	);
};

export default PostElement;