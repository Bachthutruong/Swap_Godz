import ReactDOM from 'react-dom/client'
import Widget from './components/Widget'
import './App.css'

import { init, useWallets, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import walletConnectModule from '@web3-onboard/walletconnect'

const injected = injectedModule()

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://ethereum.kyberengineering.io',
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Polygon',
      rpcUrl: 'https://polygon.kyberengineering.io',
    },
    {
      id: '0xc7',
      token: 'BTT',
      label: 'BTTC',
      rpcUrl: 'https://bttc.kyberengineering.io',
    },
    {
      id: '0x38',
      token: 'BNB',
      label: 'Binance Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org/',
    },
  ],
})

const App = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  // create an ethers provider
  let ethersProvider: any

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
  }
  const connectedWallets = useWallets()
  const [chainId, setChainId] = useState(1)

  useEffect(() => {
    ethersProvider?.getNetwork().then((res: any) => setChainId(res.chainId))
  }, [ethersProvider])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label)
    window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWalletsLabelArray))
  }, [connectedWallets, wallet])
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets') || '[]')

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: previouslyConnectedWallets[0],
        })
      }
      setWalletFromLocalStorage()
    }
  }, [connect])

  const defaultTokenOut: { [chainId: number]: string } = {
    1: '0x1068a889fd7151fb2ca9d98d268b0d0cd623fc2f',
    137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    56: '0xda4714fee90ad7de50bc185ccd06b175d23906c1',
    43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    250: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
    25: '0x66e428c3f67a68878562e79A0234c1F83c208770',
    42161: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    199: '0x9B5F27f6ea9bBD753ce3793a07CbA3C74644330d',
    106: '0x01445C31581c354b7338AC35693AB2001B50b9aE',
    1313161554: '0x4988a896b1227218e4a686fde5eabdcabd91571f',
    42262: '0x6Cb9750a92643382e020eA9a170AbB83Df05F30B',
    10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    59144: '0xa219439258ca9da29e9cc4ce5596924745e12b93',
    1101: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
    324: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
    8453: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    109: '0xda4714fee90ad7de50bc185ccd06b175d23906c1',
  }

  // feeSetting={{
  // feeAmount: 500,
  // isInBps: true,
  // chargeFeeBy: "currency_in",
  // feeReceiver: "0xDcFCD5dD752492b95ac8C1964C83F992e7e39FA9",
  // }}

  return (
    <div className="App">
      <Widget
        client="viet-nv"
        tokenList={[]}
        provider={ethersProvider}
        defaultTokenOut={defaultTokenOut[chainId]}
        defaultSlippage={100}
        title={
          <div className="card">
            <h3 className="swap">Swap</h3>
            <button onClick={() => (wallet ? disconnect(wallet) : connect())} className="button">
              {!wallet ? 'Connect Wallet' : 'Disconnect'}
            </button>
          </div>
        }
        enableRoute
        theme={{
          primary: '#1C1C1C',
          secondary: '#0F0F0F',
          text: '#FFFFFF',
          subText: '#A9A9A9',
          interactive: '#292929',
          dialog: '#313131',
          stroke: '#505050',
          accent: '#28E0B9',

          success: '#189470',
          warning: '#FF9901',
          error: '#F84242',
          fontFamily: 'Work Sans',
          borderRadius: '10px',
          buttonRadius: '10px',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.04)',
        }}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
