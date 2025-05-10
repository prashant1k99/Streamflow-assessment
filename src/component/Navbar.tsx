import WalletConnector from "./WalletConnector"

const NavBar = () => {
  return (
    <nav className="flex justify-between w-[800px] mx-auto py-4">
      <div className="font-bold">
        StreamFlow Assessment
      </div>
      <WalletConnector />
    </nav>
  )
}
export default NavBar
