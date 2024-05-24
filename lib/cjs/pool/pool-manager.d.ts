/// <reference types="jito-ts/node_modules/@solana/web3.js" />
import { LiquidityPoolKeys, Percent, TokenAmount } from "@raydium-io/raydium-sdk";
import { Connection } from "@solana/web3.js";
import BN from "bn.js";
export declare class PoolManager {
    private poolKey;
    private poolInfo;
    private baseToken;
    private quoteToken;
    constructor(poolKey: LiquidityPoolKeys);
    computeSol(baseAmount: BN): {
        amountOut: import("@raydium-io/raydium-sdk").CurrencyAmount;
        minAmountOut: import("@raydium-io/raydium-sdk").CurrencyAmount;
        currentPrice: import("@raydium-io/raydium-sdk").Price;
        executionPrice: import("@raydium-io/raydium-sdk").Price | null;
        priceImpact: Percent;
        fee: import("@raydium-io/raydium-sdk").CurrencyAmount;
    } | {
        amountOut: TokenAmount;
        minAmountOut: TokenAmount;
        currentPrice: import("@raydium-io/raydium-sdk").Price;
        executionPrice: import("@raydium-io/raydium-sdk").Price | null;
        priceImpact: Percent;
        fee: import("@raydium-io/raydium-sdk").CurrencyAmount;
    };
    updateWithReverse(baseReserve: BN, quoteReserve: BN): void;
    updateWithReal(connection: Connection): Promise<boolean>;
    getPoolInfo(): any;
}
