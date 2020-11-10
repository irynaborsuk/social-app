import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import BackgroundImage from '../images/IMG_0283.jpg';

export const useSharedStyles = makeStyles((theme: Theme) => createStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: '20px 0',
		width: '430px',
		boxSizing: 'border-box',
		background: 'linear-gradient(rgba(35,43,85,0.75), rgba(35,43,85,0.95))',
		backgroundSize: 'cover',
		margin: '100px auto auto auto',
		borderTop: 'solid 1px rgba(255,255,255,.5)',
		borderRadius: '5px',
		boxShadow: '0 2px 7px rgba(0,0,0,0.2)',
		overflow: 'hidden',
		transition: 'all .5s ease',
	},
	background: {
		width: '100%',
		height: '100%',
		background: `linear-gradient(rgba(246,247,249,0.8), rgba(246,247,249,0.8)), 
		url(${BackgroundImage}) no-repeat center center fixed`,
		backgroundSize: 'cover',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '0',
		padding: '0'
	},
	label: {
		display: 'flex',
		flexDirection: 'column',
		width: '350px',
		paddingLeft: '20px',
		textTransform: 'uppercase',
		fontSize: '13px',
		color: 'rgba(255,255,255,.7)',
	},
	textField: {
		width: '350px',
		height: '45px',
		paddingLeft: '15px',
		marginBottom: '20px',
		border: 'none',
		borderRadius: '14px',
		background: 'rgba(255,255,255,.2)'
	},
	button: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '350px',
		height: '35px',
		padding: '0 10px',
		color: '#cccc'
	},
}));
