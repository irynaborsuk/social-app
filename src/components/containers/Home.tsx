import React from 'react';
import { makeStyles, createStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PostsList from '../UI/PostsList';
import NewPost from '../UI/NewPost';

const useStyles = makeStyles(() =>
	createStyles({
		root: {
			flexGrow: 1,
			display: 'flex',
			justifyContent: 'center',
		},
	}),
);

export default function Home() {
	const classes = useStyles();

	return (
		<Grid spacing={3} className={classes.root}>
			<Grid
				item
				xs={12}
				md={8}
				lg={8}
			>
				<NewPost/>
				<PostsList/>
			</Grid>
		</Grid>
	);
}