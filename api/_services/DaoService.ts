import axios from 'axios';
import { Root, Path, SubPath } from '@/api/resources';
import { QueryProvider } from '~/types/QueryProvider.types';
import { APIResponse, APIResponseUserVotes } from '~/api/types';
import { logger } from '@/plugins/logger.client';
import { PublicKey } from '@solana/web3.js';
import { DaoUserVote, DaoVote } from '~~/types/Dao.types';

class DaoService {
    async getVotes(queryProvider?: QueryProvider): Promise<APIResponse<DaoVote[]>> {
        const res = await axios.get(`${Path.DAO}/${SubPath.DAO.VOTES}${queryProvider.decode()}`);
        return res.data;
    }

    async getVote(id: string | string[]): Promise<DaoVote> {
        const resp = await axios.get(`${Path.DAO}/${SubPath.DAO.VOTES}/${id}`);
        return new DaoVote(resp.data);
    }

    async getUserVotes(wallet: PublicKey): Promise<APIResponseUserVotes<DaoUserVote[]>> {
        if (!wallet) {
            throw new Error('not defined: wallet');
        }

        const res = await axios.get(`${Path.DAO}/${SubPath.DAO.ACCOUNT}/${wallet.toBase58()}/${SubPath.DAO.VOTES}`);
        return res.data;
    }

    async sendVote(wallet: PublicKey, voteId: string, optionId: string, transactionHash: string): Promise<void> {
        if (!wallet) {
            throw new Error('not defined: wallet');
        }
        await axios.post(`/${Path.DAO}/${SubPath.DAO.ACCOUNT}/${wallet.toBase58()}/${SubPath.DAO.VOTES}`, {
            transactionHash,
            voteId,
            optionId,
        });
    }
}

export default new DaoService();
