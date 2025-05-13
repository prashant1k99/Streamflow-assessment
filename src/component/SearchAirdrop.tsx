import { useState } from 'react'
import Button from './ui/button'

interface SearchAirdropsProps {
	updateSearch: (isSearching: boolean) => void
}

const SearchAirdrop = ({ updateSearch }: SearchAirdropsProps) => {
	const [address, setAddress] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState<[]>([])
	const formSubmit = () => {
		if (address == '') return

		setData([])
		updateSearch(true)
		setIsLoading(true)
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
			{isLoading ? (
				<div>Loading...</div>
			) : data ? (
				<div>
					<ul>
						{data.map((rec) => (
							<li key={rec}>
								<div>Name: {rec}</div>
								<div></div>
								<div>Unlocked Amount: {rec}</div>
								<div>Locked Amount: {rec}</div>
							</li>
						))}
					</ul>
				</div>
			) : (
				<div>No record found</div>
			)}
		</div>
	)
}

export default SearchAirdrop
