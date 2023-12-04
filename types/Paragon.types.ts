import { HTO_TOKEN_DECIMAL } from '~/js/paragon/types';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export enum OperationState {
    PROCESSING = 1,
    ERROR,
    FINISHED,
}
export enum OperationType {
    BREEDING = 'Breeding',
    FUSION = 'Fusing',
    STAMPING = 'Stamping',
}

export class Breeding implements ITimeoutOperation, IOperation {
    creator: string;
    nftMint1: string;
    nftMint2: string;
    bornMint: string;
    depositAmount: number;
    enterTime: number;
    unlockTime: number;
    status: OperationState;
    type: OperationType;
    pda: PublicKey;

    constructor(data: any) {
        this.creator = data.creator;
        this.nftMint1 = data.nftMint1;
        this.nftMint2 = data.nftMint2;
        this.bornMint = data.bornMint;
        this.depositAmount = data.depositAmount;
        this.enterTime = Number(data.enterTime);
        this.unlockTime = Number(data.unlockTime);
        this.type = OperationType.BREEDING;
        this.pda = data.pda;

        if (data.status.toString() in OperationState) {
            this.status = OperationState[(data.status as number).toString()];
        }
    }

    get formattedDepositAmount() {
        return Number(this.depositAmount) / HTO_TOKEN_DECIMAL;
    }
}

export class Fusion implements ITimeoutOperation, IOperation {
    creator: string;
    nftMint: string;
    nftMint1: string;
    nftMint2: string;
    nftMint3: string;
    nftMint4: string;
    fusion: string;
    depositAmount: number;
    tier: anchor.BN;
    enterTime: number;
    unlockTime: number;
    status: OperationState;
    type: OperationType;
    pda: PublicKey;

    constructor(data: any) {
        this.creator = data.creator;
        this.nftMint = data.nftMint;
        this.nftMint1 = data.nftMint1;
        this.nftMint2 = data.nftMint2;
        this.nftMint3 = data.nftMint3;
        this.nftMint4 = data.nftMint4;
        this.fusion = data.fusion;
        this.depositAmount = data.depositAmount;
        this.tier = data.tier;
        this.enterTime = Number(data.enterTime);
        this.unlockTime = Number(data.unlockTime);
        this.type = OperationType.FUSION;
        this.pda = data.pda;

        if (data.status.toString() in OperationState) {
            this.status = OperationState[(data.status as number).toString()];
        }
    }

    get formattedDepositAmount() {
        return Number(this.depositAmount) / HTO_TOKEN_DECIMAL;
    }
}

export class Stamping implements IOperation {
    creator: string;
    paragon: string;
    avatar: string;
    depositAmount: number;
    verified: boolean;
    type: OperationType;
    enterTime: number;
    pda: PublicKey;

    constructor(data: any) {
        this.creator = data.creator;
        this.paragon = data.paragon;
        this.avatar = data.avatar;
        this.depositAmount = data.depositAmount;
        this.verified = Number(data.verified) === 1;
        this.type = OperationType.STAMPING;
        this.enterTime = data.enterTime;
        this.pda = data.pda;
    }

    get formattedDepositAmount() {
        return this.depositAmount / HTO_TOKEN_DECIMAL;
    }
}

export interface ITimeoutOperation {
    unlockTime: number;
}

export interface IOperation {
    readonly creator: string;
    readonly depositAmount: number;
    readonly type: OperationType;
    readonly formattedDepositAmount: number;
    readonly enterTime: number;
    readonly pda: PublicKey;
}

export type Operations = {
    fusion: Array<Fusion>;
    breeding: Array<Breeding>;
    stamping: Array<Stamping>;
};

export interface IStampable {
    cropParameters: (size: number) => {
        x: number;
        y: number;
        r: number;
    };
}
