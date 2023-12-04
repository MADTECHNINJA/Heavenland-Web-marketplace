import axios from 'axios';

import { logger } from '@/plugins/logger.client';

import { Root, Path, SubPath } from '@/api/resources';
import {
    ActivityResponse,
    ActivityRequestCancelListing,
    ActivityRequestList,
    ActivityRequestOffer,
    AcknowledgeRequest,
    ActivityRequestSale,
} from '~/types/Activity.types';
import { QueryProvider } from '~/types/QueryProvider.types';
import { APIResponse } from '~/api/types';

class ActivityService {
    async newActivity(
        request: ActivityRequestList | ActivityRequestOffer | ActivityRequestCancelListing | ActivityRequestSale
    ): Promise<ActivityResponse> {
        await logger.info('[API]', 'ActivityService', 'newListing', request);

        const res = await axios.post(`${Root.MARKETPLACE}/${Path.ACTIVITIES}`, request);

        return res.data;
    }

    async newAcknowledge(activityId: number, request: AcknowledgeRequest): Promise<void> {
        await logger.info('[API]', 'ActivityService', 'newAcknowledge', activityId, request);

        const res = await axios.post(
            `${Root.MARKETPLACE}/${Path.ACTIVITIES}/${activityId}/${SubPath.ACTIVITIES.ACK}`,
            request
        );

        return res.data;
    }

    async getActivities(queryProvider: QueryProvider): Promise<APIResponse<ActivityResponse[]>> {
        await logger.info('[API]', 'ActivityService', 'getActivities');

        const res = await axios.get(`${Root.MARKETPLACE}/${Path.ACTIVITIES}${queryProvider.decode()}`);

        return res.data;
    }

    async getActivity(activityId: number): Promise<ActivityResponse> {
        await logger.info('[API]', 'ActivityService', 'getActivity', activityId);

        const res = await axios.get(`${Root.MARKETPLACE}/${Path.ACTIVITIES}/${activityId}`);

        return res.data;
    }
}

export default new ActivityService();
