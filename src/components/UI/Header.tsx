import React, { useEffect, useState } from 'react';
import { fade, makeStyles, Theme, createStyles, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useHistory } from 'react-router';
import { ExitToApp, Home } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectUser } from '../../store/user/reducers';
import { LocalStorageKeys, User } from '../../types';
import axios from '../../hooks/axios';
import { clearUserState, setUser } from '../../store/user/actions';
import { Avatar, Grid, useMediaQuery } from '@material-ui/core';
import { setSearchString } from '../../store/posts/actions';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		grow: {
			flexGrow: 1,
			"& .MuiAppBar-colorPrimary": {
				height: '50px',
				backgroundColor: 'black',
			},
			"& .MuiToolbar-regular": {
				minHeight: '100%',
			},
			marginBottom: '10px',
		},
		menuButton: {
			width: '100%',
		},
		menuTag: {
			marginLeft: '15px',
		},
		title: {
			fontSize: '22px',
			marginRight: '20px',
		},
		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25),
			},
			marginRight: theme.spacing(2),
			marginLeft: 0,
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(3),
				width: 'auto',
			},
		},
		searchIcon: {
			padding: theme.spacing(0, 2),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		inputRoot: {
			color: 'inherit',
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 0),
			paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('md')]: {
				width: '20ch',
			},
		},
		sectionDesktop: {
			display: 'none',
			[theme.breakpoints.up('md')]: {
				display: 'flex',
			},
		},
		sectionMobile: {
			display: 'flex',
			[theme.breakpoints.up('md')]: {
				display: 'none',
			},
		},
		small: {
			width: theme.spacing(3),
			height: theme.spacing(3),
		},
		userIconButton: {
			fontSize: '20px',
		},
		userName: {
			marginRight: '10px'
		}
	}),
);

const theme = createMuiTheme({});

const HeaderAppBar = () => {
	const user: User = useSelector(selectUser);
	const history = useHistory();
	const token: string = useSelector(selectToken);
	const dispatch = useDispatch();
	const classes = useStyles();
	const sm = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();

	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const request = async () => {
		setIsLoading(true);
		try {
			const { data }: { data: User } = await axios.get('/profile');
			dispatch(setUser(data));
			setIsLoading(false);
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
			setIsLoading(false);
		}
	}

	useEffect(() => {
		request();
	}, [token]);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Menu

			anchorEl={anchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMenuOpen}
			onClose={handleMenuClose}
			onClick={() => setAnchorEl(null)}
		>
			<MenuItem
				className={classes.menuButton}
				onClick={() => {

					history.push('/profile')
				}}>
				{!isLoading ? <Avatar src={user.avatar} className={classes.small}/> : <AccountCircle/>}
				<div className={classes.menuTag}>Profile</div>
			</MenuItem>
			<MenuItem
				className={classes.menuButton}
				onClick={() => {
					history.push('/login');
					localStorage.removeItem(LocalStorageKeys.TOKEN);
					dispatch(clearUserState());
				}}>
				<ExitToApp/>
				<div className={classes.menuTag}>Log out</div>
			</MenuItem>
		</Menu>
	);

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
			onClick={() => setMobileMoreAnchorEl(null)}
		>
			<MenuItem onClick={() => {history.push('/profile')}}>
				{!isLoading ? <Avatar src={user.avatar} className={classes.small}/> : <AccountCircle/>}
				<div className={classes.menuTag}>Profile</div>
			</MenuItem>
			<MenuItem onClick={() => {history.push('/messages')}}>
				<Badge color="secondary"><MailIcon /></Badge>
				<div className={classes.menuTag}>Messages</div>
			</MenuItem>
			<MenuItem onClick={() => {history.push('/notifications')}}>
				<Badge color="secondary"><NotificationsIcon /></Badge>
				<div className={classes.menuTag}>Notifications</div>
			</MenuItem>
			<MenuItem onClick={() => {history.push('/posts-statistics')}}>
				<Badge color="secondary"><DashboardIcon /></Badge>
				<div className={classes.menuTag}>Statistics</div>
			</MenuItem>
			<MenuItem
				onClick={() => {
					history.push('/login');
					localStorage.removeItem(LocalStorageKeys.TOKEN);
					dispatch(clearUserState());
				}}>
				<ExitToApp />
				<div className={classes.menuTag}>Log out</div>
			</MenuItem>
		</Menu>
	);

	return (
		<Grid item xl={12} className={classes.grow}>
			<AppBar position="static">
				<Toolbar>
					<MenuItem
						className={classes.title}
						onClick={() => {history.push('/')}}
					>
						{sm ? <div>SocialApp</div> : <Home/>}
					</MenuItem>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							type="text"
							placeholder="Search…"
							onChange={(event) => dispatch(setSearchString(event.target.value))}
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'search' }}
						/>
					</div>
					<div className={classes.grow} />
					<div className={classes.sectionDesktop}>
						<IconButton
							onClick={() => {history.push('./messages')}}
							color="inherit">
							<Badge color="secondary">
								<MailIcon />
							</Badge>
						</IconButton>
						<IconButton
							onClick={() => {history.push('./notifications')}}
							color="inherit">
							<Badge color="secondary">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						<IconButton
							onClick={() => {history.push('./posts-statistics')}}
							color="inherit">
							<DashboardIcon />
						</IconButton>
						<IconButton
							className={classes.userIconButton}
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							onClick={handleProfileMenuOpen}
							color="inherit"
						>
							<div className={classes.userName}>{user.firstName}</div>
							{!isLoading ? <Avatar src={user.avatar}/> : <AccountCircle/>}
						</IconButton>

					</div>
					<div className={classes.sectionMobile}>
						<IconButton
							aria-label="show more"
							aria-controls={mobileMenuId}
							aria-haspopup="true"
							onClick={handleMobileMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
			{renderMenu}
		</Grid>
	);
}

export default HeaderAppBar;
