export type TAidropInfo = {
	amountLocked: string
	amountUnlocked: string
	amountClaimed?: string
	claimableValue?: string
	address: string
	distributorAddress: string
	mint: string
}

export type TDistributorData = {
	address: string
	chain: string
	isActive: boolean
	isAligned: boolean
	isOnChain: boolean
	isVerified: boolean
	maxNumNodes: string
	maxTotalClaim: string
	merkleRoot: number[]
	mint: string
	name: string
	sender: string
	totalAmountLocked: string
	totalAmountUnlocked: string
	version: number
}

export type TAirdropData = TDistributorData & {
	baseInfo: TAidropInfo
}

export type TClaimantData = {
	address: string
	amountClaimed: string
	amountLocked: string
	amountUnlocked: string
	distributorAddress: string
}

export type SPLTokenData = {
	program: string
	parsed: {
		info: {
			decimals: number
		}
		type: string
	}
}
