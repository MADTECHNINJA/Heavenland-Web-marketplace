export enum TokenName {
    HTO = 'HTO',
    SOL = 'SOL',
    USDC = 'USDC',
}

export const TokenAddress = new Map<TokenName, string>([
    [TokenName.HTO, import.meta.env.VITE_HL_HTO_MINT_KEY],
    [TokenName.USDC, import.meta.env.VITE_HL_USDC_MINT_KEY],
    [TokenName.SOL, 'So11111111111111111111111111111111111111112'],
]);
