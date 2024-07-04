import { BigNumber } from "ethers";

/**
 * @example l2 max_fee_per_gas + (max_fee_per_gas * DEFAULT_GAS_PRICE_PERCENT_INCREASE %)
 */
export const DEFAULT_GAS_PRICE_PERCENT_INCREASE = BigNumber.from(500)

export const DEFAULT_SUBMISSION_FEE_PERCENT_INCREASE = BigNumber.from(300)

/**
 * The offset added to an L1 address to get the corresponding L2 address
 */
export const ADDRESS_ALIAS_OFFSET = '0x1111000000000000000000000000000000001111'