import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { WagmiConfig, configureChains, createClient, goerli, useNetwork } from 'wagmi';
import { hardhat, localhost, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import Election from '../pages/Election';

import Header from './layout/Header';
import Footer from './layout/Footer';
import Home from '../pages/Home';
import Transfer from '../pages/Transfer';
import Claim from '../pages/Claim';
import { getNetworkByChainId } from '../utils/index';

function App() {
  const { provider } = configureChains([sepolia, goerli, hardhat, localhost], [publicProvider()]);

  const client = createClient({
    provider,
    autoConnect: true,
  });

  const { chain } = useNetwork();
  const sourceChain = getNetworkByChainId(chain?.id);

  return (
    <BrowserRouter>
      <WagmiConfig client={client}>
        <div className="wrapper">
          <Header chain={chain} />
          <div className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/election" element={<Election />} />
              <Route path="/transfer" element={<Transfer sourceChain={sourceChain} />} />
              <Route path="/claim" element={<Claim sourceChain={sourceChain} />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </WagmiConfig>
    </BrowserRouter>
  );
}

export default App;
