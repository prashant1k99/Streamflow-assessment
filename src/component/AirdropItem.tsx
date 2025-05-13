import { useEffect, useState } from 'react'

import type { TAirdropData } from '../types/Airdrops'
import { Airdrop, fetchMintData } from '../utils/fetchAllAirdrops'
import Button from './ui/button'
import { useWallet } from '@solana/wallet-adapter-react'

const AirdropItemDetails = (data: TAirdropData) => {
	const { publicKey } = useWallet()

	const [tokenDecimal, setTokenDecimal] = useState<number | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isClaiming, setIsClaiming] = useState(false)

	const fetchTokenData = async () => {
		setIsLoading(true)
		try {
			const details = await fetchMintData(data.mint)
			if (details) {
				setTokenDecimal(details.parsed.info.decimals)
			}
		} catch (error) {
			console.error('Error fetching token data:', error)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		fetchTokenData()
	}, [])

	if (!publicKey) {
		return <div>Please connect your wallet</div>
	}

	if (isLoading) {
		return <div>Loading...</div>
	}

	const parseAmount = (amount: string) => {
		const parsedAmount = parseFloat(amount)
		if (isNaN(parsedAmount)) {
			return amount
		}
		if (tokenDecimal) {
			const decimalFactor = Math.pow(10, tokenDecimal)
			const adjustedAmount = parsedAmount / decimalFactor
			return adjustedAmount.toLocaleString('en-US', {
				minimumFractionDigits: 0,
				maximumFractionDigits: tokenDecimal,
			})
		}
		return parsedAmount.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		})
	}

	const claimToken = async () => {
		if (!tokenDecimal) return
		setIsClaiming(true)

		try {
			const airdropHandler = new Airdrop(publicKey.toString())
			await airdropHandler.claimAirdrop({
				distributorAddress: data.address,
				merkleProof: data.merkleRoot,
				amountUnlocked: parseFloat(data.baseInfo.amountUnlocked),
				amountLocked: parseFloat(data.baseInfo.amountLocked),
				decimals: tokenDecimal,
			})
			alert('Claim successful!')
		} catch (error) {
			console.error('Error claiming token:', error)
			alert('Claim failed!')
		} finally {
			setIsClaiming(false)
		}
	}

	return (
		<div>
			<div className="text-lg font-bold">Details</div>
			Type: {data.totalAmountUnlocked != '0' ? 'Instant' : 'Vested'} <br />
			Number of Recipients: {data.maxNumNodes} <br />
			Total Amount in Airdrop: {parseAmount(data.maxTotalClaim)} <br />
			Your Amount in Airdrop:
			{data.baseInfo.amountUnlocked != '0'
				? parseAmount(data.baseInfo.amountUnlocked)
				: parseAmount(data.baseInfo.amountLocked)}
			<br />
			Is Token Verified: {data.isVerified ? 'Yes' : 'No'} <br />
			<Button
				disabled={isClaiming}
				onClick={(e) => {
					e.stopPropagation()
					claimToken()
				}}>
				Claim
			</Button>
		</div>
	)
}

const AirdropItem = (data: TAirdropData) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const handleClick = async () => {
		if (isExpanded) {
			setIsExpanded(false)
			return
		}
		setIsExpanded(true)
	}

	return (
		<div
			role="button"
			onClick={handleClick}
			className="flex flex-col gap-2 border p-4 rounded-lg shadow-md w-full cursor-pointer">
			<div className="text-lg font-bold">{data.name}</div>
			<div className="text-sm text-gray-500">{data.address}</div>
			{isExpanded && <AirdropItemDetails {...data} />}
		</div>
	)
}

export default AirdropItem
