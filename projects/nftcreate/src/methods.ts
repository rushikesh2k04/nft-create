// src/components/methods.ts
import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk, { TransactionSigner } from 'algosdk'

export async function create(
  algodClient: algokit.AlgorandClient,
  sender: string,
  quantity: bigint,
  dec: number,
  assetname: string,
  url: string,
): Promise<bigint> {
  const assetCreate = await algodClient.send.assetCreate({
    sender,
    total: quantity,
    decimals: dec,
    assetName: assetname,
    unitName: assetname.substring(0, 3),
    url: url,
  })

  const assetId = BigInt(assetCreate.confirmation.assetIndex!)
  console.log("Asset created with ID:", assetId)
  return assetId
}

export async function optInToAsset(
  algorand: algokit.AlgorandClient,
  assetId: bigint,
  receiver: string,
  signer: algosdk.TransactionSigner
) {
  const suggestedParams = await algorand.getSuggestedParams();

  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender: receiver,
    receiver: receiver,
    assetIndex: Number(assetId),
    amount: 0,
    suggestedParams,
  });

  const atc = new algosdk.AtomicTransactionComposer();
  atc.addTransaction({ txn, signer });

  // Use the algod client directly
  const algodClient = algorand.client.algod;
  await atc.execute(algodClient, 2);
}


/**
 * Transfers a given amount of ASA from sender to receiver.
 */
export async function transferAsset(
  algodClient: algokit.AlgorandClient,
  assetId: bigint,
  sender: string,
  receiver: string,
  amount: bigint,
): Promise<void> {


  await algodClient.send.assetTransfer({
    sender,
    assetId,
    amount,
    receiver,
  })

  console.log(`✅ Transferred ${amount} of asset ${assetId} from ${sender} to ${receiver}`)
}
