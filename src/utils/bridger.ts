import { BigNumber } from "ethers"
import { defaultAbiCoder } from "ethers/lib/utils"

/**
 * Get the `data` param for call to `outboundTransfer`
 */
export const getOutboundTransferData = (maxSubmissionCost:BigNumber) => {
    return defaultAbiCoder.encode(
        ['uint256', 'bytes'],
        [
          // maxSubmissionCost
          maxSubmissionCost,
          // callHookData
          '0x',
        ]
      )
}