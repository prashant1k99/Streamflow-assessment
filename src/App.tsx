import { useWallet } from "@solana/wallet-adapter-react";
import NavBar from "./component/Navbar.tsx"
import NotConnected from "./pages/NotConnected.tsx"

function App() {
  const { connected, publicKey } = useWallet();
  console.log("publicKey: ", publicKey)
  return (
    <div className='w-dvw h-dvh flex flex-col'>
      <NavBar />
      <div className="h-full w-[800px] m-auto">
        {
          (!connected || !publicKey) ? (
            <NotConnected />
          ) : (
            <div>Wallet Connected</div>
          )
        }
      </div>
    </div>
  )
}

export default App
