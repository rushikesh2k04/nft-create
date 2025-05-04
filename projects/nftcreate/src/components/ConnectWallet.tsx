import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import Account from './Account'
import '../styles/connectWallet.css' // Import the CSS

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <dialog
      id="connect_wallet_modal"
      className={`modal ${openModal ? 'modal-open' : ''}`}
      style={{ display: openModal ? 'flex' : 'none' }}
    >
      <form method="dialog" className="modal-box">
        <h3 className="modal-title">Select wallet provider</h3>

        <div className="wallet-list">
          {activeAddress && (
            <>
              <Account />
              <div className="divider" />
            </>
          )}

          {!activeAddress &&
            wallets?.map((wallet) => (
              <button
                data-test-id={`${wallet.id}-connect`}
                className="wallet-button"
                key={`provider-${wallet.id}`}
                onClick={() => wallet.connect()}
              >
                {!isKmd(wallet) && (
                  <img
                    alt={`wallet_icon_${wallet.id}`}
                    src={wallet.metadata.icon}
                  />
                )}
                <span>{isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}</span>
              </button>
            ))}
        </div>

        <div className="modal-action">
          <button
            data-test-id="close-wallet-modal"
            className="btn btn-close"
            onClick={closeModal}
          >
            Close
          </button>

          {activeAddress && (
            <button
              className="btn btn-logout"
              data-test-id="logout"
              onClick={async () => {
                const activeWallet = wallets.find((w) => w.isActive)
                if (activeWallet) {
                  await activeWallet.disconnect()
                } else {
                  localStorage.removeItem('@txnlab/use-wallet:v3')
                  window.location.reload()
                }
              }}
            >
              Logout
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}

export default ConnectWallet
