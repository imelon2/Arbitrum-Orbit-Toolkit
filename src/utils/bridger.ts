import { BigNumber } from "ethers"
import { defaultAbiCoder } from "ethers/lib/utils"

type IFeeTokenOutboundTransferData = {
  maxSubmissionCost:any,
  gasLimit:any,
  maxFeePerGas:any
}
/**
 * Get the `data` param for call to `outboundTransfer`
 */
export const getOutboundTransferData = (data:BigNumber|IFeeTokenOutboundTransferData) => { 
    if (BigNumber.isBigNumber(data)) {
            return defaultAbiCoder.encode(
          ['uint256', 'bytes'],
          [
            // maxSubmissionCost
            data,
            // callHookData
            '0x',
          ]
        )
    } else {
      return defaultAbiCoder.encode(
        ['uint256', 'bytes', 'uint256'],
        [
          // maxSubmissionCost
          data.maxSubmissionCost, // will be zero
          // callHookData
          '0x',
          // nativeTokenTotalFee
          data.gasLimit
            .mul(data.maxFeePerGas)
            .add(data.maxSubmissionCost), // will be zero
        ]
      )
    }

}