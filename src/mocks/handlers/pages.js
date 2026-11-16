// Page endpoints used by src/api/pagesApi.js.
import { http, HttpResponse } from 'msw';
import { feed } from '../data/feed';
import { API, paginate, withAuth } from './utils';

const FEED_PAGE_SIZE = 3;

const getFeed = http.get(
    `${API}/bitrix/feed/`,
    withAuth(({ request }) => {
        const page = new URL(request.url).searchParams.get('page');
        return HttpResponse.json(paginate(feed(), page, FEED_PAGE_SIZE));
    }),
);

export const pagesHandlers = [getFeed];
