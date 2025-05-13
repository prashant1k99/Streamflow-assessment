import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from '@solana/wallet-adapter-base';
import Button from "./ui/button";

const WalletConnector = () => {
  const { connected, wallets, publicKey, select, disconnect } = useWallet();

  if (connected) {
    if (!publicKey) {
      return (
        <div>Something went wrong</div>
      )
    }
    return (
      <button onClick={disconnect} className="select-none p-2 flex bg-blue-500 py-2 px-4 text-gray-100 rounded cursor-pointer gap-2">
        <img className='h-6 w-6' src={wallets[0].adapter.icon} />
        {publicKey.toString().slice(0, 6)}...
        {publicKey.toString().slice(-6)}
      </button>
    )
  }

  if ([
    WalletReadyState.NotDetected,
    WalletReadyState.Unsupported
  ].includes(wallets[0].adapter.readyState)) {
    <div>We only support Phantom Wallet</div>
  }

  return (
    <Button
      onClick={() => select(wallets[0].adapter.name)}
    >
      <img className='h-6 w-6' src={wallets[0].adapter.icon} />
      Connect Wallet

    </Button>
  )
}
export default WalletConnector
