export type ParcelStaking = {
    version: '0.1.0';
    name: 'parcel_staking';
    instructions: [
        {
            name: 'initialize';
            accounts: [
                {
                    name: 'admin';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'adminRoleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rewardVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'roleBump';
                    type: 'u8';
                },
                {
                    name: 'newFactor';
                    type: {
                        option: 'u64';
                    };
                },
                {
                    name: 'newFactorDecimal';
                    type: {
                        option: 'u64';
                    };
                },
                {
                    name: 'newReleaseRate';
                    type: {
                        option: 'u64';
                    };
                }
            ];
        },
        {
            name: 'refundFromVault';
            accounts: [
                {
                    name: 'admin';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'adminRoleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rewardVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userRewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'roleBump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'changeRole';
            accounts: [
                {
                    name: 'admin';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'adminRoleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userRoleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'roleBump';
                    type: 'u8';
                },
                {
                    name: 'userRoleBump';
                    type: 'u8';
                },
                {
                    name: 'userAddress';
                    type: 'publicKey';
                },
                {
                    name: 'isAdmin';
                    type: 'u64';
                },
                {
                    name: 'isUpdater';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'initializeUserPool';
            accounts: [
                {
                    name: 'userPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                }
            ];
            args: [];
        },
        {
            name: 'registerNft';
            accounts: [
                {
                    name: 'user';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'roleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftData';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'nftBump';
                    type: 'u8';
                },
                {
                    name: 'roleBump';
                    type: 'u8';
                },
                {
                    name: 'nftConst';
                    type: {
                        option: 'u64';
                    };
                },
                {
                    name: 'nftConstDecimal';
                    type: {
                        option: 'u64';
                    };
                },
                {
                    name: 'isDao';
                    type: {
                        option: 'u64';
                    };
                },
                {
                    name: 'active';
                    type: {
                        option: 'u64';
                    };
                }
            ];
        },
        {
            name: 'stakeNftToPool';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'userPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftData';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userRewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destRewardTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'nftBump';
                    type: 'u8';
                },
                {
                    name: 'amount';
                    type: 'u64';
                },
                {
                    name: 'tier';
                    type: 'u64';
                },
                {
                    name: 'withNft';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'mergeStakes';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'userPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftData';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userRewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rewardVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'nftBump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'withdrawNftFromPool';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'userPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftData';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userRewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destRewardTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rewardVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'nftBump';
                    type: 'u8';
                },
                {
                    name: 'index';
                    type: 'u8';
                },
                {
                    name: 'restaking';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'claimReward';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'userPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'rewardVault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userRewardAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                }
            ];
        }
    ];
    accounts: [
        {
            name: 'GlobalPool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'htoReleaseRate';
                        type: 'u64';
                    },
                    {
                        name: 'factorHl';
                        type: 'u64';
                    },
                    {
                        name: 'decimalHl';
                        type: 'u64';
                    },
                    {
                        name: 'totalRewardSum';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'RoleInfo';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'address';
                        type: 'publicKey';
                    },
                    {
                        name: 'role';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'NftInfo';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'mint';
                        type: 'publicKey';
                    },
                    {
                        name: 'isDao';
                        type: 'u64';
                    },
                    {
                        name: 'nftConst';
                        type: 'u64';
                    },
                    {
                        name: 'nftConstDecimal';
                        type: 'u64';
                    },
                    {
                        name: 'active';
                        type: 'u64';
                    },
                    {
                        name: 'isLocked';
                        type: 'u64';
                    },
                    {
                        name: 'stakerAddress';
                        type: 'publicKey';
                    },
                    {
                        name: 'curLockedAmount';
                        type: 'u64';
                    },
                    {
                        name: 'lockedUntil';
                        type: 'i64';
                    }
                ];
            };
        },
        {
            name: 'UserPool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'owner';
                        type: 'publicKey';
                    },
                    {
                        name: 'stakedCount';
                        type: 'u64';
                    },
                    {
                        name: 'staking';
                        type: {
                            array: [
                                {
                                    defined: 'StakedData';
                                },
                                100
                            ];
                        };
                    }
                ];
            };
        }
    ];
    types: [
        {
            name: 'StakedData';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'mint';
                        type: 'publicKey';
                    },
                    {
                        name: 'stakedTime';
                        type: 'i64';
                    },
                    {
                        name: 'tier';
                        type: 'u64';
                    },
                    {
                        name: 'amount';
                        type: 'u64';
                    },
                    {
                        name: 'claimedTime';
                        type: 'i64';
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'Uninitialized';
            msg: 'Uninitialized account';
        },
        {
            code: 6001;
            name: 'InvalidSigner';
            msg: 'Signer Address Mismatch';
        },
        {
            code: 6002;
            name: 'InvalidParam';
            msg: 'Instruction Flag Param Should Be Zero Or One';
        },
        {
            code: 6003;
            name: 'InvalidUserRoleAddress';
            msg: 'User Role Address Mismatch';
        },
        {
            code: 6004;
            name: 'NeverAssignedRole';
            msg: 'User Role Never Assigned';
        },
        {
            code: 6005;
            name: 'ChangingSelfAdminRole';
            msg: "Can't Change Self Admin Role";
        },
        {
            code: 6006;
            name: 'AlreadyConfigured';
            msg: 'Admin & NFTUpdater Role Already Configured';
        },
        {
            code: 6007;
            name: 'InvalidSuperOwner';
            msg: 'Invalid Super Owner';
        },
        {
            code: 6008;
            name: 'InvalidUserPool';
            msg: 'Invalid User Pool Owner';
        },
        {
            code: 6009;
            name: 'InvalidAdmin';
            msg: 'Invalid Admin';
        },
        {
            code: 6010;
            name: 'InvalidNFTUpdater';
            msg: 'Invalid NFT Updater';
        },
        {
            code: 6011;
            name: 'InsufficientRewardVault';
            msg: 'Insufficient Reward Token Balance';
        },
        {
            code: 6012;
            name: 'InsufficientUserTokenBalance';
            msg: 'Insufficient User Token Balance';
        },
        {
            code: 6013;
            name: 'NotRegisteredNFT';
            msg: 'NFT Attribute Data is not Registered';
        },
        {
            code: 6014;
            name: 'InvalidNFTData';
            msg: 'NFT Data is Mismatching with Mint';
        },
        {
            code: 6015;
            name: 'NFTRegisterationRemoved';
            msg: 'NFT Data is Removed';
        },
        {
            code: 6016;
            name: 'InvalidNFTAddress';
            msg: 'Invalid NFT Address';
        },
        {
            code: 6017;
            name: 'InvaliedMetadata';
            msg: 'Invalid Metadata Address';
        },
        {
            code: 6018;
            name: 'MetadataCreatorParseError';
            msg: "Can't Parse The NFT's Creators";
        },
        {
            code: 6019;
            name: 'UnkownOrNotAllowedNFTCollection';
            msg: 'Unknown Collection Or The Collection Is Not Allowed';
        },
        {
            code: 6020;
            name: 'CollectionAddressNotVerified';
            msg: 'Collection Address from NFT is not verified';
        },
        {
            code: 6021;
            name: 'NFTAlreadyStaked';
            msg: 'NFT is Already Staked';
        },
        {
            code: 6022;
            name: 'NFTNotStakedYet';
            msg: 'NFT is Not Staked Yet';
        },
        {
            code: 6023;
            name: 'NFTStakerMismatch';
            msg: 'NFT Staker is Mismatch';
        },
        {
            code: 6024;
            name: 'MaxStakeAmountExceed';
            msg: 'Max Stake Amount for the NFT is exceeded';
        },
        {
            code: 6025;
            name: 'MaxStakingCountExceed';
            msg: 'Max Staking Count is 100 for a particular user wallet';
        },
        {
            code: 6026;
            name: 'NotEnoughLockingTime';
            msg: 'NFT Locking Time is not enough for Staking Period';
        },
        {
            code: 6027;
            name: 'IndexOutBounded';
            msg: 'Staking Index is Out Bounded';
        },
        {
            code: 6028;
            name: 'InvalidStakingNFTAddress';
            msg: 'Invalid Underlying NFT Address';
        },
        {
            code: 6029;
            name: 'InvalidTierValue';
            msg: 'Tier Value Invalid';
        }
    ];
};

export const IDL: ParcelStaking = {
    version: '0.1.0',
    name: 'parcel_staking',
    instructions: [
        {
            name: 'initialize',
            accounts: [
                {
                    name: 'admin',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'adminRoleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'rewardVault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8',
                },
                {
                    name: 'roleBump',
                    type: 'u8',
                },
                {
                    name: 'newFactor',
                    type: {
                        option: 'u64',
                    },
                },
                {
                    name: 'newFactorDecimal',
                    type: {
                        option: 'u64',
                    },
                },
                {
                    name: 'newReleaseRate',
                    type: {
                        option: 'u64',
                    },
                },
            ],
        },
        {
            name: 'refundFromVault',
            accounts: [
                {
                    name: 'admin',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'adminRoleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'rewardVault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userRewardAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8',
                },
                {
                    name: 'roleBump',
                    type: 'u8',
                },
            ],
        },
        {
            name: 'changeRole',
            accounts: [
                {
                    name: 'admin',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'adminRoleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userRoleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'roleBump',
                    type: 'u8',
                },
                {
                    name: 'userRoleBump',
                    type: 'u8',
                },
                {
                    name: 'userAddress',
                    type: 'publicKey',
                },
                {
                    name: 'isAdmin',
                    type: 'u64',
                },
                {
                    name: 'isUpdater',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'initializeUserPool',
            accounts: [
                {
                    name: 'userPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
            ],
            args: [],
        },
        {
            name: 'registerNft',
            accounts: [
                {
                    name: 'user',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'roleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftData',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'nftBump',
                    type: 'u8',
                },
                {
                    name: 'roleBump',
                    type: 'u8',
                },
                {
                    name: 'nftConst',
                    type: {
                        option: 'u64',
                    },
                },
                {
                    name: 'nftConstDecimal',
                    type: {
                        option: 'u64',
                    },
                },
                {
                    name: 'isDao',
                    type: {
                        option: 'u64',
                    },
                },
                {
                    name: 'active',
                    type: {
                        option: 'u64',
                    },
                },
            ],
        },
        {
            name: 'stakeNftToPool',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'userPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftData',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userNftTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destNftTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userRewardAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destRewardTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8',
                },
                {
                    name: 'nftBump',
                    type: 'u8',
                },
                {
                    name: 'amount',
                    type: 'u64',
                },
                {
                    name: 'tier',
                    type: 'u64',
                },
                {
                    name: 'withNft',
                    type: 'u8',
                },
            ],
        },
        {
            name: 'mergeStakes',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'userPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftData',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userRewardAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'rewardVault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8',
                },
                {
                    name: 'nftBump',
                    type: 'u8',
                },
            ],
        },
        {
            name: 'withdrawNftFromPool',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'userPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftData',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userNftTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destNftTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userRewardAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destRewardTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'rewardVault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8',
                },
                {
                    name: 'nftBump',
                    type: 'u8',
                },
                {
                    name: 'index',
                    type: 'u8',
                },
                {
                    name: 'restaking',
                    type: 'u8',
                },
            ],
        },
        {
            name: 'claimReward',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'userPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'rewardVault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userRewardAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8',
                },
            ],
        },
    ],
    accounts: [
        {
            name: 'GlobalPool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'htoReleaseRate',
                        type: 'u64',
                    },
                    {
                        name: 'factorHl',
                        type: 'u64',
                    },
                    {
                        name: 'decimalHl',
                        type: 'u64',
                    },
                    {
                        name: 'totalRewardSum',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'RoleInfo',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'address',
                        type: 'publicKey',
                    },
                    {
                        name: 'role',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'NftInfo',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'mint',
                        type: 'publicKey',
                    },
                    {
                        name: 'isDao',
                        type: 'u64',
                    },
                    {
                        name: 'nftConst',
                        type: 'u64',
                    },
                    {
                        name: 'nftConstDecimal',
                        type: 'u64',
                    },
                    {
                        name: 'active',
                        type: 'u64',
                    },
                    {
                        name: 'isLocked',
                        type: 'u64',
                    },
                    {
                        name: 'stakerAddress',
                        type: 'publicKey',
                    },
                    {
                        name: 'curLockedAmount',
                        type: 'u64',
                    },
                    {
                        name: 'lockedUntil',
                        type: 'i64',
                    },
                ],
            },
        },
        {
            name: 'UserPool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'owner',
                        type: 'publicKey',
                    },
                    {
                        name: 'stakedCount',
                        type: 'u64',
                    },
                    {
                        name: 'staking',
                        type: {
                            array: [
                                {
                                    defined: 'StakedData',
                                },
                                100,
                            ],
                        },
                    },
                ],
            },
        },
    ],
    types: [
        {
            name: 'StakedData',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'mint',
                        type: 'publicKey',
                    },
                    {
                        name: 'stakedTime',
                        type: 'i64',
                    },
                    {
                        name: 'tier',
                        type: 'u64',
                    },
                    {
                        name: 'amount',
                        type: 'u64',
                    },
                    {
                        name: 'claimedTime',
                        type: 'i64',
                    },
                ],
            },
        },
    ],
    errors: [
        {
            code: 6000,
            name: 'Uninitialized',
            msg: 'Uninitialized account',
        },
        {
            code: 6001,
            name: 'InvalidSigner',
            msg: 'Signer Address Mismatch',
        },
        {
            code: 6002,
            name: 'InvalidParam',
            msg: 'Instruction Flag Param Should Be Zero Or One',
        },
        {
            code: 6003,
            name: 'InvalidUserRoleAddress',
            msg: 'User Role Address Mismatch',
        },
        {
            code: 6004,
            name: 'NeverAssignedRole',
            msg: 'User Role Never Assigned',
        },
        {
            code: 6005,
            name: 'ChangingSelfAdminRole',
            msg: "Can't Change Self Admin Role",
        },
        {
            code: 6006,
            name: 'AlreadyConfigured',
            msg: 'Admin & NFTUpdater Role Already Configured',
        },
        {
            code: 6007,
            name: 'InvalidSuperOwner',
            msg: 'Invalid Super Owner',
        },
        {
            code: 6008,
            name: 'InvalidUserPool',
            msg: 'Invalid User Pool Owner',
        },
        {
            code: 6009,
            name: 'InvalidAdmin',
            msg: 'Invalid Admin',
        },
        {
            code: 6010,
            name: 'InvalidNFTUpdater',
            msg: 'Invalid NFT Updater',
        },
        {
            code: 6011,
            name: 'InsufficientRewardVault',
            msg: 'Insufficient Reward Token Balance',
        },
        {
            code: 6012,
            name: 'InsufficientUserTokenBalance',
            msg: 'Insufficient User Token Balance',
        },
        {
            code: 6013,
            name: 'NotRegisteredNFT',
            msg: 'NFT Attribute Data is not Registered',
        },
        {
            code: 6014,
            name: 'InvalidNFTData',
            msg: 'NFT Data is Mismatching with Mint',
        },
        {
            code: 6015,
            name: 'NFTRegisterationRemoved',
            msg: 'NFT Data is Removed',
        },
        {
            code: 6016,
            name: 'InvalidNFTAddress',
            msg: 'Invalid NFT Address',
        },
        {
            code: 6017,
            name: 'InvaliedMetadata',
            msg: 'Invalid Metadata Address',
        },
        {
            code: 6018,
            name: 'MetadataCreatorParseError',
            msg: "Can't Parse The NFT's Creators",
        },
        {
            code: 6019,
            name: 'UnkownOrNotAllowedNFTCollection',
            msg: 'Unknown Collection Or The Collection Is Not Allowed',
        },
        {
            code: 6020,
            name: 'CollectionAddressNotVerified',
            msg: 'Collection Address from NFT is not verified',
        },
        {
            code: 6021,
            name: 'NFTAlreadyStaked',
            msg: 'NFT is Already Staked',
        },
        {
            code: 6022,
            name: 'NFTNotStakedYet',
            msg: 'NFT is Not Staked Yet',
        },
        {
            code: 6023,
            name: 'NFTStakerMismatch',
            msg: 'NFT Staker is Mismatch',
        },
        {
            code: 6024,
            name: 'MaxStakeAmountExceed',
            msg: 'Max Stake Amount for the NFT is exceeded',
        },
        {
            code: 6025,
            name: 'MaxStakingCountExceed',
            msg: 'Max Staking Count is 100 for a particular user wallet',
        },
        {
            code: 6026,
            name: 'NotEnoughLockingTime',
            msg: 'NFT Locking Time is not enough for Staking Period',
        },
        {
            code: 6027,
            name: 'IndexOutBounded',
            msg: 'Staking Index is Out Bounded',
        },
        {
            code: 6028,
            name: 'InvalidStakingNFTAddress',
            msg: 'Invalid Underlying NFT Address',
        },
        {
            code: 6029,
            name: 'InvalidTierValue',
            msg: 'Tier Value Invalid',
        },
    ],
};
