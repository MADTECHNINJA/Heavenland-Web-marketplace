import { SwapService } from '~/types/SwapService.types';
import { SwapCurrency } from '~/types/SwapService.data';

export default (inputMint: SwapCurrency, outputMint: SwapCurrency) => {
    return new SwapService(inputMint, outputMint);
};
