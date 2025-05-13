import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import type { TAirdropData } from '../types/Airdrops'
import { Airdrop } from '../utils/fetchAllAirdrops'
import AirdropItem from './AirdropItem'

const ListAllAidrops = () => {
	const { publicKey } = useWallet()

	const [isLoading, setIsLoading] = useState(false)
	const [distributors, setDistributors] = useState<TAirdropData[]>([])

	const fetchDistributors = async () => {
		if (!publicKey) return

		setIsLoading(true)
		try {
			const airdropHandler = new Airdrop(publicKey.toString())
			const data = await airdropHandler.airdrops()
			setDistributors(data)
		} catch (error) {
			console.error('Error fetching distributors:', error)
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		if (publicKey) {
			fetchDistributors()
		}
	}, [publicKey])

	return (
		<div className="p-4 w-[80%] h-full overflow-x-auto">
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{distributors.map((distributor, index) => (
						<li key={index} className="mb-4 w-full">
							<AirdropItem {...distributor} />
						</li>
					))}
					{distributors.length === 0 && !isLoading && <p>No airdrops found.</p>}
				</ul>
			)}
		</div>
	)
}

export default ListAllAidrops
