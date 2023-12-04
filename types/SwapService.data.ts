export const enum SwapCurrency {
    USDC = 'USDC',
    SOL = 'SOL',
    HTO = 'HTO',
}

export const SwapToken = new Map<string, { address; decimals }>([
    [SwapCurrency.SOL, { address: 'So11111111111111111111111111111111111111112', decimals: 9 }],
    [SwapCurrency.USDC, { address: import.meta.env.VITE_HL_USDC_MINT_KEY, decimals: 6 }],
    [SwapCurrency.HTO, { address: import.meta.env.VITE_HL_HTO_MINT_KEY, decimals: 9 }],
]);
