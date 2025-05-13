import { useState } from 'react'
import ListAllAidrops from '../component/ListAllAirdrops'
import SearchAirdrop from '../component/SearchAirdrop'

const AirdropPage = () => {
	const [isSearching, setIsSearching] = useState(false)

	return (
		<div className="h-full w-full flex flex-col items-center border-2 border-gray-300 bg-gray-200 rounded">
			<SearchAirdrop updateSearch={(val) => setIsSearching(val)} />
			{isSearching ? (
				<div className="w-full flex justify-center">
					<div className="w-[80%]">
						<h1 className="text-2xl font-bold text-center">Search Airdrop</h1>
					</div>
				</div>
			) : (
				<ListAllAidrops />
			)}
		</div>
	)
}

export default AirdropPage
