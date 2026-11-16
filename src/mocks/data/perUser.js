// Per-customer collections. The sample data is written once per stage ('new', 'progress',
// 'finished' – see users.js); every customer works on an own copy of the data of their stage, made
// on first access, so a customer registered in the demo starts with the mid-process sample data.
import { getCollection, saveCollection } from '../db';

/**
 * @param {string} name collection name in the demo db; stored as {[userId]: records}
 * @param {Object<string, Array>} seedByStage sample records per stage
 * @returns {{of: (user) => Array, save: () => void}}
 */
export const perUser = (name, seedByStage) => {
    const all = () => getCollection(name, {});
    return {
        of(user) {
            const store = all();
            if (!store[user.id]) {
                store[user.id] = structuredClone(seedByStage[user.stage] || []);
            }
            return store[user.id];
        },
        save: () => saveCollection(name),
    };
};
