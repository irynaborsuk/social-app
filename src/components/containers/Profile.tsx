import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { DeleteUserRequest, LocalStorageKeys, TokenResponse, UpdateUserForm, User } from '../../types';
import axios from '../../hooks/axios';
import { setToken, setUser } from '../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectUser } from '../../store/user/reducers';
import Avatar from '@material-ui/core/Avatar';
import { Button, CircularProgress, Input } from '@material-ui/core';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AxiosResponse } from 'axios';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
			display: 'flex',
			justifyContent: 'center'
		},
		large: {
			width: theme.spacing(13),
			height: theme.spacing(13),
			margin: '20px',
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(20),
				height: theme.spacing(20)
			}
		},
		userData: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			background: 'linear-gradient(5deg, black, transparent)',
			color: 'white',
			[theme.breakpoints.up('sm')]: {
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'baseline'
			}
		},
		userName: {
			fontSize: '20px',
			[theme.breakpoints.up('sm')]: {
				fontSize: '26px'
			}
		},
		updateForm: {
			padding: '10px'
		},
		updateFormData: {
			display: 'flex',
			flexDirection: 'column'
		},
		dataLabel: {
			textTransform: 'uppercase',
			fontSize: '15px',
			fontWeight: 'bold',
			margin: '10px 0'
		},
		dataInput: {
			background: 'lightgray',
			borderRadius: '5px',
			padding: '0 10px'
		},
		buttons: {
			display: 'flex',
			justifyContent: 'space-around',
			marginTop: '10px'
		},
		button: {
			width: '45%'
		},
		deleteButton: {
			display: 'flex',
			justifyContent: 'flex-end'
		},
		margin: {
			marginTop: '10px'
		},
		profileMenuButton: {
			display: 'flex',
			justifyContent: 'space-between'
		}
	})
);

export default function Profile() {
	const classes = useStyles();
	let history = useHistory();
	const token: string = useSelector(selectToken);
	const user: User = useSelector(selectUser);
	const dispatch = useDispatch();
	const [isClicked, setIsClicked] = useState<boolean>(false);
	const [isClickedDel, setIsClickedDel] = useState<boolean>(false);
	const [updateAvatar, setUpdateAvatar] = useState<any | null>('');
	let updateInputRef: HTMLInputElement | null;
	const { enqueueSnackbar } = useSnackbar();

	const initialValues: UpdateUserForm = {
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		password: '',
		currentPassword: '',
		avatar: ''
	};

	const validationSchema = Yup.object({
		email: Yup.string().email('Invalid email address').required('Required'),
		firstName: Yup.string()
			.max(15, 'Must be 15 characters or less')
			.required('Required')
			.matches(/[a-zA-Z]/, 'First Name must contain Latin letters.'),
		lastName: Yup.string()
			.max(20, 'Must be 20 characters or less')
			.required('Required')
			.matches(/[a-zA-Z]/, 'Last Name must contain Latin letters.'),
		password: Yup.string()
			.min(8, 'Password is too short - should be 8 chars minimum.')
			.required('No password provided.')
			.matches(/[a-zA-Z]/, 'Password must contain at least one Latin letters.')
			.matches(/[0-9]/, 'Password must contain at least one numbers.'),
		currentPassword: Yup.string()
			.required('No password provided.'),
		avatar: Yup.string().notRequired()
	});

	const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting } = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: (ev) => updateProfileRequest(ev)
	});

	const updateProfileRequest = async (v: UpdateUserForm) => {
		try {
			const { data }: AxiosResponse<TokenResponse> = await axios.patch('./profile/update', {
				email: v.email,
				firstName: v.firstName,
				lastName: v.lastName,
				password: v.password,
				currentPassword: v.currentPassword,
				avatar: updateAvatar
			})
			getRequest();
			setIsClicked(false);
			console.log(data);
			dispatch(setToken(token));
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	const deleteProfileRequest = async () => {
		try {
			const deleteUserBody: DeleteUserRequest = {
				currentPassword: values.currentPassword
			}
			const response = await axios.post('/profile/', deleteUserBody)
			console.log(response);
			localStorage.removeItem(LocalStorageKeys.TOKEN);
			history.push('./registration');
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	const getRequest = async () => {
		try {
			const { data }: { data: User } = await axios.get('./profile')
			dispatch(setUser(data));
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
		}
	}

	useEffect(() => {
		getRequest().then(r => console.log(r));
	}, []);

	return (
		<Grid spacing={3} className={classes.root}>
			<Grid item xs={12} md={9}>
				<Card className={classes.root}>
					<CardActionArea>
						<CardContent className={classes.userData}>
							<Avatar
								className={classes.large}
								src={user.avatar}
								srcSet={updateAvatar}
								onClick={() => updateInputRef!.click()}
							/>
							<div className={classes.userName}>
								{[user.firstName, user.lastName].join(' ')}
							</div>
						</CardContent>
					</CardActionArea>
				</Card>


				<form className={classes.updateForm} onSubmit={handleSubmit}>
					{isClicked ?
						<div>
							<div className={classes.updateFormData}>
								<label className={classes.dataLabel}
								>Email</label>
								<Input
									name="email"
									className={classes.dataInput}
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
									fullWidth={true}
									disableUnderline={true}
								/>
								<span>{errors.email && touched.email && errors.email}</span>

								<label className={classes.dataLabel}>First Name</label>
								<Input
									name="firstName"
									value={values.firstName}
									onChange={handleChange}
									onBlur={handleBlur}
									className={classes.dataInput}
									fullWidth={true}
									disableUnderline={true}
								/>
								<span>{errors.firstName && touched.firstName && errors.firstName}</span>

								<label className={classes.dataLabel}>Last Name</label>
								<Input
									name="lastName"
									value={values.lastName}
									onChange={handleChange}
									onBlur={handleBlur}
									className={classes.dataInput}
									fullWidth={true}
									disableUnderline={true}
								/>
								<span>{errors.lastName && touched.lastName && errors.lastName}</span>

								<label className={classes.dataLabel}>New password</label>
								<Input
									name="password"
									type="password"
									onChange={handleChange}
									onBlur={handleBlur}
									className={classes.dataInput}
									fullWidth={true}
									disableUnderline={true}
								/>
								<span>{errors.password && touched.password && errors.password}</span>

								<label className={classes.dataLabel}>Current Password</label>
								<Input
									name="currentPassword"
									type="password"
									onChange={handleChange}
									onBlur={handleBlur}
									className={classes.dataInput}
									fullWidth={true}
									disableUnderline={true}
								/>
								<span>{errors.currentPassword && touched.currentPassword && errors.currentPassword}</span>

								<label className={classes.dataLabel}>Avatar</label>
								<input
									type="file"
									hidden
									name="updatedAvatar"
									src={user.avatar}
									ref={(ref) => {
										updateInputRef = ref;
									}}
									onChange={(event) => {
										const updatedAvatar = updateInputRef!.files![0];
										let reader = new FileReader();
										reader.onloadend = function (e) {
											const imgBase64 = e.target!.result;
											setUpdateAvatar(imgBase64);
										}
										reader.readAsDataURL(updatedAvatar);
										setUpdateAvatar(event.target.value);
									}}
								/>
								<Avatar
									src={user.avatar}
									srcSet={updateAvatar}
									onClick={() => updateInputRef!.click()}
								/>
							</div>

							{!isSubmitting ?
								<div className={classes.buttons}>
									<Button
										type="submit"
										className={classes.button}
										variant={'contained'}
										color={'primary'}
										disabled={!isValid || isSubmitting}
									>update</Button>
									<Button
										className={classes.button}
										variant={'outlined'}
										color={'secondary'}
										onClick={() => setIsClicked(false)}
									>cancel</Button>
								</div>
								:
								<div className={classes.buttons}>
									<CircularProgress color="primary"/>
								</div>
							}

						</div>
						:
						<div>
							{isClickedDel ?
								<div className={classes.updateFormData}>
									<label className={classes.dataLabel}>Enter your current Password</label>
									<Input
										name="currentPassword"
										type="password"
										onChange={handleChange}
										onBlur={handleBlur}
										className={classes.dataInput}
										fullWidth={true}
										disableUnderline={true}
									/>
									<span>{errors.currentPassword && touched.currentPassword && errors.currentPassword}</span>
									<Button
										className={classes.margin}
										type={'submit'}
										variant={'contained'}
										color={'primary'}
										onClick={deleteProfileRequest}
									>Confirm delete profile</Button>
									<Button
										className={classes.margin}
										variant={'outlined'}
										color={'secondary'}
										onClick={() => setIsClickedDel(false)}
									>Cancel</Button>
								</div>
								:
								<div className={classes.profileMenuButton}>
									<Button
										variant={'outlined'}
										onClick={() => setIsClicked(true)}
									>Update Profile</Button>

									<Button
										variant={'outlined'}
										onClick={() => {
											setIsClickedDel(true);
										}}
									>Delete profile
									</Button>
								</div>
							}
						</div>
					}
				</form>
			</Grid>
		</Grid>
	);
}