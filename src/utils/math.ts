import { BigNumber } from "ethers"

/**
 * num + (num * increase(%))
 */
export const percentIncrease = (num: BigNumber, increase: BigNumber) : BigNumber => {
    return num.add(num.mul(increase).div(100))
  }