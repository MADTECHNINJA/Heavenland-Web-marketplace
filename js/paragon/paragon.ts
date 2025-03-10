export type ParagonProgram = {
    version: '0.1.0';
    name: 'paragon';
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
                }
            ];
        },
        {
            name: 'setVault';
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
                    name: 'roleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'vault';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'bump';
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
                    name: 'newAddr';
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
                    name: 'isAdmin';
                    type: 'u8';
                },
                {
                    name: 'isUpdater';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'breedInit';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'personalPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'firstMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'firstUserTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'firstDestNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'secondMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'secondUserTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'secondDestNftTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'utilTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destUtilTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'vault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
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
                    name: 'globalBump';
                    type: 'u8';
                },
                {
                    name: 'depositAmount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'breedRevert';
            accounts: [
                {
                    name: 'updater';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'personalPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'adminRoleInfo';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'roleBump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'breedUpdate';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'personalPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'roleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount';
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
                },
                {
                    name: 'unlockTime';
                    type: 'i64';
                }
            ];
        },
        {
            name: 'breedClaim';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'personalPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'firstTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'firstDestAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint1';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'secondTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'secondDestAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'nftMint2';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'bornAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'bornDestAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'bornMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'htoAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'htoDestAccount';
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
        },
        {
            name: 'fusionInit';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fusionPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'mainNft';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint1';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount1';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount1';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint2';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount2';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount2';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint3';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount3';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount3';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint4';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount4';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount4';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userUtilAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destUtilAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'vault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
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
                    name: 'depositAmount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'fuseRevert';
            accounts: [
                {
                    name: 'updater';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'fusionPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'adminRoleInfo';
                    isMut: true;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'roleBump';
                    type: 'u8';
                }
            ];
        },
        {
            name: 'fuseUpdate';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'roleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fusionPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount';
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
                },
                {
                    name: 'unlockTime';
                    type: 'i64';
                }
            ];
        },
        {
            name: 'fuseClaim';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fusionPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'fusion';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'userFusionAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destFusionAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint1';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount1';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount1';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint2';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount2';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount2';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint3';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount3';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount3';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'tokenMint4';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userTokenAccount4';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount4';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'userUtilAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destUtilAccount';
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
        },
        {
            name: 'stampInit';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'avatarPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'paragonMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'avatarMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcAvatarAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcParagonAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destParagonAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'vault';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
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
                    name: 'depositAmount';
                    type: 'u64';
                }
            ];
        },
        {
            name: 'stampFinish';
            accounts: [
                {
                    name: 'owner';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'globalAuthority';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'roleInfo';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'avatarPool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'paragonMint';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcParagonAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'destParagonAccount';
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
                },
                {
                    name: 'success';
                    type: 'u8';
                }
            ];
        }
    ];
    accounts: [
        {
            name: 'globalPool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'admin';
                        type: 'publicKey';
                    },
                    {
                        name: 'vault';
                        type: 'publicKey';
                    },
                    {
                        name: 'updater';
                        type: 'publicKey';
                    }
                ];
            };
        },
        {
            name: 'roleInfo';
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
            name: 'personalPool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'creator';
                        type: 'publicKey';
                    },
                    {
                        name: 'nftMint1';
                        type: 'publicKey';
                    },
                    {
                        name: 'nftMint2';
                        type: 'publicKey';
                    },
                    {
                        name: 'bornMint';
                        type: 'publicKey';
                    },
                    {
                        name: 'depositAmount';
                        type: 'u64';
                    },
                    {
                        name: 'enterTime';
                        type: 'i64';
                    },
                    {
                        name: 'unlockTime';
                        type: 'i64';
                    },
                    {
                        name: 'status';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'fusionPool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'creator';
                        type: 'publicKey';
                    },
                    {
                        name: 'nftMints';
                        type: {
                            array: ['publicKey', 5];
                        };
                    },
                    {
                        name: 'fusion';
                        type: 'publicKey';
                    },
                    {
                        name: 'depositAmount';
                        type: 'u64';
                    },
                    {
                        name: 'enterTime';
                        type: 'i64';
                    },
                    {
                        name: 'unlockTime';
                        type: 'i64';
                    },
                    {
                        name: 'status';
                        type: 'u64';
                    }
                ];
            };
        },
        {
            name: 'avatar';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'creator';
                        type: 'publicKey';
                    },
                    {
                        name: 'paragon';
                        type: 'publicKey';
                    },
                    {
                        name: 'avatar';
                        type: 'publicKey';
                    },
                    {
                        name: 'depositAmount';
                        type: 'u64';
                    },
                    {
                        name: 'enterTime';
                        type: 'i64';
                    },
                    {
                        name: 'verified';
                        type: 'u64';
                    }
                ];
            };
        }
    ];
    errors: [
        {
            code: 6000;
            name: 'InvalidAuthAddr';
            msg: 'Invalid Authority Address or Bump';
        },
        {
            code: 6001;
            name: 'InvalidAdminAddr';
            msg: 'Invalid Admin Address';
        },
        {
            code: 6002;
            name: 'InvalidUpdaterAddr';
            msg: 'Invalid Updater Address';
        },
        {
            code: 6003;
            name: 'InvalidLockTime';
            msg: 'Invalid Lock Time';
        },
        {
            code: 6004;
            name: 'InvalidStatus';
            msg: 'Invalid Status';
        },
        {
            code: 6005;
            name: 'InvalidSeq';
            msg: 'Invalid Seq Number';
        },
        {
            code: 6006;
            name: 'InvalidTokenAddr';
            msg: 'Invalid Token Address';
        },
        {
            code: 6007;
            name: 'InvalidOwnerAddr';
            msg: 'Invalid Owner Address';
        },
        {
            code: 6008;
            name: 'InvalidParam';
            msg: 'Invalid Param';
        },
        {
            code: 6009;
            name: 'NeverAssignedRole';
            msg: 'Never Assigned Role';
        },
        {
            code: 6010;
            name: 'InvalidUserRoleAddress';
            msg: 'Invalid User Address';
        },
        {
            code: 6011;
            name: 'ChangingSelfAdminRole';
            msg: 'Changing Self Admin Role';
        },
        {
            code: 6012;
            name: 'AlreadyConfigured';
            msg: 'Already Configured';
        },
        {
            code: 6013;
            name: 'InvalidMetadata';
            msg: 'Invalid Metadata Address';
        },
        {
            code: 6014;
            name: 'MetadataCreatorParseError';
            msg: "Can't Parse The NFT's Creators";
        },
        {
            code: 6015;
            name: 'UnkownOrNotAllowedNFTCollection';
            msg: 'Unknown Collection Or The Collection Is Not Allowed';
        }
    ];
};

export const IDL: ParagonProgram = {
    version: '0.1.0',
    name: 'paragon',
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
            ],
        },
        {
            name: 'setVault',
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
                    name: 'roleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'vault',
                    isMut: true,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'globalBump',
                    type: 'u8',
                },
                {
                    name: 'bump',
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
                    name: 'newAddr',
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
                    name: 'isAdmin',
                    type: 'u8',
                },
                {
                    name: 'isUpdater',
                    type: 'u8',
                },
            ],
        },
        {
            name: 'breedInit',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'personalPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'firstMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'firstUserTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'firstDestNftTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'secondMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'secondUserTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'secondDestNftTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'utilTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destUtilTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'vault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
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
                    name: 'globalBump',
                    type: 'u8',
                },
                {
                    name: 'depositAmount',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'breedRevert',
            accounts: [
                {
                    name: 'updater',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'personalPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'adminRoleInfo',
                    isMut: true,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'roleBump',
                    type: 'u8',
                },
            ],
        },
        {
            name: 'breedUpdate',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'personalPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'roleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount',
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
                {
                    name: 'unlockTime',
                    type: 'i64',
                },
            ],
        },
        {
            name: 'breedClaim',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'personalPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'firstTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'firstDestAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftMint1',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'secondTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'secondDestAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'nftMint2',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'bornAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'bornDestAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'bornMint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'htoAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'htoDestAccount',
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
        {
            name: 'fusionInit',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'fusionPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'mainNft',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint1',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount1',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount1',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint2',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount2',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount2',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint3',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount3',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount3',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint4',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount4',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount4',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userUtilAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destUtilAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'vault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
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
                    name: 'depositAmount',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'fuseRevert',
            accounts: [
                {
                    name: 'updater',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'fusionPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'adminRoleInfo',
                    isMut: true,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'roleBump',
                    type: 'u8',
                },
            ],
        },
        {
            name: 'fuseUpdate',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'roleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'fusionPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount',
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
                {
                    name: 'unlockTime',
                    type: 'i64',
                },
            ],
        },
        {
            name: 'fuseClaim',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'fusionPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'fusion',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'userFusionAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destFusionAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint1',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount1',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount1',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint2',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount2',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount2',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint3',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount3',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount3',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'tokenMint4',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userTokenAccount4',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount4',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'userUtilAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destUtilAccount',
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
        {
            name: 'stampInit',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'avatarPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'srcTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'paragonMint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'avatarMint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'srcAvatarAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'srcParagonAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destParagonAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'vault',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
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
                    name: 'depositAmount',
                    type: 'u64',
                },
            ],
        },
        {
            name: 'stampFinish',
            accounts: [
                {
                    name: 'owner',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'globalAuthority',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'roleInfo',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'avatarPool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'srcTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'paragonMint',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'srcParagonAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'destParagonAccount',
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
                {
                    name: 'success',
                    type: 'u8',
                },
            ],
        },
    ],
    accounts: [
        {
            name: 'globalPool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'admin',
                        type: 'publicKey',
                    },
                    {
                        name: 'vault',
                        type: 'publicKey',
                    },
                    {
                        name: 'updater',
                        type: 'publicKey',
                    },
                ],
            },
        },
        {
            name: 'roleInfo',
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
            name: 'personalPool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'creator',
                        type: 'publicKey',
                    },
                    {
                        name: 'nftMint1',
                        type: 'publicKey',
                    },
                    {
                        name: 'nftMint2',
                        type: 'publicKey',
                    },
                    {
                        name: 'bornMint',
                        type: 'publicKey',
                    },
                    {
                        name: 'depositAmount',
                        type: 'u64',
                    },
                    {
                        name: 'enterTime',
                        type: 'i64',
                    },
                    {
                        name: 'unlockTime',
                        type: 'i64',
                    },
                    {
                        name: 'status',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'fusionPool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'creator',
                        type: 'publicKey',
                    },
                    {
                        name: 'nftMints',
                        type: {
                            array: ['publicKey', 5],
                        },
                    },
                    {
                        name: 'fusion',
                        type: 'publicKey',
                    },
                    {
                        name: 'depositAmount',
                        type: 'u64',
                    },
                    {
                        name: 'enterTime',
                        type: 'i64',
                    },
                    {
                        name: 'unlockTime',
                        type: 'i64',
                    },
                    {
                        name: 'status',
                        type: 'u64',
                    },
                ],
            },
        },
        {
            name: 'avatar',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'creator',
                        type: 'publicKey',
                    },
                    {
                        name: 'paragon',
                        type: 'publicKey',
                    },
                    {
                        name: 'avatar',
                        type: 'publicKey',
                    },
                    {
                        name: 'depositAmount',
                        type: 'u64',
                    },
                    {
                        name: 'enterTime',
                        type: 'i64',
                    },
                    {
                        name: 'verified',
                        type: 'u64',
                    },
                ],
            },
        },
    ],
    errors: [
        {
            code: 6000,
            name: 'InvalidAuthAddr',
            msg: 'Invalid Authority Address or Bump',
        },
        {
            code: 6001,
            name: 'InvalidAdminAddr',
            msg: 'Invalid Admin Address',
        },
        {
            code: 6002,
            name: 'InvalidUpdaterAddr',
            msg: 'Invalid Updater Address',
        },
        {
            code: 6003,
            name: 'InvalidLockTime',
            msg: 'Invalid Lock Time',
        },
        {
            code: 6004,
            name: 'InvalidStatus',
            msg: 'Invalid Status',
        },
        {
            code: 6005,
            name: 'InvalidSeq',
            msg: 'Invalid Seq Number',
        },
        {
            code: 6006,
            name: 'InvalidTokenAddr',
            msg: 'Invalid Token Address',
        },
        {
            code: 6007,
            name: 'InvalidOwnerAddr',
            msg: 'Invalid Owner Address',
        },
        {
            code: 6008,
            name: 'InvalidParam',
            msg: 'Invalid Param',
        },
        {
            code: 6009,
            name: 'NeverAssignedRole',
            msg: 'Never Assigned Role',
        },
        {
            code: 6010,
            name: 'InvalidUserRoleAddress',
            msg: 'Invalid User Address',
        },
        {
            code: 6011,
            name: 'ChangingSelfAdminRole',
            msg: 'Changing Self Admin Role',
        },
        {
            code: 6012,
            name: 'AlreadyConfigured',
            msg: 'Already Configured',
        },
        {
            code: 6013,
            name: 'InvalidMetadata',
            msg: 'Invalid Metadata Address',
        },
        {
            code: 6014,
            name: 'MetadataCreatorParseError',
            msg: "Can't Parse The NFT's Creators",
        },
        {
            code: 6015,
            name: 'UnkownOrNotAllowedNFTCollection',
            msg: 'Unknown Collection Or The Collection Is Not Allowed',
        },
    ],
};
