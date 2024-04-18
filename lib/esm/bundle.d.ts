/// <reference types="jito-ts/node_modules/@solana/web3.js" />
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import { SPL_ERROR } from "./global";
export declare const createAndSendBundle: (connection: Connection, bundleTip: number, transactions: VersionedTransaction[], payer: Keypair) => Promise<SPL_ERROR>;
