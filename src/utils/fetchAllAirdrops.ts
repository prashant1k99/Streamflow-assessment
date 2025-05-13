import axios, { type AxiosRequestConfig } from 'axios'
import type {
	TAidropInfo,
	TClaimantData,
	TDistributorData,
} from '../types/Airdrops'
import { PublicKey } from '@solana/web3.js'

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

	airdrops = async () => {
		try {
			const allAirdrops = await this.getAllAirdropInfo()
			const distributors = allAirdrops.map(
				(airdrop) => airdrop.distributorAddress
			)
			const coreData = await this.getDistributorsData(distributors)
			return coreData
		} catch (error) {
			console.error('Error: ', error)
			throw error
		}
	}

	airdropClaimantInfo = async (distributorAddress: string) => {
		const options: AxiosRequestConfig = {
			method: 'GET',
			url: `https://staging-api-public.streamflow.finance/v2/api/airdrops/${distributorAddress}/claimants/${this.publicKey}`,
		}

		try {
			const { data } = await axios.request<TClaimantData>(options)
			return data
		} catch (error) {
			console.error('Error: ', error)
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

export default Airdrop
