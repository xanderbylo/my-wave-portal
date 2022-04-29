# :wave: WavePortal

[![Image of WavePortal ui](https://i.postimg.cc/NFz1LBNK/Screenshot-2022-04-30-at-00-01-45.png)](https://postimg.cc/4HpKSkRG)

![GitHub last commit](https://img.shields.io/github/last-commit/xanderbylo/my-wave-portal) 

 A Web3 app built with Solidity that lets users send a wave and records it on the blockchain through an Ethereum smart contract. Users have a 50% of receiving 0.0001 ETH every time they wave. A 15 minute timer is set between waves on the same address to prevent spamming.

 ## :computer: Live link

[my-wave-portal](https://waveportal.xanderbylo.repl.co/)

## :floppy_disk: Deploy contract locally

- Run `npx hardhat node` in terminal
- Run `npx hardhat run scripts/deploy.js --network localhost` to deploy contract to hardhat test network
- Connect MetaMask to local hardhat test network
- Update contract address inside `App.jsx`
- Update contract `abi` with the json located at `artifacts/contracts/WavePortal.sol/WavePortal.json`
- Run `npm start` inside `ui` folder

## :minidisc: Deploy contract to Rinkeby Ethereum Test Network

- Update `hardhat.config.js` with the Rinkeby url and Ethereum account
- Run `npx hardhat run scripts/deploy.js --network rinkeby` in terminal
- Select Rinkeby network in MetaMask
- Update contract address inside `App.jsx`
- Update contract `abi` with the json located at `artifacts/contracts/WavePortal.sol/WavePortal.json`
- Run `npm start` inside `ui` folder