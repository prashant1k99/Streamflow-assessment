import axios, { type AxiosRequestConfig } from 'axios'
import type {
	SPLTokenData,
	TAidropInfo,
	TAirdropData,
	TDistributorData,
} from '../types/Airdrops'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { SolanaDistributorClient } from '@streamflow/distributor/solana'
import { getBN, ICluster } from '@streamflow/common'

class Airdrop {
	private publicKey: string
	constructor(publicKey: string) {
		this.publicKey = publicKey
	}

	private async getAllAirdropInfo() {
		const { data } = await axios.get<{
			items: TAidropInfo[]
			limit: number
			offset: number
		}>(
			`https://staging-api.streamflow.finance/v2/api/airdrops/claimable/${this.publicKey}/?limit=100&skimZeroValued=false&chain=SOLANA`
		)
		return data.items
	}

	private validatePublicKey(key: string) {
		try {
			new PublicKey(key)
			return true
		} catch {
			//
		}
		return false
	}

	private async getDistributorsData(distributors: string[]) {
		const options: AxiosRequestConfig = {
			method: 'GET',
			url: 'https://staging-api-public.streamflow.finance/v2/api/airdrops/',
			params: {
				addresses: distributors.join(','),
			},
		}

		const { data } = await axios.request<TDistributorData[]>(options)
		return data
	}

	private async getDistributorData(distributorAddress: string) {
		const options: AxiosRequestConfig = {
			method: 'GET',
			url: `https://staging-api-public.streamflow.finance/v2/api/airdrops/${distributorAddress}`,
		}

		const { data } = await axios.request<TDistributorData>(options)
		return data
	}

	private async searchDistributor(distributorAddress: string) {
		console.log(distributorAddress)
	}

	airdrops = async (): Promise<TAirdropData[]> => {
		try {
			const allAirdrops = await this.getAllAirdropInfo()
			const distributors = allAirdrops.map(
				(airdrop) => airdrop.distributorAddress
			)
			const coreData = await this.getDistributorsData(distributors)
			const finalResult = coreData.map((distributor) => {
				const airdrop = allAirdrops.find(
					(airdrop) => airdrop.distributorAddress === distributor.address
				)
				return {
					...distributor,
					baseInfo: airdrop as TAidropInfo,
				} as TDistributorData
			}) as TAirdropData[]

			return finalResult
		} catch (error) {
			console.error('Error: ', error)
			throw error
		}
	}

	claimAirdrop = async ({
		distributorAddress,
		merkleProof,
		amountUnlocked,
		amountLocked,
		decimals,
	}: {
		distributorAddress: string
		merkleProof: number[]
		amountUnlocked: number
		amountLocked: number
		decimals: number
	}) => {
		const validatePublicKey = this.validatePublicKey(distributorAddress)
		if (!validatePublicKey) {
			throw new Error('Invalid distributorAddress')
		}
		try {
			const client = new SolanaDistributorClient({
				clusterUrl: clusterApiUrl('devnet'),
				cluster: ICluster.Devnet,
			})

			const solanaParams = {
				invoker: this.publicKey,
			}

			await client.claim(
				{
					id: distributorAddress, // address of the Distributor Account
					// Documentation Not clear about this
					proof: merkleProof,
					amountUnlocked: getBN(amountUnlocked, decimals), // Total amount unlocked for a Recipient
					amountLocked: getBN(amountLocked, decimals), // Total amount locked for a Recipient
				},
				solanaParams
			)
		} catch (error) {
			console.error('Error claiming airdrop:', error)
			throw error
		}
	}

	// searchAirdrop = async (airdropId: string) => {
	// 	const validatePublicKey = this.validatePublicKey(airdropId)
	// 	if (!validatePublicKey) {
	// 		throw new Error('Invalid distributorAddress')
	// 	}

	// 	try {
	// 		const [aidropClaimantInfo] = await Promise.all([
	// 			this.airdropClaimantInfo(airdropId),
	// 			this.getDistributorData(airdropId),
	// 		])
	// 	} catch (error) {}
	// }
}

const mintMap = new Map<string, SPLTokenData>()

const fetchMintData = async (mintAddress: string) => {
	if (!mintMap.has(mintAddress)) {
		try {
			const connection = new Connection(clusterApiUrl('devnet'))
			const mintPublicKey = new PublicKey(mintAddress)
			const mintAccountInfo = await connection.getParsedAccountInfo(
				mintPublicKey
			)

			if (mintAccountInfo.value) {
				mintMap.set(mintAddress, mintAccountInfo.value.data as SPLTokenData)
			} else {
				throw new Error('Mint account not found')
			}
		} catch (error) {
			console.error('Error fetching mint data:', error)
			throw error
		}
	}
	return mintMap.get(mintAddress)
}

export { Airdrop, fetchMintData }
