import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useHistory } from 'react-router-dom';
import { removeTokenTimeStamp, shouldRefreshToken } from '../utils/utils';

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
	const history = useHistory();
	const [currentUser, setCurrentUser] = useState(null);

	const handleMount = async () => {
		try {
			const { data } = await axiosRes.get('dj-rest-auth/user/');
			setCurrentUser(data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		handleMount();
	}, []);

	useMemo(() => {
		axiosReq.interceptors.request.use(
			async config => {
				if (shouldRefreshToken()) {
					try {
						await axios.post('dj-rest-auth/token/refresh/');
					} catch (error) {
						setCurrentUser(prevCurrentUser => {
							if (prevCurrentUser) {
								history.push('/signin');
							}
							return null;
						});
						removeTokenTimeStamp();
						return config;
					}
				}
				return config;
			},
			error => {
				return Promise.reject(error);
			}
		);

		axiosRes.interceptors.response.use(
			response => response,
			async error => {
				if (error.response?.status === 401) {
					try {
						await axios.post('/dj-rest-auth/token/refresh/');
					} catch (error) {
						setCurrentUser(prevCurrentUser => {
							if (prevCurrentUser) {
								history.push('/signin');
							}
							return null;
						});
						removeTokenTimeStamp();
					}
					return axios(error.config);
				}
				return Promise.reject(error);
			}
		);
	}, [history]);

	return (
		<CurrentUserContext.Provider value={currentUser}>
			<SetCurrentUserContext.Provider value={setCurrentUser}>
				{children}
			</SetCurrentUserContext.Provider>
		</CurrentUserContext.Provider>
	);
};
