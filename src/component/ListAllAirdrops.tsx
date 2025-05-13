import { useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import type { TDistributorData } from '../types/Airdrops'

const ListAllAidrops = () => {
	const { publicKey } = useWallet()

	const [isLoading, setIsLoading] = useState(false)
	const [distributors, setDistributors] = useState<TDistributorData[]>([])

	return (
		<div>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{distributors.map((distributor, index) => (
						<li key={index}>Claimable Value: {distributor.address}</li>
					))}
					{distributors.length === 0 && !isLoading && <p>No airdrops found.</p>}
				</ul>
			)}
		</div>
	)
}

export default ListAllAidrops
