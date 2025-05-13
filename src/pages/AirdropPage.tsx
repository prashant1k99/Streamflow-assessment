import { useState } from 'react'
import ListAllAidrops from '../component/ListAllAirdrops'
import SearchAirdrop from '../component/SearchAirdrop'

const AirdropPage = () => {
	const [isSearching, setIsSearching] = useState(false)

	return (
		<div className="h-full w-full flex flex-col items-center border-2 border-gray-300 bg-gray-200 rounded">
			<SearchAirdrop updateSearch={(val) => setIsSearching(val)} />
			{!isSearching && <ListAllAidrops />}
		</div>
	)
}

export default AirdropPage
