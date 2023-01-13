import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from '../../contexts/CurrentUserContext';
import NavBar from '../NavBar';

test('renders NavBar', () => {
	render(
		<Router>
			<NavBar />
		</Router>
	);

	// screen.debug();
	const signInLink = screen.getByRole('link', { name: 'Sign In' });
	expect(signInLink).toBeInTheDocument();
});

test('renders link to the user profile for the logged in user', async () => {
	render(
		<Router>
			<CurrentUserProvider>
				<NavBar />
			</CurrentUserProvider>
		</Router>
	);

	const profileAvatar = await screen.findByText('Profile');
	expect(profileAvatar).toBeInTheDocument();
});

test('render sign in and sign up buttons again on logout', async () => {
	render(
		<Router>
			<CurrentUserProvider>
				<NavBar />
			</CurrentUserProvider>
		</Router>
	);

	let signOutLink = await screen.findByRole('link', { name: 'Sign Out' });
	fireEvent.click(signOutLink);

	const signInLink = screen.getByRole('link', { name: 'Sign In' });
	const signUpLink = screen.getByRole('link', { name: 'Sign Up' });

	expect(signInLink).toBeInTheDocument();
	expect(signUpLink).toBeInTheDocument();
});
