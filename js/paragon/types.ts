import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const GLOBAL_AUTHORITY_SEED = 'global-authority';
export const ROLE_INFO_SEED = 'user-role';

export const PARAGON_PROGRAM_ID = new PublicKey(import.meta.env.VITE_HL_PARAGON_PROGRAM_ADDRESS);

export const HTO_TOKEN_MINT = new PublicKey('htoHLBJV1err8xP5oxyQdV2PLQhtVjxLXpKB7FsgJQD');
export const HTO_TOKEN_DECIMAL = 1_000_000_000;

export const ROLE_SIZE = 48;
export const PERSONAL_POOL_SIZE = 168;
export const FUSION_POOL_SIZE = 264;
export const AVATAR_POOL_SIZE = 128;

export interface GlobalPool {
    // 8 + 96
    admin: PublicKey; // 32
    vault: PublicKey; // 32
    updater: PublicKey; // 32
}

export interface PersonalPool {
    // 8 + 160
    creator: PublicKey; // 32
    nftMint1: PublicKey; // 32
    nftMint2: PublicKey; // 32
    bornMint: PublicKey; // 32
    depositAmount: anchor.BN; // 8
    enterTime: anchor.BN; // 8
    unlockTime: anchor.BN; // 8
    status: anchor.BN; // 8
}

export interface FusionPool {
    // 8 + 256
    creator: PublicKey; // 32
    nftMints: PublicKey[]; // 160
    fusion: PublicKey; // 32
    depositAmount: anchor.BN; // 8
    tier: anchor.BN; // 8
    enterTime: anchor.BN; // 8
    unlockTime: anchor.BN; // 8
    status: anchor.BN; // 8
}

export interface Avatar {
    // 8 + 120
    creator: PublicKey; // 32
    paragon: PublicKey; // 32
    avatar: PublicKey; // 32
    depositAmount: anchor.BN; // 8
    enterTime: anchor.BN; // 8
    verified: anchor.BN; // 8
}

export interface RoleInfo {
    address: PublicKey;
    role: anchor.BN;
}
