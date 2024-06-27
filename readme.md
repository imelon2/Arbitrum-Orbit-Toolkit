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

    SIGNER_PK_KEY=
    ```

## Rollup CLI
### Config
```bash
npm run rollup config getlatestConfirmedNodeNum
```

## native bridge CLI
### Deposit
```bash
# For chains with "ether" network fees
npm run bridge native-bridge depositEth[d-eth] -- --amount[--a] 

# For chains with "fee token" network fees
npm run bridge native-bridge depositERC20[d-erc20] -- --amount[--a] 
```

### Withdraw
```bash
npm run bridge native-bridge withdraw[w] -- --amount[--a] 
npm run bridge native-bridge getProof -- --withdrawL2Hash[--l2hash]
npm run bridge native-bridge claimWithdraw -- --withdrawL2Hash[--l2hash]
```

## Utils CLI
### Native
```bash
npm run utils native getBalance -- --addr[default] --layer [l1 | l2 | l3][default]
```
> If `--addr` is omitted, default wallet address in *.env.SIGNER_PK_KEY*<br/>
> If `--layer` is omitted, default "l1"

### ERC20
```bash
npm run utils erc20 getBalance -- --addr[default] --layer [l1 | l2 | l3][default]
npm run utils erc20 approve -- --spender --amount[--a] --layer [l1 | l2 | l3][default]
```
> If `--addr` is omitted, default wallet address in *.env.SIGNER_PK_KEY*<br/>
> If `--layer` is omitted, default "l1"

## Bebug CLI
```bash
npm run debug parseCalldata -- --txHash --layer [l1 | l2 | l3]
npm run debug parseLogEvent -- --txHash --layer [l1 | l2 | l3]
npm run debug parseRevert -- --txHash --layer [l1 | l2 | l3]
```
> If `--layer` is omitted, default "l1"


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