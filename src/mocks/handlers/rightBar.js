// Endpoints used by src/api/rightBarApi.js: consultant cards and counters of the right box,
// trust progress bars of the left box.
import { http, HttpResponse } from 'msw';
import { avatarFor } from '../data/avatars';
import { consultants, DEFAULT_CONSULTANT_ID } from '../data/consultants';
import { statisticsOf } from '../data/statistics';
import { trustsOf } from '../data/trusts';
import { API, withAuth } from './utils';

// How many cards the right box shows: the customer's own consultant first, then the default ones.
const CARDS = 3;

const getDefaultConsultants = http.get(
    `${API}/bitrix/consultants/default/`,
    withAuth(({ user }) => {
        const own = consultants.find((item) => item.id === user.consultant_id);
        const defaults = consultants.filter((item) => item.id !== own?.id && item.id < DEFAULT_CONSULTANT_ID + CARDS);
        const results = [own, ...defaults]
            .filter(Boolean)
            .slice(0, CARDS)
            .map(({ id, first_name, last_name, work_position }) => ({
                consultant_id: id,
                consultant_info: { avatar: avatarFor(first_name, last_name), first_name, last_name, work_position },
            }));
        return HttpResponse.json({ count: results.length, total_pages: 1, results });
    }),
);

const getStatistics = http.get(
    `${API}/users/user/statistics/`,
    withAuth(({ user }) => HttpResponse.json(statisticsOf(user))),
);

const getDiagrams = http.get(
    `${API}/bitrix/trust_pipeline/diagrams/`,
    withAuth(({ user }) => {
        const results = trustsOf(user).map(({ deal_id, deal_name, complete }) => ({
            deal_id,
            deal_name,
            complete,
            not_completed: 100 - complete,
        }));
        return HttpResponse.json({ count: results.length, total_pages: 1, results });
    }),
);

export const rightBarHandlers = [getDefaultConsultants, getStatistics, getDiagrams];
