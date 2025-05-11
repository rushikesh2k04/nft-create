// src/components/Home.tsx
import * as algokit from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useEffect, useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import MethodCall from './components/MethodCall'
import * as methods from './methods'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'
import NFTForm from './components/NFTForm'

import './styles/Home.css'

const Home: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const { activeAddress, transactionSigner: TransactionSigner } = useWallet()

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)

  const [assetId, setAssetId] = useState<bigint>(0n)
  const [unitaryPrice, setUnitaryPrice] = useState<bigint>(0n)
  const [assetname, setassetname] = useState<string>("")
  const [int_quantity, setInt_quanity] = useState<bigint>(0n)
  const [int_decimals, setInt_decimals] = useState<number>(0)
  const [ipfsCID, setIpfsCID] = useState<string>("")

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = algokit.AlgorandClient.fromConfig({ algodConfig })

  useEffect(() => {
    if (TransactionSigner) algorand.setDefaultSigner(TransactionSigner)
  }, [TransactionSigner])

  return (
    <div className="home-container">
      <div className="form-card">
        <h1>Welcome to <span className="bold">AlgoKit 🙂</span></h1>
        <p className="subtitle">Digital Market - Sell your asset at</p>

        <button className="wallet-btn" onClick={toggleWalletModal}>
          Wallet Connection
        </button>

        <label>Unitary Price (ALGO)</label>
        <input
          type="number"
          value={(unitaryPrice / 1_000_000n).toString()}
          onChange={(e) =>
            setUnitaryPrice(BigInt(e.currentTarget.valueAsNumber || 0) * 1_000_000n)
          }
        />

        <label>Asset Name</label>
        <input
          type="text"
          value={assetname}
          onChange={(e) => setassetname(e.currentTarget.value || "")}
        />

        <label>Asset Quantity</label>
        <input
          type="number"
          value={int_quantity.toString()}
          onChange={(e) =>
            setInt_quanity(BigInt(e.currentTarget.valueAsNumber || 0))
          }
        />

        <label>Decimals</label>
        <input
          type="number"
          value={int_decimals.toString()}
          onChange={(e) =>
            setInt_decimals(Number(e.currentTarget.valueAsNumber || 0))
          }
        />

        <h2>Upload NFT Metadata</h2>
        <NFTForm onUploadComplete={(cid) => setIpfsCID(cid)} />

        <MethodCall
          methodFunction={async () => {
            if (!ipfsCID) {
              alert("Upload metadata to IPFS first.");
              return;
            }
            const assetUrl = `https://ipfs.io/ipfs/${ipfsCID}#arc3`;
            const newAssetId = await methods.create(
              algorand,
              activeAddress!,
              int_quantity,
              int_decimals,
              assetname,
              assetUrl
            );
            setAssetId(newAssetId);
          }}
          text="Create Application"
        />

        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      </div>
    </div>
  )
}

export default Home;
