import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js';
import {
    PARAGON_PROGRAM_ID,
    GLOBAL_AUTHORITY_SEED,
    GlobalPool,
    PersonalPool,
    FusionPool,
    Avatar,
    HTO_TOKEN_MINT,
    HTO_TOKEN_DECIMAL,
    PERSONAL_POOL_SIZE,
    FUSION_POOL_SIZE,
    AVATAR_POOL_SIZE,
} from './types';
import {
    getAssociatedTokenAccount,
    getATokenAccountsNeedCreate,
    getNFTTokenAccount,
    getOwnerOfNFT,
    isExistAccount,
} from './utils';

import { ParagonProgram } from '~/js/paragon/paragon';
import { web3 } from '@project-serum/anchor';

export const createBreedInitTx = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<ParagonProgram>,
    userAddress: PublicKey,
    firstMint: PublicKey,
    secondMint: PublicKey,
    depositAmount: number
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PARAGON_PROGRAM_ID
    );

    const now = await getTimestamp(connection);
    const str = 'breed' + now.toString();

    const personalPool = await anchor.web3.PublicKey.createWithSeed(userAddress, str, PARAGON_PROGRAM_ID);

    const poolState = await getGlobalState(program);
    const ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: str,
        newAccountPubkey: personalPool,
        lamports: await connection.getMinimumBalanceForRentExemption(PERSONAL_POOL_SIZE),
        space: PERSONAL_POOL_SIZE,
        programId: PARAGON_PROGRAM_ID,
    });

    let firstUserTokenAccount = await getAssociatedTokenAccount(userAddress, firstMint);
    if (!(await isExistAccount(firstUserTokenAccount, connection))) {
        const accountOfNFT = await getNFTTokenAccount(firstMint, connection);
        if (firstUserTokenAccount.toBase58() != accountOfNFT.toBase58()) {
            const nftOwner = await getOwnerOfNFT(firstMint, connection);
            if (nftOwner.toBase58() == userAddress.toBase58()) firstUserTokenAccount = accountOfNFT;
            else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
                throw 'Error: Nft is not owned by user';
            }
        }
    }

    let secondUserTokenAccount = await getAssociatedTokenAccount(userAddress, secondMint);
    if (!(await isExistAccount(secondUserTokenAccount, connection))) {
        const accountOfNFT = await getNFTTokenAccount(secondMint, connection);
        if (secondUserTokenAccount.toBase58() != accountOfNFT.toBase58()) {
            const nftOwner = await getOwnerOfNFT(secondMint, connection);
            if (nftOwner.toBase58() == userAddress.toBase58()) secondUserTokenAccount = accountOfNFT;
            else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
                throw 'Error: Nft is not owned by user';
            }
        }
    }

    const { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        globalAuthority,
        [firstMint, secondMint, HTO_TOKEN_MINT]
    );

    const utilTokenAccount = await getAssociatedTokenAccount(userAddress, HTO_TOKEN_MINT);

    const tx = new Transaction();
    tx.add(ix);
    if (instructions.length > 0) instructions.map((itx) => tx.add(itx));
    tx.add(
        program.instruction.breedInit(bump, new anchor.BN(depositAmount * HTO_TOKEN_DECIMAL), {
            accounts: {
                owner: userAddress,
                globalAuthority,
                personalPool,
                firstMint,
                firstUserTokenAccount,
                firstDestNftTokenAccount: destinationAccounts[0],
                secondMint,
                secondUserTokenAccount,
                secondDestNftTokenAccount: destinationAccounts[1],
                utilTokenAccount,
                destUtilTokenAccount: destinationAccounts[2],
                vault: poolState.vault,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            },
            instructions: [],
            signers: [],
        })
    );

    return tx;
};

export const getTimestamp = async (connection: anchor.web3.Connection) => {
    const slot = (await connection.getEpochInfo()).absoluteSlot;
    const timestamp = await connection.getBlockTime(slot);
    return timestamp ?? 0;
};

export const createBreedClaimTx = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<ParagonProgram>,
    userAddress: PublicKey,
    personalPoolKey: PublicKey
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PARAGON_PROGRAM_ID
    );
    const poolData = await getPersonalPoolState(program, personalPoolKey);
    const nftMint1 = poolData.nftMint1;
    const nftMint2 = poolData.nftMint2;
    const bornMint = poolData.bornMint;
    const status = poolData.status.toNumber();

    const tx = new Transaction();
    if (status == 3) {
        const firstTokenAccount = await getAssociatedTokenAccount(globalAuthority, nftMint1);
        const secondTokenAccount = await getAssociatedTokenAccount(globalAuthority, nftMint2);
        const bornAccount = await getAssociatedTokenAccount(globalAuthority, bornMint);
        const htoAccount = await getAssociatedTokenAccount(globalAuthority, HTO_TOKEN_MINT);

        const { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
            connection,
            userAddress,
            userAddress,
            [nftMint1, nftMint2, bornMint]
        );
        const poolState = await getGlobalState(program);
        const ret2 = await getATokenAccountsNeedCreate(connection, userAddress, poolState.vault, [HTO_TOKEN_MINT]);
        if (instructions.length > 0) instructions.map((itx) => tx.add(itx));
        if (ret2.instructions.length > 0) instructions.map((itx) => tx.add(itx));

        tx.add(
            program.instruction.breedClaim(bump, {
                accounts: {
                    owner: userAddress,
                    personalPool: personalPoolKey,
                    globalAuthority,
                    firstTokenAccount,
                    firstDestAccount: destinationAccounts[0],
                    nftMint1,
                    secondTokenAccount,
                    secondDestAccount: destinationAccounts[1],
                    nftMint2,
                    bornAccount,
                    bornDestAccount: destinationAccounts[2],
                    bornMint,
                    htoAccount,
                    htoDestAccount: ret2.destinationAccounts[0],
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: [],
            })
        );
    }
    if (status == 2) {
        const firstTokenAccount = await getAssociatedTokenAccount(globalAuthority, nftMint1);
        const secondTokenAccount = await getAssociatedTokenAccount(globalAuthority, nftMint2);
        const htoAccount = await getAssociatedTokenAccount(globalAuthority, HTO_TOKEN_MINT);

        const { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
            connection,
            userAddress,
            userAddress,
            [nftMint1, nftMint2, HTO_TOKEN_MINT]
        );

        if (instructions.length > 0) instructions.map((itx) => tx.add(itx));

        tx.add(
            program.instruction.breedClaim(bump, {
                accounts: {
                    owner: userAddress,
                    personalPool: personalPoolKey,
                    globalAuthority,
                    firstTokenAccount,
                    firstDestAccount: destinationAccounts[0],
                    nftMint1,
                    secondTokenAccount,
                    secondDestAccount: destinationAccounts[1],
                    nftMint2,
                    bornAccount: firstTokenAccount,
                    bornDestAccount: destinationAccounts[0],
                    bornMint: nftMint1,
                    htoAccount,
                    htoDestAccount: destinationAccounts[2],
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: [],
            })
        );
    }

    return tx;
};

export const createEnterFusionTx = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<ParagonProgram>,
    userAddress: PublicKey,
    nftMint: PublicKey[],
    depositAmount: number
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PARAGON_PROGRAM_ID
    );

    const now = await getTimestamp(connection);
    const str = 'fusion' + now.toString();

    const poolState = await getGlobalState(program);

    const fusionPool = await anchor.web3.PublicKey.createWithSeed(userAddress, str, PARAGON_PROGRAM_ID);

    const ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: str,
        newAccountPubkey: fusionPool,
        lamports: await connection.getMinimumBalanceForRentExemption(FUSION_POOL_SIZE),
        space: FUSION_POOL_SIZE,
        programId: PARAGON_PROGRAM_ID,
    });

    const userUtilAccount = await getAssociatedTokenAccount(userAddress, HTO_TOKEN_MINT);
    const userTokenAccount: PublicKey[] = [];
    for (let i = 0; i < nftMint.length; i++) {
        userTokenAccount[i] = await getAssociatedTokenAccount(userAddress, nftMint[i]);
        if (!(await isExistAccount(userTokenAccount[i], connection))) {
            const accountOfNFT = await getNFTTokenAccount(nftMint[i], connection);
            if (userTokenAccount[i].toBase58() != accountOfNFT.toBase58()) {
                const nftOwner = await getOwnerOfNFT(nftMint[i], connection);
                if (nftOwner.toBase58() == userAddress.toBase58()) userTokenAccount[i] = accountOfNFT;
                else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
                    throw 'Error: Nft is not owned by user';
                }
            }
        }
    }

    const { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        globalAuthority,
        [nftMint[0], nftMint[1], nftMint[2], nftMint[3], nftMint[4], HTO_TOKEN_MINT]
    );

    const tx = new Transaction();

    tx.add(ix);

    if (instructions.length > 0) instructions.map((itx) => tx.add(itx));
    tx.add(
        program.instruction.fusionInit(bump, new anchor.BN(depositAmount * HTO_TOKEN_DECIMAL), {
            accounts: {
                owner: userAddress,
                globalAuthority,
                fusionPool,
                mainNft: nftMint[0],
                userTokenAccount: userTokenAccount[0],
                destTokenAccount: destinationAccounts[0],
                tokenMint1: nftMint[1],
                userTokenAccount1: userTokenAccount[1],
                destTokenAccount1: destinationAccounts[1],
                tokenMint2: nftMint[2],
                userTokenAccount2: userTokenAccount[2],
                destTokenAccount2: destinationAccounts[2],
                tokenMint3: nftMint[3],
                userTokenAccount3: userTokenAccount[3],
                destTokenAccount3: destinationAccounts[3],
                tokenMint4: nftMint[4],
                userTokenAccount4: userTokenAccount[4],
                destTokenAccount4: destinationAccounts[4],
                userUtilAccount,
                destUtilAccount: destinationAccounts[5],
                vault: poolState.vault,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
            instructions: [],
            signers: [],
        })
    );

    return tx;
};

export const createClaimFusionTx = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<ParagonProgram>,
    userAddress: PublicKey,
    fusionPoolPk: PublicKey
) => {
    const fusionPool = new web3.PublicKey(fusionPoolPk);

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PARAGON_PROGRAM_ID
    );
    const state = await getFusionPoolState(program, fusionPool);
    const globalState = await getGlobalState(program);

    const destUtilAccount = await getAssociatedTokenAccount(globalAuthority, HTO_TOKEN_MINT);
    const destTokenAccount: PublicKey[] = [];
    for (let i = 0; i < 5; i++) {
        destTokenAccount[i] = await getAssociatedTokenAccount(globalAuthority, state.nftMints[i]);
    }

    const tx = new Transaction();

    if (state.status.toNumber() === 2) {
        const ret1 = await getATokenAccountsNeedCreate(connection, userAddress, userAddress, [
            state.nftMints[0],
            state.nftMints[1],
            state.nftMints[2],
            state.nftMints[3],
            state.nftMints[4],
            HTO_TOKEN_MINT,
        ]);
        if (ret1.instructions.length > 0) ret1.instructions.map((itx) => tx.add(itx));

        tx.add(
            program.instruction.fuseClaim(bump, {
                accounts: {
                    owner: userAddress,
                    globalAuthority,
                    fusionPool,
                    fusion: state.nftMints[0],
                    userFusionAccount: ret1.destinationAccounts[0],
                    destFusionAccount: destTokenAccount[0],
                    tokenMint: state.nftMints[0],
                    userTokenAccount: ret1.destinationAccounts[0],
                    destTokenAccount: destTokenAccount[0],
                    tokenMint1: state.nftMints[1],
                    userTokenAccount1: ret1.destinationAccounts[1],
                    destTokenAccount1: destTokenAccount[1],
                    tokenMint2: state.nftMints[2],
                    userTokenAccount2: ret1.destinationAccounts[2],
                    destTokenAccount2: destTokenAccount[2],
                    tokenMint3: state.nftMints[3],
                    userTokenAccount3: ret1.destinationAccounts[3],
                    destTokenAccount3: destTokenAccount[3],
                    tokenMint4: state.nftMints[4],
                    userTokenAccount4: ret1.destinationAccounts[4],
                    destTokenAccount4: destTokenAccount[4],
                    userUtilAccount: ret1.destinationAccounts[5],
                    destUtilAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: [],
            })
        );
    }
    if (state.status.toNumber() === 3) {
        const ret1 = await getATokenAccountsNeedCreate(connection, userAddress, userAddress, [
            state.nftMints[0],
            state.nftMints[1],
            state.nftMints[2],
            state.nftMints[3],
            state.nftMints[4],
        ]);
        const ret2 = await getATokenAccountsNeedCreate(connection, userAddress, userAddress, [state.fusion]);
        const ret3 = await getATokenAccountsNeedCreate(connection, userAddress, globalState.vault, [HTO_TOKEN_MINT]);
        if (ret1.instructions.length > 0) ret1.instructions.map((itx) => tx.add(itx));
        if (ret2.instructions.length > 0) ret2.instructions.map((itx) => tx.add(itx));
        if (ret3.instructions.length > 0) ret3.instructions.map((itx) => tx.add(itx));

        const destFusionAccount = await getAssociatedTokenAccount(globalAuthority, state.fusion);

        tx.add(
            program.instruction.fuseClaim(bump, {
                accounts: {
                    owner: userAddress,
                    globalAuthority,
                    fusionPool,
                    fusion: state.fusion,
                    userFusionAccount: ret2.destinationAccounts[0],
                    destFusionAccount,
                    tokenMint: state.nftMints[0],
                    userTokenAccount: ret1.destinationAccounts[0],
                    destTokenAccount: destTokenAccount[0],
                    tokenMint1: state.nftMints[1],
                    userTokenAccount1: ret1.destinationAccounts[1],
                    destTokenAccount1: destTokenAccount[1],
                    tokenMint2: state.nftMints[2],
                    userTokenAccount2: ret1.destinationAccounts[2],
                    destTokenAccount2: destTokenAccount[2],
                    tokenMint3: state.nftMints[3],
                    userTokenAccount3: ret1.destinationAccounts[3],
                    destTokenAccount3: destTokenAccount[3],
                    tokenMint4: state.nftMints[4],
                    userTokenAccount4: ret1.destinationAccounts[4],
                    destTokenAccount4: destTokenAccount[4],
                    userUtilAccount: ret3.destinationAccounts[0],
                    destUtilAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: [],
            })
        );
    }

    return tx;
};

export const createStampInitTx = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<ParagonProgram>,
    userAddress: PublicKey,
    paragonMint: PublicKey,
    avatarMint: PublicKey,
    depositAmount: number,
    str: string
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PARAGON_PROGRAM_ID
    );

    const srcTokenAccount = await getAssociatedTokenAccount(userAddress, HTO_TOKEN_MINT);

    const { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        globalAuthority,
        [HTO_TOKEN_MINT, paragonMint]
    );

    const avatarPool = await anchor.web3.PublicKey.createWithSeed(userAddress, str, PARAGON_PROGRAM_ID);

    const poolState = await getGlobalState(program);
    const ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: str,
        newAccountPubkey: avatarPool,
        lamports: await connection.getMinimumBalanceForRentExemption(AVATAR_POOL_SIZE),
        space: AVATAR_POOL_SIZE,
        programId: PARAGON_PROGRAM_ID,
    });
    const userTokenAccount = await getNFTTokenAccount(avatarMint, connection);

    let userTokenAccount1 = await getAssociatedTokenAccount(userAddress, paragonMint);
    if (!(await isExistAccount(userTokenAccount1, connection))) {
        const accountOfNFT = await getNFTTokenAccount(paragonMint, connection);
        if (userTokenAccount1.toBase58() != accountOfNFT.toBase58()) {
            const nftOwner = await getOwnerOfNFT(paragonMint, connection);
            if (nftOwner.toBase58() == userAddress.toBase58()) userTokenAccount1 = accountOfNFT;
            else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
                throw 'Error: Nft is not owned by user';
            }
        }
    }

    const tx = new Transaction();
    tx.add(ix);
    if (instructions.length > 0) instructions.map((itx) => tx.add(itx));

    tx.add(
        program.instruction.stampInit(bump, new anchor.BN(depositAmount * HTO_TOKEN_DECIMAL), {
            accounts: {
                owner: userAddress,
                globalAuthority,
                avatarPool,
                srcTokenAccount,
                destTokenAccount: destinationAccounts[0],
                paragonMint,
                avatarMint,
                srcAvatarAccount: userTokenAccount,
                srcParagonAccount: userTokenAccount1,
                destParagonAccount: destinationAccounts[1],
                vault: poolState.vault,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
            instructions: [],
            signers: [],
        })
    );
    return tx;
};

export const getPersonalPoolState = async (
    program: anchor.Program<ParagonProgram>,
    personalPoolKey: PublicKey
): Promise<PersonalPool | null> => {
    try {
        // @ts-ignore
        const userPoolState = await program.account.personalPool.fetch(personalPoolKey);
        return userPoolState as unknown as PersonalPool;
    } catch {
        return null;
    }
};

export const getFusionPoolState = async (
    program: anchor.Program<ParagonProgram>,
    fusionPoolKey: PublicKey
): Promise<FusionPool | null> => {
    try {
        // @ts-ignore
        const userPoolState = await program.account.fusionPool.fetch(fusionPoolKey);
        return userPoolState as unknown as FusionPool;
    } catch {
        return null;
    }
};

export const getAvatarPoolState = async (
    program: anchor.Program<ParagonProgram>,
    avatarPoolKey: PublicKey
): Promise<Avatar | null> => {
    try {
        // @ts-ignore
        const userPoolState = await program.account.avatar.fetch(avatarPoolKey);
        return userPoolState as unknown as Avatar;
    } catch {
        return null;
    }
};

export const getGlobalState = async (program: anchor.Program<ParagonProgram>): Promise<GlobalPool | null> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [globalAuthority, _] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        PARAGON_PROGRAM_ID
    );
    try {
        // @ts-ignore
        const globalState = await program.account.globalPool.fetch(globalAuthority);
        return globalState as unknown as GlobalPool;
    } catch {
        return null;
    }
};

export const getAllOperation = async (
    connection: anchor.web3.Connection,
    program: anchor.Program<ParagonProgram>,
    address?: string,
    operation?: string
) => {
    const breed = [];
    const fuse = [];
    const avatar = [];

    let breedAccounts: any[];
    let fuseAccounts: any[];
    let avatarAccounts: any[];
    if (address != undefined) {
        breedAccounts = await connection.getProgramAccounts(PARAGON_PROGRAM_ID, {
            filters: [
                {
                    dataSize: PERSONAL_POOL_SIZE,
                },
                {
                    memcmp: {
                        offset: 8,
                        bytes: address,
                    },
                },
            ],
        });

        fuseAccounts = await connection.getProgramAccounts(PARAGON_PROGRAM_ID, {
            filters: [
                {
                    dataSize: FUSION_POOL_SIZE,
                },
                {
                    memcmp: {
                        offset: 8,
                        bytes: address,
                    },
                },
            ],
        });

        avatarAccounts = await connection.getProgramAccounts(PARAGON_PROGRAM_ID, {
            filters: [
                {
                    dataSize: AVATAR_POOL_SIZE,
                },
                {
                    memcmp: {
                        offset: 8,
                        bytes: address,
                    },
                },
            ],
        });
    } else {
        breedAccounts = await connection.getProgramAccounts(PARAGON_PROGRAM_ID, {
            filters: [
                {
                    dataSize: PERSONAL_POOL_SIZE,
                },
            ],
        });

        fuseAccounts = await connection.getProgramAccounts(PARAGON_PROGRAM_ID, {
            filters: [
                {
                    dataSize: FUSION_POOL_SIZE,
                },
            ],
        });

        avatarAccounts = await connection.getProgramAccounts(PARAGON_PROGRAM_ID, {
            filters: [
                {
                    dataSize: AVATAR_POOL_SIZE,
                },
            ],
        });
    }

    for (let i = 0; i < breedAccounts.length; i++) {
        const state = await getPersonalPoolState(program, breedAccounts[i].pubkey);
        if (state) {
            breed.push({
                pda: breedAccounts[i].pubkey.toBase58(),
                state: '=====================',

                creator: state.creator.toBase58(),
                nftMint1: state.nftMint1.toBase58(),
                nftMint2: state.nftMint2.toBase58(),
                bornMint: state.bornMint.toBase58(),
                enterTime: state.enterTime.toNumber(),
                unlockTime: state.unlockTime.toNumber(),
                depositAmount: state.depositAmount.toNumber(),
                status: state.status.toNumber(),
            });
        }
    }

    for (let i = 0; i < fuseAccounts.length; i++) {
        const state = await getFusionPoolState(program, fuseAccounts[i].pubkey);
        if (state) {
            fuse.push({
                pda: fuseAccounts[i].pubkey.toBase58(),
                state: '=====================',

                creator: state.creator.toBase58(),
                nftMint: state.nftMints[0].toBase58(),
                nftMint1: state.nftMints[1].toBase58(),
                nftMint2: state.nftMints[2].toBase58(),
                nftMint3: state.nftMints[3].toBase58(),
                nftMint4: state.nftMints[4].toBase58(),
                fusion: state.fusion.toBase58(),
                depositAmount: state.depositAmount.toNumber(),
                enterTime: state.enterTime.toNumber(),
                unlockTime: state.unlockTime.toNumber(),
                status: state.status.toNumber(),
            });
        }
    }

    for (let i = 0; i < avatarAccounts.length; i++) {
        const state = await getAvatarPoolState(program, avatarAccounts[i].pubkey);
        if (state) {
            avatar.push({
                pda: avatarAccounts[i].pubkey.toBase58(),
                state: '=====================',

                creator: state.creator.toBase58(),
                paragon: state.paragon.toBase58(),
                avatar: state.avatar.toBase58(),
                depositAmount: state.depositAmount.toNumber(),
                enterTime: state.enterTime.toNumber(),
                verified: state.verified.toNumber(),
            });
        }
    }

    const operations = {
        breeding: breed,
        fusion: fuse,
        stamping: avatar,
    };

    let result;
    if (operation === undefined) {
        result = operations;
    } else {
        result = operations[operation];
    }

    if (result === undefined) {
        return 0;
    } else {
        return result;
    }
};
