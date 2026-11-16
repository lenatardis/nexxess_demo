// Page endpoints used by src/api/pagesApi.js.
import { http, HttpResponse } from 'msw';
import { feed } from '../data/feed';
import { pipelinesOf } from '../data/trusts';
import { API, paginate, withAuth } from './utils';

const FEED_PAGE_SIZE = 3;

const getFeed = http.get(
    `${API}/bitrix/feed/`,
    withAuth(({ request }) => {
        const page = new URL(request.url).searchParams.get('page');
        return HttpResponse.json(paginate(feed(), page, FEED_PAGE_SIZE));
    }),
);

// The page asks page_size=1: one trust per page, the pagination switches between the trusts.
const getTrustPipeline = http.get(
    `${API}/bitrix/trust_pipeline/`,
    withAuth(({ request, user }) => {
        const params = new URL(request.url).searchParams;
        return HttpResponse.json(paginate(pipelinesOf(user), params.get('page'), params.get('page_size')));
    }),
);

export const pagesHandlers = [getFeed, getTrustPipeline];
