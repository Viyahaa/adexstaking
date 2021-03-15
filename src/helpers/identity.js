import { generateAddress2 } from "ethereumjs-util"
import { utils } from "ethers"
import { Transaction } from "adex-protocol-eth/js"
import { ADDR_FACTORY, useTestnet } from "./constants"

function getBytecode(addr) {
	const addrHex = addr.slice(2).toLowerCase()
	// Do not change that bytecode! It comes from compiling this https://gist.github.com/Ivshti/e66cd57ade1abfb07c2517df9e73ceb9

	const bytecode = useTestnet
		? `0x608060405234801561001057600080fd5b5060026000803073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff160217905550600260008073${addrHex}73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff1602179055506101b7806100e46000396000f3fe608060405234801561001057600080fd5b506004361061002f5760003560e01c8063c066a5b11461007357610030565b5b60007396e3cb4b4632ed45363ff2c9f0fbec9b583d9d3a90503660008037600080366000846127105a03f43d6000803e806000811461006e573d6000f35b3d6000fd5b61008d600480360381019061008891906100d8565b6100a3565b60405161009a9190610110565b60405180910390f35b60006020528060005260406000206000915054906101000a900460ff1681565b6000813590506100d28161016a565b92915050565b6000602082840312156100ea57600080fd5b60006100f8848285016100c3565b91505092915050565b61010a8161015d565b82525050565b60006020820190506101256000830184610101565b92915050565b60006101368261013d565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600060ff82169050919050565b6101738161012b565b811461017e57600080fd5b5056fea264697066735822122019f5875efc4074eb90fc23ade40cf7e2dab386def2d35b85eb8873751ce883b764736f6c634300060c0033`
		: `0x608060405234801561001057600080fd5b5060026000803073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff160217905550600260008073${addrHex}73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908360ff1602179055506000734470bb87d77b963a013db939be332f927f2b992e9050600073ade00c28244d5ce17d72e40330b1c318cd12b7c3905060008273ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016101429190610501565b60206040518083038186803b15801561015a57600080fd5b505afa15801561016e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610192919061045a565b90506000811115610276578273ffffffffffffffffffffffffffffffffffffffff1663095ea7b383836040518363ffffffff1660e01b81526004016101d892919061051c565b600060405180830381600087803b1580156101f257600080fd5b505af1158015610206573d6000803e3d6000fd5b505050508173ffffffffffffffffffffffffffffffffffffffff166394b918de826040518263ffffffff1660e01b81526004016102439190610560565b600060405180830381600087803b15801561025d57600080fd5b505af1158015610271573d6000803e3d6000fd5b505050505b60008273ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016102b19190610501565b60206040518083038186803b1580156102c957600080fd5b505afa1580156102dd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610301919061045a565b9050600081111561043c576000734846c6837ec670bbd1f5b485471c8f64ecb9c53490508373ffffffffffffffffffffffffffffffffffffffff1663095ea7b382846040518363ffffffff1660e01b815260040161036092919061051c565b600060405180830381600087803b15801561037a57600080fd5b505af115801561038e573d6000803e3d6000fd5b505050508073ffffffffffffffffffffffffffffffffffffffff1663b4dca72460405180606001604052808581526020017f2ce0c96383fb229d9776f33846e983a956a7d95844fac57b180ed0071d93bb2860001b8152602001428152506040518263ffffffff1660e01b81526004016104089190610545565b600060405180830381600087803b15801561042257600080fd5b505af1158015610436573d6000803e3d6000fd5b50505050505b505050506105d8565b600081519050610454816105c1565b92915050565b60006020828403121561046c57600080fd5b600061047a84828501610445565b91505092915050565b61048c8161057b565b82525050565b61049b8161058d565b82525050565b6060820160008201516104b760008501826104e3565b5060208201516104ca6020850182610492565b5060408201516104dd60408501826104e3565b50505050565b6104ec816105b7565b82525050565b6104fb816105b7565b82525050565b60006020820190506105166000830184610483565b92915050565b60006040820190506105316000830185610483565b61053e60208301846104f2565b9392505050565b600060608201905061055a60008301846104a1565b92915050565b600060208201905061057560008301846104f2565b92915050565b600061058682610597565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6105ca816105b7565b81146105d557600080fd5b50565b6101b7806105e76000396000f3fe608060405234801561001057600080fd5b506004361061002f5760003560e01c8063c066a5b11461007357610030565b5b60007396e3cb4b4632ed45363ff2c9f0fbec9b583d9d3a90503660008037600080366000846127105a03f43d6000803e806000811461006e573d6000f35b3d6000fd5b61008d600480360381019061008891906100d8565b6100a3565b60405161009a9190610110565b60405180910390f35b60006020528060005260406000206000915054906101000a900460ff1681565b6000813590506100d28161016a565b92915050565b6000602082840312156100ea57600080fd5b60006100f8848285016100c3565b91505092915050565b61010a8161015d565b82525050565b60006020820190506101256000830184610101565b92915050565b60006101368261013d565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600060ff82169050919050565b6101738161012b565b811461017e57600080fd5b5056fea26469706673582212200e40aa3025d54e828fb973089b64ce06688fedcd71b98ae68521a0217652c59564736f6c634300060c0033`
	return bytecode
}

export function getUserIdentity(walletAddr) {
	const bytecode = getBytecode(walletAddr)
	const addr = utils.getAddress(
		`0x${generateAddress2(ADDR_FACTORY, Buffer.alloc(32), bytecode).toString(
			"hex"
		)}`
	)
	return { bytecode, addr }
}

export function rawZeroFeeTx(idAddr, nonce, to, data) {
	return {
		identityContract: idAddr,
		nonce: nonce.toString(),
		feeTokenAddr: "0x6b175474e89094c44da98b954eedeac495271d0f",
		feeAmount: 0,
		to,
		data
	}
}

export function zeroFeeTx(idAddr, nonce, to, data) {
	return new Transaction({
		identityContract: idAddr,
		nonce: nonce.toString(),
		feeTokenAddr: "0x6b175474e89094c44da98b954eedeac495271d0f",
		feeAmount: 0,
		to,
		data
	})
}
