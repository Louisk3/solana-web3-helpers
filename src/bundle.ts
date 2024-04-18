import {
  Connection,
  Keypair,
  PublicKey,
  VersionedTransaction
} from "@solana/web3.js";
import { searcherClient } from "jito-ts/dist/sdk/block-engine/searcher";
import { EnvironmentManager, SPL_ERROR } from "./global";
import { Bundle } from "jito-ts/dist/sdk/block-engine/types";
import * as utils from "./utility";

export const createAndSendBundle = async (
  connection: Connection,
  bundleTip: number,
  transactions: VersionedTransaction[],
  payer: Keypair
): Promise<SPL_ERROR> => {
  const searcher = searcherClient(
    EnvironmentManager.getJitoBlockEngine(),
    EnvironmentManager.getJitoKeypair()
  );

  const _tipAccount = (await searcher.getTipAccounts())[0];
  const tipAccount = new PublicKey(_tipAccount);
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  let bundleTx = new Bundle(transactions, 5);
  bundleTx.addTipTx(payer, bundleTip, tipAccount, recentBlockhash);

  try {
    const bundleUUID = await searcher.sendBundle(bundleTx);
    let checked = false;
    let success = false;

    searcher.onBundleResult(
      (bundleResult) => {
        if (bundleResult.bundleId === bundleUUID) {
          if (bundleResult.accepted) {
            console.log(
              `Bundle ${bundleResult.bundleId} accepted in slot ${bundleResult.accepted.slot}`
            );
          }

          if (bundleResult.rejected) {
            console.log(
              bundleResult.rejected,
              `Bundle ${bundleResult.bundleId} rejected:`
            );

            checked = true;
            success = false;
          }

          if (bundleResult.processed) {
            console.log(`Bundle ${bundleResult.bundleId} processed`);
            checked = true;
            success = true;
          }
        }
      },
      (error) => {
        console.error("Bundle Error: ", error);
        success = false;
        checked = true;
      }
    );

    while (!checked) {
      await utils.sleep(1000);
    }

    if (success) return SPL_ERROR.E_OK;
    else return SPL_ERROR.E_FAIL;
  } catch (error) {
    console.error("Bundle Error: ", error);
    return SPL_ERROR.E_FAIL;
  }
};
