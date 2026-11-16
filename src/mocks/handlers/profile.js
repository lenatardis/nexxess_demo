// Profile endpoints used by src/api/profileApi.js.
import { http, HttpResponse } from 'msw';
import { toProfile } from '../data/users';
import { API, withAuth } from './utils';

const getProfile = http.get(
    `${API}/users/user/profile/`,
    withAuth(({ user }) => HttpResponse.json(toProfile(user))),
);

export const profileHandlers = [getProfile];
