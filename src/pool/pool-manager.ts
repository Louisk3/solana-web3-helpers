import {
  Liquidity,
  LiquidityPoolInfo,
  LiquidityPoolKeys,
  Percent,
  Token,
  TokenAmount
} from "@raydium-io/raydium-sdk";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export class PoolManager {
  private poolKey: LiquidityPoolKeys;
  private poolInfo: any;
  private baseToken: Token;
  private quoteToken: Token;

  constructor(poolKey: LiquidityPoolKeys) {
    this.poolKey = poolKey;

    this.baseToken = new Token(
      TOKEN_PROGRAM_ID,
      poolKey.baseMint,
      poolKey.baseDecimals
    );
    this.quoteToken = new Token(
      TOKEN_PROGRAM_ID,
      poolKey.quoteMint,
      poolKey.quoteDecimals
    );

    this.poolInfo = {
      baseDecimals: poolKey.baseDecimals,
      quoteDecimals: poolKey.baseDecimals,
      baseReserve: new BN(0),
      quoteReserve: new BN(0)
    };
  }

  public computeSol(baseAmount: BN) {
    console.log("baseReverse: ", this.poolInfo.baseReserve.toString());
    console.log("quoteReverse: ", this.poolInfo.quoteReserve.toString());
    return Liquidity.computeAmountOut({
      poolKeys: this.poolKey,
      poolInfo: this.poolInfo,
      amountIn: new TokenAmount(this.baseToken, baseAmount, true),
      currencyOut: this.quoteToken,
      slippage: new Percent(1, 100)
    });
  }

  public updateWithReverse(baseReserve: BN, quoteReserve: BN) {
    this.poolInfo = {
      ...this.poolInfo,
      baseReserve: baseReserve,
      quoteReserve: quoteReserve
    };
  }

  public async updateWithReal(connection: Connection) {
    try {
      this.poolInfo = await Liquidity.fetchInfo({
        connection,
        poolKeys: this.poolKey
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  public getPoolInfo() {
    return this.poolInfo;
  }
}
