import { useWallet } from "@solana/wallet-adapter-react";
import NavBar from "./component/Navbar.tsx"
import NotConnected from "./pages/NotConnected.tsx"
import AirdropPage from "./pages/AirdropPage.tsx";

function App() {
  const { connected, publicKey } = useWallet();

  return (
    <div className='w-dvw h-dvh flex flex-col'>
      <NavBar />
      <div className="h-full w-[800px] m-auto">
        {
          (!connected || !publicKey) ? (
            <NotConnected />
          ) : (
            <AirdropPage />
          )
        }
      </div>
    </div>
  )
}

export default App
