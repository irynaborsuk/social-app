import React, { useState } from 'react';
import { useSharedStyles } from '../../shared/SharedSignUpStyle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LocalStorageKeys, RegistrationFormValues, TokenResponse } from '../../types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import axios from '../../hooks/axios';
import { CircularProgress, IconButton, Input, InputAdornment } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/user/actions';
import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => createStyles({
	buttonWidth: {
		width: '160px'
	}
}));

const Registration = () => {
	const dispatch = useDispatch();
	const sharedClasses = useSharedStyles();
	const classes = useStyles();
	let history = useHistory();
	let inputRef: HTMLInputElement | null;
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();

	const initialValues: RegistrationFormValues = {
		email: '',
		firstName: '',
		lastName: '',
		password: '',
		confirmPassword: '',
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
		confirmPassword: Yup.string()
			.required('No password provided.')
			.oneOf([Yup.ref('password')], 'Passwords must match'),
		avatar: Yup.string().required('Download your avatar'),
	});

	const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting, setFieldValue } = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (ev) => registrationRequest(ev),
	});

	const registrationRequest = async (value: RegistrationFormValues) => {
		setIsLoading(true);
		try {
			const { data }: AxiosResponse<TokenResponse> = await axios.put('/register', {
				email: value.email,
				firstName: value.firstName,
				lastName: value.lastName,
				password: value.password,
				avatar: value.avatar
			});
			const token: string = data.token;
			localStorage.setItem(LocalStorageKeys.TOKEN, token);
			dispatch(setToken(token));
			history.push('/');
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
			setIsLoading(false);
		}
	};

	return (
		<div className={sharedClasses.background}>
			<form className={sharedClasses.root} onSubmit={handleSubmit}>
				<input
					type="file"
					hidden
					ref={(ref) => {
						inputRef = ref;
					}}
					onChange={(e) => {
						const avatarFile = inputRef!.files![0];
						let reader = new FileReader();
						reader.onloadend = function (e) {
							const imgBase64: string = e.target!.result as string;
							setFieldValue('avatar', imgBase64, true);
						}
						reader.readAsDataURL(avatarFile);
					}}
				/>
				<Avatar
					src={values.avatar}
					onClick={() => inputRef!.click()}
				/>

				<label className={sharedClasses.label} htmlFor="email">Email Address</label>
				<Input
					disableUnderline
					className={sharedClasses.textField}
					name="email"
					onBlur={handleBlur}
					value={values.email}
					onChange={handleChange}
				/>
				<span>{errors.email && touched.email && errors.email}</span>

				<label className={sharedClasses.label} htmlFor="firstName">First Name</label>
				<Input
					disableUnderline
					className={sharedClasses.textField}
					name="firstName"
					onBlur={handleBlur}
					value={values.firstName}
					onChange={handleChange}
				/>
				<span>{errors.firstName && touched.firstName && errors.firstName}</span>

				<label className={sharedClasses.label} htmlFor="lastName">Last Name</label>
				<Input
					disableUnderline
					className={sharedClasses.textField}
					name="lastName"
					onBlur={handleBlur}
					value={values.lastName}
					onChange={handleChange}
				/>
				<span>{errors.lastName && touched.lastName && errors.lastName}</span>

				<label className={sharedClasses.label} htmlFor="password">Password</label>
				<Input
					disableUnderline
					className={sharedClasses.textField}
					name="password"
					onBlur={handleBlur}
					type={showPassword ? 'text' : 'password'}
					value={values.password}
					onChange={handleChange}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => {
									setShowPassword(!showPassword);
								}}>
								{showPassword ? <Visibility/> : <VisibilityOff/>}
							</IconButton>
						</InputAdornment>
					}
				/>
				<span>{errors.password && touched.password && errors.password}</span>

				<label className={sharedClasses.label} htmlFor="confirmPassword">Confirm Password</label>
				<Input
					disableUnderline
					className={sharedClasses.textField}
					name="confirmPassword"
					onBlur={handleBlur}
					type={showConfirmPassword ? 'text' : 'password'}
					value={values.confirmPassword}
					onChange={handleChange}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => {
									setShowConfirmPassword(!showConfirmPassword);
								}}>
								{showConfirmPassword ? <Visibility/> : <VisibilityOff/>}
							</IconButton>
						</InputAdornment>
					}
				/>
				<span>{errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}</span>

				{!isLoading ?
					<div className={sharedClasses.button}>
						<Button
							className={classes.buttonWidth}
							variant="contained"
							color="primary"
							type="submit"
							disabled={ !isValid || isSubmitting}
						>Sign-up</Button>

						<Button
							className={classes.buttonWidth}
							variant='outlined'
							color="inherit"
							type="button"
							onClick={() => {
								history.push('/login')
							}}
						>Login</Button>
					</div>
					:
					<CircularProgress color="primary"/>
				}
			</form>
		</div>
	);
};

export default Registration;