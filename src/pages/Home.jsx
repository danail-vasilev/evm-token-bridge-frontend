import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container home-container">
      <h1 className="fs-1">This is ERC20 Token Bridge</h1>
      <div className="fs-5">
        You can use this bridge to transfer tokens between EVM based networks
      </div>
      <div className="fs-3">Start Bridging</div>
      <div>
        <Link to="/transfer" className="btn btn-primary">
          Transfer
        </Link>
      </div>
    </div>
  );
}

export default Home;
