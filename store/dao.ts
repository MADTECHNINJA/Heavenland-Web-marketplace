import { defineStore } from 'pinia';
import { logger } from '@/plugins/logger.client';
import { API } from '@/api';
import { DataWrapper } from '@/types/DataWrapper.types';
import { PublicKey } from '@solana/web3.js';
import { APIResponse, APIResponseUserVotes } from '~/api/types';

import { DaoUserVote, DaoVote } from '~~/types/Dao.types';

export const useDaoStore = defineStore({
    id: 'dao',
    state: () => ({
        activeVotes: new DataWrapper<APIResponse<DaoVote[]>>(),
        finishedVotes: new DataWrapper<APIResponse<DaoVote[]>>(),
        userVotes: new DataWrapper<APIResponseUserVotes<DaoUserVote[]>>(),
        userVotesFetched: false,
    }),
    actions: {
        async fetchVotes(provider, finished = false) {
            if (finished) {
                try {
                    const finishedVotesResponse = await API.DaoService.getVotes(provider);
                    finishedVotesResponse.items = finishedVotesResponse.items.sort((a, b) =>
                        a.startsAt > b.startsAt ? -1 : 1
                    );
                    this.finishedVotes.setData(finishedVotesResponse);
                } catch (e: any) {
                    this.finishedVotes.setError();
                    throw e;
                }
            } else {
                try {
                    const activeVotesResponse = await API.DaoService.getVotes(provider);
                    activeVotesResponse.items = activeVotesResponse.items.sort((a, b) =>
                        a.startsAt > b.startsAt ? -1 : 1
                    );
                    this.activeVotes.setData(activeVotesResponse);
                } catch (e: any) {
                    this.activeVotes.setError();
                    throw e;
                }
            }
        },

        async fetchUserVotes(wallet: PublicKey) {
            if (!this.userVotesFetched) {
                this.userVotesFetched = true;
                try {
                    const userVotes = await API.DaoService.getUserVotes(wallet);
                    this.userVotes.setData(userVotes);
                } catch (e: any) {
                    this.userVotes.setError(e);
                    logger.error(e);
                    throw e;
                } finally {
                    this.userVotesFetched = false;
                }
            }
        },
    },
});
