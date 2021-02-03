import React, { useState } from 'react';
import {useSharedStyles} from '../../shared/SharedSignUpStyle';
import { useHistory } from 'react-router';
import { LocalStorageKeys, LoginFormValues, TokenResponse } from '../../types';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import axios from '../../hooks/axios';
import {
	CircularProgress,
	createStyles,
	IconButton,
	Input,
	InputAdornment,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { AxiosResponse } from 'axios';
import { setToken } from '../../store/user/actions';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => createStyles({
	textField: {
		borderRadius: '4px',
	},
	createAccount: {
	display: 'flex',
	flexDirection: 'column',
	color: '#cccc',
	width: '350px',
	height: '90px',
	justifyContent: 'space-between',
	marginTop: '50px',
	}
}));

const Login = () => {
	const dispatch = useDispatch();
	const sharedClasses = useSharedStyles();
	const classes = useStyles();
	let history = useHistory();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const initialValues: LoginFormValues = {
		email: '',
		password: ''
	};

	const validationSchema = Yup.object({
		email: Yup.string().email('Invalid email address').required('Required'),
		password: Yup.string()
			.min(8, 'Password is too short - should be 8 chars minimum.')
			.required('No password provided.')
			.matches(/[a-zA-Z]/, 'Password must contain at least one Latin letters.')
			.matches(/[0-9]/, 'Password must contain at least one numbers.')
	});

	const { handleSubmit, handleChange, handleBlur, values, errors, touched, isValid, isSubmitting } = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (ev) => loginRequest(ev),
	});

	const loginRequest = async (value: LoginFormValues) => {
		setIsLoading(true);
		try {
			const { data }: AxiosResponse<TokenResponse> = await axios.post('/login', {
				email: value.email,
				password: value.password
			});
			const token: string = data.token;
			localStorage.setItem(LocalStorageKeys.TOKEN, token);
			dispatch(setToken(token));
			setIsLoading(false);
			history.push('/');
		} catch (error) {
			enqueueSnackbar(error?.response?.data?.message || 'Something went wrong');
			setIsLoading(false);
		}
	}

	return (
		<div className={sharedClasses.background}>
			<form className={sharedClasses.root} onSubmit={handleSubmit}>
				<label className={sharedClasses.label} htmlFor="email">Email Address</label>
				<Input
					disableUnderline
					className={[sharedClasses.textField, classes.textField].join(' ')}
					name="email"
					onBlur={handleBlur}
					value={values.email}
					onChange={handleChange}
				/>
				<span>{errors.email && touched.email && errors.email}</span>
				<label className={sharedClasses.label} htmlFor="password">Password</label>
				<Input
					disableUnderline
					className={[sharedClasses.textField, classes.textField].join(' ')}
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

				{!isLoading ?
					<Button
						className={sharedClasses.button}
						variant="contained"
						color="primary"
						type="submit"
						disabled={ !isValid || isSubmitting}
					>Sign-up</Button>
					: <CircularProgress/>
				}

				<div className={classes.createAccount}>
					<label> You do not have an account? </label>

					<Button
						className={sharedClasses.button}
						variant='outlined'
						color="inherit"
						type="button"
						onClick={() => {
							history.push('/registration')
						}}
					>Registration
					</Button>
				</div>
			</form>
		</div>
	);
};

export default Login;