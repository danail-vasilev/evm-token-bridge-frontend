import React from 'react';
import { useConnect, useAccount, useBalance } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { truncate } from '../../utils';

import Button from '../ui/Button';

const md5 = require('md5');

function Header(props) {
  const chain = props.chain;
  const connector = new MetaMaskConnector();
  const { isConnected, address } = useAccount();
  const { connect, isLoading } = useConnect({
    connector,
  });

  const { data } = useBalance({
    address,
  });

  const handleConnectButtonClick = async () => {
    await connect();
  };

  return (
    <div className="header-wrapper">
      <div className="header">
        <div className="container d-flex justify-content-between align-item-center">
          <a href="/">
            <img
              src="https://limeacademy.tech/wp-content/uploads/2021/08/limeacademy_logo.svg"
              alt=""
            />
          </a>
          <div>
            <a className="me-5" href="/Claim">
              Claim
            </a>
            <a href="/Transfer">Transfer</a>
          </div>
          <div className="d-flex">
            {isLoading ? (
              <span>Loading...</span>
            ) : isConnected ? (
              <>
                <div className="d-flex align-items-center justify-content-end">
                  {chain && (
                    <span className="me-3">
                      Connected to {chain.name}({chain.id})
                    </span>
                  )}
                  <img
                    className="img-profile me-3"
                    src={`https://www.gravatar.com/avatar/${md5(address)}/?d=identicon`}
                    alt=""
                  />
                  <span>{truncate(address, 6)}</span>
                  <span className="mx-3">|</span>
                  <p>
                    <span className="fw-bold">Balance: </span>
                    <span>{Number(data && data.formatted).toFixed(3)} ETH</span>
                  </p>
                </div>
              </>
            ) : (
              <Button onClick={handleConnectButtonClick}>Connect Metamask</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
