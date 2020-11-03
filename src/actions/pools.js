import {
	DEPOSIT_POOLS,
	POOLS,
	ZERO,
	DAI_TOKEN_ADDR,
	ADDR_CORE
} from "../helpers/constants"
import {
	onLoyaltyPoolDeposit,
	onLoyaltyPoolWithdraw
} from "./loyaltyPoolActions"
import { claimRewards } from "./actions"
import { fetchJSON } from "../helpers/fetch"
import { formatDAI } from "../helpers/formatting"
import ERC20ABI from "../abi/ERC20"
import { Contract } from "ethers"
import { defaultProvider } from "../ethereum"

const MARKET_URL = "https://market.adex.network"
const TOM_URL = "https://tom.adex.network"
const DaiToken = new Contract(DAI_TOKEN_ADDR, ERC20ABI, defaultProvider)

export const getDepositPool = poolId => DEPOSIT_POOLS.find(x => x.id === poolId)

export const getDepositActionByPoolId = poolId => {
	if (poolId === DEPOSIT_POOLS[0].id) {
		return onLoyaltyPoolDeposit
	}
}

export const getWithdrawActionByPoolId = poolId => {
	if (poolId === DEPOSIT_POOLS[0].id) {
		return onLoyaltyPoolWithdraw
	}
	if (poolId === POOLS[0].id) {
		return claimRewards
	}
}

export const getPoolStatsByPoolId = (stats, poolId) => {
	if (poolId === DEPOSIT_POOLS[0].id) {
		return stats.loyaltyPoolStats
	}
	if (poolId === POOLS[0].id) {
		return stats.tomPoolStats
	}
}

export const getWithdrawActionBySelectedRewardChannels = (
	rewards,
	chosenWalletType,
	stats
) => {
	const actions = Object.entries(
		rewards.reduce((byPool, r) => {
			const { poolId } = r
			byPool[poolId] = [...(byPool[poolId] || []), r]
			return byPool
		}, {})
	).map(([poolId, rwds]) => {
		if (poolId === DEPOSIT_POOLS[0].id) {
			return onLoyaltyPoolWithdraw.bind(
				null,
				stats,
				chosenWalletType,
				rwds[0].outstandingReward
			)
		}
		if (poolId === POOLS[0].id) {
			const rewardChannels = rwds.map(r => r.rewardChannel)
			return claimRewards.bind(null, chosenWalletType, rewardChannels)
		}
		return () => {}
	})

	return actions
}

const sumValidatorAnalyticsResValue = res =>
	Object.values(res.aggr || {}).reduce((a, b) => a.add(b.value), ZERO)

const toChartData = (data, valueLabel, currency) => {
	return (data.aggr || []).reduce(
		(data, { time, value }) => {
			data.labels.push(new Date(time).toLocaleString())
			data.datasets.push(parseFloat(currency ? formatDAI(value) : value))

			return data
		},
		{ labels: [], datasets: [], valueLabel, currency }
	)
}

export const getValidatorTomStats = async () => {
	const channels = await fetchJSON(MARKET_URL + "/campaigns?all")
	const {
		totalDeposits,
		totalPayouts,
		uniqueUnits,
		uniquePublishers,
		uniqueAdvertisers
	} = channels.reduce(
		(data, { creator, depositAmount, status, spec }) => {
			data.totalDeposits = data.totalDeposits.add(depositAmount)
			data.totalPayouts = data.totalPayouts.add(
				Object.values(status.lastApprovedBalances || {}).reduce(
					(a, b) => a.add(b),
					ZERO
				)
			)

			spec.adUnits.forEach(({ ipfs }) => {
				data.uniqueUnits[ipfs] = true
			})
			Object.keys(status.lastApprovedBalances).forEach(key => {
				if (key !== creator) {
					data.uniquePublishers[key.toLowerCase()] = true
				}
			})

			data.uniqueAdvertisers[creator.toLowerCase()] = true

			return data
		},
		{
			totalDeposits: ZERO,
			totalPayouts: ZERO,
			uniqueUnits: {},
			uniquePublishers: {},
			uniqueAdvertisers: {}
		}
	)

	const dailyPayoutsData = await fetchJSON(
		TOM_URL + "/analytics?metric=eventPayouts&timeframe=day"
	)
	const yearlyTransactionsData = await fetchJSON(
		TOM_URL + "/analytics?metric=eventCounts&timeframe=year"
	)
	const dailyTransactionsData = await fetchJSON(
		TOM_URL + "/analytics?metric=eventCounts&timeframe=day"
	)
	const monthlyTransactionsData = await fetchJSON(
		TOM_URL + "/analytics?metric=eventCounts&timeframe=month"
	)

	const lockupOnChain = await DaiToken.balanceOf(ADDR_CORE)

	return {
		totalCampaigns: channels.length,
		uniqueUnits: Object.keys(uniqueUnits).length,
		uniquePublishers: Object.keys(uniquePublishers).length,
		uniqueAdvertisers: Object.keys(uniqueAdvertisers).length,
		totalDeposits,
		totalPayouts,
		dailyPayoutsData: toChartData(dailyPayoutsData, "stats.labelPayout", "DAI"),
		dailyPayoutsVolume: sumValidatorAnalyticsResValue(dailyPayoutsData),
		yearlyTransactionsData: toChartData(
			yearlyTransactionsData,
			"stats.labelTransactions"
		),
		yearlyTransactions: sumValidatorAnalyticsResValue(yearlyTransactionsData),
		dailyTransactionsData: toChartData(
			dailyTransactionsData,
			"stats.labelTransactions"
		),
		dailyTransactions: sumValidatorAnalyticsResValue(dailyTransactionsData),
		monthlyTransactionsData: toChartData(
			monthlyTransactionsData,
			"stats.labelTransactions"
		),
		monthlyTransactions: sumValidatorAnalyticsResValue(monthlyTransactionsData),
		lockupOnChain
	}
}

export const getValidatorStatsByPoolId = poolId => {
	if (poolId === POOLS[0].id) {
		return getValidatorTomStats
	}

	return () => ({})
}
