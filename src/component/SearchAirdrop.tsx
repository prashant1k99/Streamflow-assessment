import { useState } from 'react'
import Button from './ui/button'
import AirdropItem from './AirdropItem'
import { useWallet } from '@solana/wallet-adapter-react'
import type { TAirdropData } from '../types/Airdrops'
import { Airdrop } from '../utils/fetchAllAirdrops'

interface SearchAirdropsProps {
	updateSearch: (isSearching: boolean) => void
}

const SearchAirdrop = ({ updateSearch }: SearchAirdropsProps) => {
	const { publicKey } = useWallet()

	const [address, setAddress] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState<TAirdropData | null>(null)
	const formSubmit = async () => {
		if (address == '') {
			updateSearch(false)
			return
		}

		if (!publicKey) {
			alert('Please connect your wallet')
			return
		}
		setIsLoading(true)
		updateSearch(true)
		const airdropHandler = new Airdrop(publicKey.toString())
		try {
			const data = await airdropHandler.searchAirdrop(address)
			setData(data)
		} catch (error) {
			console.error('Error fetching distributors:', error)
		}
		setIsLoading(false)
	}
	return (
		<div className="p-4 w-[80%]">
			<form
				onSubmit={(e) => {
					e.preventDefault()
					formSubmit()
				}}
				className="flex text-center gap-2"
				aria-disabled={isLoading}>
				<input
					placeholder="Enter Airdop Id"
					className="border border-gray-400 rounded py-2 px-4 w-full"
					value={address}
					onChange={(e) => setAddress(e.target.value)}
				/>
				<Button disabled={isLoading} className="">
					Search
				</Button>
			</form>
			<hr className="my-4" />
			{isLoading ? <div>Loading...</div> : data && <AirdropItem {...data} />}
		</div>
	)
}

export default SearchAirdrop
