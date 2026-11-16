// The customer's trusts (Bitrix24 deals in the original). For now only what the progress bars of
// the left box need; the stages, checklists and comments of the Trust Process page come later and
// will be the source of the percents.
const seedByStage = {
    new: [{ deal_id: 2291, deal_name: 'Family Trust', complete: 12 }],
    progress: [
        { deal_id: 2187, deal_name: 'Family Trust', complete: 62 },
        { deal_id: 2254, deal_name: 'Business Trust', complete: 25 },
    ],
    finished: [{ deal_id: 1964, deal_name: 'Family Trust', complete: 100 }],
};

export const trustsOf = (user) => seedByStage[user.stage] || [];
