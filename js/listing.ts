import { API } from '~/api';
import {
    AcknowledgeRequest,
    ActivityAction,
    ActivityRequestCancelListing,
    ActivityRequestList,
    ActivityRequestOffer,
    ActivityRequestSale,
    ActivityResponse,
} from '~/types/Activity.types';
import { useWallet } from 'solana-wallets-vue';
import { IListable, Listing } from '~/types/Listing.types';
import { Metaplex } from '~/js/metaplex';
import { logger } from '~/plugins/logger.client';
import { NotificationManager } from '~/types/NotificationManager.types';
import { NotificationTitles } from '~/types/Notification.data';
import { NotificationMessageWithItems } from '#components';
import { getTxSolscanUrl } from '~/js/url';
import { NotificationSerialTxItemFlow } from '#components';
import {
    AdditionalInfo,
    MessageParam,
    MessageParamType,
    NotificationStepsData,
    Variant,
} from '~/types/Notification.types';
import { reactive } from 'vue';
import { isUserRejectedTx } from '~/js/errors';
import { formatNumberToDecimal } from '~/js/formatting';

export const list = async (mint: string, name: string, price: number) => {
    logger.info('Listing new NFT', mint, price);

    const { publicKey } = useWallet();

    const ownerAddress = publicKey.value.toBase58();

    if (price <= 0) {
        throw new Error('incorrect: price');
    }

    if (!ownerAddress) {
        throw new Error('missing: ownerAddress');
    }

    const activity: ActivityRequestList = {
        price,
        ownerAddress,
        tokenAddress: mint,
        type: ActivityAction.LISTING,
    };

    const activityResponse: ActivityResponse = await API.ActivityService.newActivity(activity);

    logger.info('First api call successful', activityResponse);

    const notification = NotificationManager.getInstance().create({
        title: NotificationTitles.AH_LIST,
        variant: Variant.LOADING,
        message: {
            component: NotificationMessageWithItems,
            data: {
                items: [
                    {
                        entity: 'Price',
                        value: price,
                        type: MessageParamType.HTO,
                        renderFn: formatNumberToDecimal,
                    },
                    {
                        entity: 'Item',
                        value: name,
                    },
                ] as MessageParam[],
            },
        },
    });

    let txSig;

    try {
        txSig = await Metaplex.getInstance().auctionHouse.list(mint, price);

        notification.link = {
            name: 'View',
            href: getTxSolscanUrl(txSig),
        };
        notification.additionalInfo = AdditionalInfo.CONFIRMING;

        await Metaplex.getInstance().confirmTransaction(txSig);

        notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

        logger.info('Metaplex auctionHouse list call successful', txSig);
    } catch (e: any) {
        logger.info('Error when listing NFT', e);

        if (e.code === 4001) {
            try {
                await API.ActivityService.newAcknowledge(
                    activityResponse.id,
                    _createBlockchainFailedAck(
                        activityResponse.secret,
                        ActivityAction.LISTING,
                        'cancellation',
                        e.message,
                        txSig
                    )
                );
            } catch (e) {
                const attempts = 0;
                await apiRetryFailedCall(
                    attempts,
                    txSig,
                    activityResponse,
                    ActivityAction.LISTING,
                    'cancellation',
                    e.message
                );
            }
        } else {
            try {
                await API.ActivityService.newAcknowledge(
                    activityResponse.id,
                    _createBlockchainFailedAck(
                        activityResponse.secret,
                        ActivityAction.LISTING,
                        'failure',
                        e.message,
                        txSig
                    )
                );
            } catch (e) {
                const attempts = 0;
                await apiRetryFailedCall(
                    attempts,
                    txSig,
                    activityResponse,
                    ActivityAction.LISTING,
                    'failure',
                    e.message
                );
            }
        }

        notification.setError(e.code === 4001 ? 'User rejected the transaction' : 'Transaction confirmation failed');

        throw e;
    }

    if (!txSig) {
        notification.setError('Transaction confirmation failed');

        throw new Error('no txSig received');
    }

    try {
        await API.ActivityService.newAcknowledge(
            activityResponse.id,
            _createBlockchainSucceededAck(activityResponse.secret, txSig, ActivityAction.LISTING)
        );

        notification.setSuccess('Transaction successfully confirmed');
    } catch (e) {
        logger.info('Error when ack NFT', e);

        try {
            await API.ActivityService.newAcknowledge(
                activityResponse.id,
                _createBlockchainSucceededAck(activityResponse.secret, txSig, ActivityAction.LISTING)
            );
        } catch (e) {
            const attempts = 0;
            await apiRetryAckCall(attempts, txSig, activityResponse, ActivityAction.LISTING);
        }

        notification.setError('Transaction confirmation failed');

        throw e;
    }

    return {
        finish: () => {
            notification.setSuccess('Transaction successfully confirmed');
        },
    };
};

export const cancelListing = async (listing: Listing, name: string, nft: IListable) => {
    const activity: ActivityRequestCancelListing = {
        listingId: Number(listing.id),
        type: ActivityAction.LISTING_CANCELLATION,
    };

    const activityResponse: ActivityResponse = await API.ActivityService.newActivity(activity);
    let txSig;

    const notification = NotificationManager.getInstance().create({
        title: NotificationTitles.AH_CANCEL_LIST,
        variant: Variant.LOADING,
        message: {
            component: NotificationMessageWithItems,
            data: {
                items: [
                    {
                        entity: 'Item',
                        value: name,
                    },
                ] as MessageParam[],
            },
        },
    });

    try {
        txSig = await Metaplex.getInstance().auctionHouse.cancelListing(nft.mint, listing.price);

        notification.link = {
            name: 'View',
            href: getTxSolscanUrl(txSig),
        };

        notification.additionalInfo = AdditionalInfo.CONFIRMING;

        await Metaplex.getInstance().confirmTransaction(txSig);

        notification.additionalInfo = AdditionalInfo.FETCHING_DATA;

        logger.info('[AUCTION_HOUSE] Transaction confirmed', txSig);

        logger.info('Metaplex auctionHouse cancel listing call successful', txSig);
    } catch (e: any) {
        logger.info('Error when listing NFT', e);

        if (e.code === 4001) {
            try {
                await API.ActivityService.newAcknowledge(
                    activityResponse.id,
                    _createBlockchainFailedAck(
                        activityResponse.secret,
                        ActivityAction.LISTING_CANCELLATION,
                        'cancellation',
                        e.message,
                        txSig
                    )
                );
            } catch (e) {
                const attempts = 0;
                await apiRetryFailedCall(
                    attempts,
                    txSig,
                    activityResponse,
                    ActivityAction.LISTING_CANCELLATION,
                    'cancellation',
                    e.message
                );
            }
        } else {
            try {
                await API.ActivityService.newAcknowledge(
                    activityResponse.id,
                    _createBlockchainFailedAck(
                        activityResponse.secret,
                        ActivityAction.LISTING_CANCELLATION,
                        'failure',
                        e.message,
                        txSig
                    )
                );
            } catch (e) {
                const attempts = 0;
                await apiRetryFailedCall(
                    attempts,
                    txSig,
                    activityResponse,
                    ActivityAction.LISTING_CANCELLATION,
                    'failure',
                    e.message
                );
            }
        }

        notification.setError(e.code === 4001 ? 'User rejected the transaction' : 'Transaction confirmation failed');

        throw e;
    }

    if (!txSig) {
        notification.setError('Transaction confirmation failed');

        throw new Error('no txSig received');
    }

    try {
        await API.ActivityService.newAcknowledge(
            activityResponse.id,
            _createBlockchainSucceededAck(activityResponse.secret, txSig, ActivityAction.LISTING_CANCELLATION)
        );
    } catch (e) {
        logger.info('Error when ack NFT', e);

        try {
            await API.ActivityService.newAcknowledge(
                activityResponse.id,
                _createBlockchainSucceededAck(activityResponse.secret, txSig, ActivityAction.LISTING_CANCELLATION)
            );
        } catch (e) {
            const attempts = 0;
            await apiRetryAckCall(attempts, txSig, activityResponse, ActivityAction.LISTING_CANCELLATION);
        }

        notification.setError('Transaction confirmation failed');

        throw e;
    }

    return {
        finish: () => {
            notification.setSuccess('Transaction successfully confirmed');
        },
    };
};

export const buy = async (listing: Listing, nft: IListable) => {
    const { publicKey } = useWallet();

    const ownerAddress = publicKey.value.toBase58();

    if (!ownerAddress) {
        throw new Error('missing: ownerAddress');
    }

    const data = new NotificationStepsData(
        reactive([
            { name: `Bid (100%)`, processing: true, finished: false },
            { name: 'Match order', processing: false, finished: false },
        ])
    );

    const notification = NotificationManager.getInstance().create({
        title: NotificationTitles.AH_PURCHASE_CONFIRMATION,
        variant: Variant.LOADING,
        indefinite: true,
        additionalInfo: 'To complete the purchase, approve following transactions',
        transactionFlow: {
            component: NotificationSerialTxItemFlow,
            data,
        },
    });

    const activityOffer: ActivityRequestOffer = {
        buyerAddress: ownerAddress,
        listingId: Number(listing.id),
        type: ActivityAction.OFFER,
        offeredPrice: listing.price,
    };

    let activityOfferResponse;

    try {
        activityOfferResponse = await API.ActivityService.newActivity(activityOffer);
    } catch (e) {
        notification.setError('Transaction execution failed');
    }

    let txBidSig;

    try {
        txBidSig = await Metaplex.getInstance().auctionHouse.bid(nft.mint, listing.wallet.id, listing.price);

        data.setLink(txBidSig);

        await Metaplex.getInstance().confirmTransaction(txBidSig);

        data.nextStep();
    } catch (e: any) {
        logger.info('buy: Error when bidding NFT', e);

        if (isUserRejectedTx(e)) {
            try {
                await API.ActivityService.newAcknowledge(
                    activityOfferResponse.id,
                    _createBlockchainFailedAck(
                        activityOfferResponse.secret,
                        ActivityAction.OFFER,
                        'cancellation',
                        e.error?.message,
                        txBidSig
                    )
                );
            } catch (e) {
                const attempts = 0;
                await apiRetryFailedCall(
                    attempts,
                    txBidSig,
                    activityOfferResponse,
                    ActivityAction.OFFER,
                    'cancellation',
                    e.error?.message
                );
            }
        } else {
            try {
                await API.ActivityService.newAcknowledge(
                    activityOfferResponse.id,
                    _createBlockchainFailedAck(
                        activityOfferResponse.secret,
                        ActivityAction.OFFER,
                        'failure',
                        e.error?.message,
                        txBidSig
                    )
                );
            } catch (e) {
                const attempts = 0;
                await apiRetryFailedCall(
                    attempts,
                    txBidSig,
                    activityOfferResponse,
                    ActivityAction.OFFER,
                    'failure',
                    e.error?.message
                );
            }
        }

        notification.setError(isUserRejectedTx(e) ? 'User rejected the transaction' : 'Transaction execution failed');

        throw e;
    }

    try {
        await API.ActivityService.newAcknowledge(
            activityOfferResponse.id,
            _createBlockchainSucceededAck(activityOfferResponse.secret, txBidSig, ActivityAction.OFFER)
        );
    } catch (e) {
        logger.info('Error when ack NFT', e);

        try {
            await API.ActivityService.newAcknowledge(
                activityOfferResponse.id,
                _createBlockchainSucceededAck(activityOfferResponse.secret, txBidSig, ActivityAction.OFFER)
            );
        } catch (e) {
            const attempts = 0;
            await apiRetryAckCall(attempts, txBidSig, activityOfferResponse, ActivityAction.OFFER);
        }

        notification.setError('Transaction confirmation failed. Your tokens may be stored in your escrow');

        throw e;
    }

    const activitySale: ActivityRequestSale = {
        offerId: activityOfferResponse.id,
        type: ActivityAction.SALE,
    };

    let activitySaleResponse;
    let txEsSig;

    try {
        activitySaleResponse = await API.ActivityService.newActivity(activitySale);

        txEsSig = await Metaplex.getInstance().auctionHouse.executeSale(nft.mint, listing.wallet.id, listing.price);

        data.setLink(txEsSig);

        await Metaplex.getInstance().confirmTransaction(txEsSig);

        data.nextStep();

        await API.ActivityService.newAcknowledge(
            activitySaleResponse.id,
            _createBlockchainSucceededAck(activitySaleResponse.secret, txEsSig, ActivityAction.SALE)
        );
    } catch (e) {
        logger.info('buy: Error when executing sale NFT', e);

        if (isUserRejectedTx(e)) {
            try {
                await API.ActivityService.newAcknowledge(
                    activitySaleResponse.id,
                    _createBlockchainFailedAck(
                        activitySaleResponse.secret,
                        ActivityAction.SALE,
                        'cancellation',
                        e.error?.message,
                        txEsSig
                    )
                );
            } catch (e) {
                const attempts = 0;
                await apiRetryFailedCall(
                    attempts,
                    txEsSig,
                    activitySaleResponse,
                    ActivityAction.SALE,
                    'cancellation',
                    e.error?.message
                );
            }
        } else {
            try {
                await API.ActivityService.newAcknowledge(
                    activitySaleResponse.id,
                    _createBlockchainFailedAck(
                        activitySaleResponse.secret,
                        ActivityAction.SALE,
                        'failure',
                        e.error?.message,
                        txEsSig
                    )
                );
            } catch (e) {
                const attempts = 0;
                await apiRetryFailedCall(
                    attempts,
                    txEsSig,
                    activitySaleResponse,
                    ActivityAction.SALE,
                    'failure',
                    e.error?.message
                );
            }
        }

        notification.setError(
            isUserRejectedTx(e)
                ? 'User rejected the transaction'
                : 'Transaction execution failed. Your tokens may be stored in your escrow'
        );

        throw e;
    }

    return {
        finish: () => {
            notification.setSuccess('Transaction successfully confirmed', true);
        },
    };
};

const _createBlockchainSucceededAck = (
    secret: string,
    transactionId: string,
    action: ActivityAction
): AcknowledgeRequest => {
    return {
        secret,
        type: action,
        blockchainTransactionResult: {
            transactionId,
            status: 'success',
        },
    };
};

const _createBlockchainFailedAck = (
    secret: string,
    action: ActivityAction,
    status: 'failure' | 'cancellation',
    message: string,
    txSig?: string
): AcknowledgeRequest => {
    return {
        secret,
        type: action,
        blockchainTransactionResult: {
            status,
            message,
            transactionId: txSig,
        },
    };
};

const apiRetryAckCall = async (
    attempts: number,
    txSig: string,
    activityResponse: ActivityResponse,
    action: ActivityAction
) => {
    let interval;
    attempts++;

    if (attempts >= 3) {
        throw new Error('api contacting failed');
    }

    try {
        interval = setInterval(async () => {
            await API.ActivityService.newAcknowledge(
                activityResponse.id,
                _createBlockchainSucceededAck(activityResponse.secret, txSig, action)
            );

            clearInterval(interval);
        }, 5000);
    } catch (e) {
        await apiRetryAckCall(attempts, txSig, activityResponse, action);
    }
};

const apiRetryFailedCall = async (
    attempts: number,
    txSig: string,
    activityResponse: ActivityResponse,
    action: ActivityAction,
    status: 'failure' | 'cancellation',
    message: string
) => {
    let interval;
    attempts++;

    if (attempts >= 3) {
        throw new Error('api contacting failed');
    }

    try {
        interval = setInterval(async () => {
            await API.ActivityService.newAcknowledge(
                activityResponse.id,
                _createBlockchainFailedAck(activityResponse.secret, action, status, message, txSig)
            );

            clearInterval(interval);
        }, 5000);
    } catch (e) {
        await apiRetryFailedCall(attempts, txSig, activityResponse, action, status, message);
    }
};
