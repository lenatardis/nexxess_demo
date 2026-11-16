// Profile endpoints used by src/api/profileApi.js.
import { http, HttpResponse } from 'msw';
import { findUserByEmail, saveUsers, toProfile } from '../data/users';
import { API, errorResponse, withAuth } from './utils';

const getProfile = http.get(
    `${API}/users/user/profile/`,
    withAuth(({ user }) => HttpResponse.json(toProfile(user))),
);

// The form sends only changed fields; the two names come in camelCase.
const FIELDS = {
    firstName: 'first_name',
    lastName: 'last_name',
    email: 'email',
    email_two: 'email_two',
    email_three: 'email_three',
    phone: 'phone',
    phone_two: 'phone_two',
    phone_three: 'phone_three',
    country: 'country',
    city: 'city',
    street: 'street',
};

const PHOTO_SIZE = 240;

// The photo is kept in localStorage with the user, so it is cut to a small square JPEG first.
const toStoredPhoto = async (file) => {
    const bitmap = await createImageBitmap(file);
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = PHOTO_SIZE;
    canvas.height = PHOTO_SIZE;
    canvas
        .getContext('2d')
        .drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
    return canvas.toDataURL('image/jpeg', 0.85);
};

const updateProfile = http.patch(
    `${API}/users/user/update/`,
    withAuth(async ({ request, user }) => {
        let form;
        try {
            form = await request.formData();
        } catch {
            return errorResponse(400, 'parse_error', 'Malformed request.');
        }

        const changes = {};
        Object.entries(FIELDS).forEach(([formName, field]) => {
            const value = form.get(formName);
            if (typeof value === 'string' && value.trim()) changes[field] = value.trim();
        });

        if (changes.email) {
            const owner = findUserByEmail(changes.email);
            if (owner && owner.id !== user.id) {
                return errorResponse(400, 'unique', 'user with this email already exists.', 'email');
            }
        }

        const currentPassword = form.get('current_password');
        const newPassword = form.get('password');
        if (currentPassword || newPassword) {
            if (currentPassword !== user.password) {
                return errorResponse(400, 'invalid', 'The current password is incorrect', 'current_password');
            }
            if (newPassword) changes.password = newPassword;
        }

        const photo = form.get('photo');
        if (photo && typeof photo !== 'string') {
            try {
                changes.photo = await toStoredPhoto(photo);
            } catch {
                return errorResponse(400, 'invalid_image', 'Upload a valid image.', 'photo');
            }
        }

        Object.assign(user, changes);
        saveUsers();
        return HttpResponse.json(toProfile(user));
    }),
);

export const profileHandlers = [getProfile, updateProfile];
