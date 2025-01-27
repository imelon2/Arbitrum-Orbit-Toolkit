# Ethereum & Arbitrum & Orbit Integration CLI Toolkit
본 Repo는 개발자들이 Ethereum(Layer1) & Arbitrum(Layer2) & Orbit(Layer3) 솔루션을 원활하게 통합할 수 있도록 설계된 CLI 명령어와 라이브러리, 그리고 On-Chain 데이터를 파싱해주는 Debug 기능을 제공합니다.

This repository provides developers with powerful tools and libraries designed to seamlessly integrate Ethereum's Layer 1, Arbitrum's Layer 2, and Orbit's Layer 3 solutions.


## Start
1. From root directory:
    ``` bash
    npm i
    ```
2. Follow the `.env.example` to create `.env`, then add `Provider URL` and the `signer's private key` want to use.
    ``` bash
    # .env
    L2_URL=
    L1_URL=
    L3_URL=

    L1_WS_URL=
    L2_WS_URL=
    L3_WS_URL=

    SIGNER_PK_KEY=
    ```


## Native bridge CLI
### Deposit
```bash
# For chains with "ether" network fees
npm run bridge native-bridge depositEth[d-eth] -- --amount[a] 

# For chains with "fee token" network fees
npm run bridge native-bridge depositOrbit[d-orbit] -- --amount[a] 
```

### Withdraw
```bash
npm run bridge native-bridge withdraw[w] -- --amount[a] 
npm run bridge native-bridge getProof -- --withdrawL2Hash[l2hash]
npm run bridge native-bridge claimWithdraw -- --withdrawL2Hash[l2hash]
```

## ERC20 bridge CLI
### Deposit
```bash
npm run bridge erc20-bridge depositERC20[d-erc20] -- --amount[a] --ca [default:erc20]
```

### Withdraw
```bash
npm run bridge erc20-bridge withdraw[w] -- --amount[a] --ca [default:erc20]
npm run bridge erc20-bridge getProof -- --withdrawL2Hash[l2hash] --ca [default:erc20]
npm run bridge erc20-bridge claimWithdraw -- --withdrawL2Hash[l2hash] --ca [default:erc20]
```

## Network Config CLI
### Config
```bash
npm run config rollup getlatestConfirmedNodeNum --layer [l1 | l2][default:l1]
npm run config rollup getNode -- --number[num] --layer [l1 | l2][default:l1]
npm run config rollup getSystemContracts -- --layer [l1 | l2][default:l1]
npm run config bridge getSystemContracts -- --layer [l1 | l2][default:l1]
npm run config inbox getSystemContracts -- --layer [l1 | l2][default:l1]
npm run config outbox getSystemContracts -- --layer [l1 | l2][default:l1]
npm run config sequencerInbox getSystemContracts -- --layer [l1 | l2][default:l1]
```

## Utils CLI
### Native
```bash
npm run utils native getBalance -- --addr[default] --layer [l1 | l2 | l3][default:l1]
npm run utils native transfer -- --to --amount[--a] --layer [l1 | l2 | l3][default:l1]
```
> If `--addr` is omitted, default wallet address in *.env.SIGNER_PK_KEY*<br/>
> If `--layer` is omitted, default "l1"

### ERC20
```bash
npm run utils erc20 getBalance -- --addr[default] --ca [default:erc20] --layer [l1 | l2 | l3][default:l1]
npm run utils erc20 approve -- --spender --amount[a] --ca [default:erc20] --layer [l1 | l2 | l3][default:l1]
npm run utils erc20 transfer  -- --to --amount[a] --ca [default:erc20] --layer [l1 | l2 | l3][default:l1]
npm run utils erc20 metadata -- --addr[default] --ca [default:erc20] --layer [l1 | l2 | l3][default:l1]
```
> If `--addr` is omitted, default wallet address in *.env.SIGNER_PK_KEY*<br/>
> If `--layer` is omitted, default "l1"<br/>
> If `--ca` is omitted, default "erc20".<br/>
> can set ERC20 Contract address by replacing `--ca`.

## Bebug CLI
```bash
npm run debug parseCalldata -- --txHash --layer [l1 | l2 | l3]
npm run debug parseLogEvent -- --txHash --layer [l1 | l2 | l3]
npm run debug parseRevert -- --txHash --layer [l1 | l2 | l3]
```
> If `--layer` is omitted, default "l1"

## Monitoring CLI
```bash
npm run monitor contracts --  --name [contract-name] --layer [l1 | l2 | l3]
```
> **contract-name**은 `./rollup-contract-address.json`에 정의된 기준으로 적용됩니다.</br>
> [current release] : `inbox`, `outbox`, `rollup`,`sequencerInbox`,`feeToken`


# Options
1. If want to add **ABIs** from other contracts, put them in `./artifacts`.
2. If you want to apply a different chain's System Contract address, please add the chain ID and address to `./rollup-contract-address.json`.


# Version
1. @arbitrum/nitro-contracts - ^1.2.1
2. @arbitrum/token-bridge-contracts - ^1.2.1
3. @openzeppelin/contracts - ^4.9.5


# TODO
- npm run arb ArbOwner setMinimumL2BaseFee --priceInWei=1000000000
- 현재는 Layer3 기능을 지원하지 않습니다.
- Transaction 별 GasLimit 설정