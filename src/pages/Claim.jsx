import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import bridgeABI from '../abi/BridgeFactory.json';
import Table from 'react-bootstrap/Table';
import { getNetworkByChainId, truncate } from '../utils/index';

// TODO: Check other datagrid components:
// https://github.com/adazzle/react-data-grid/blob/main/website/demos/CommonFeatures.tsx
// https://github.com/adazzle/react-data-grid#rowrendererprops
function Claim(props) {
  // TODO: How to reuse signer and contract in multiple places ? Signer cannot be placed in App.jsx
  const { data: signer } = useSigner();
  const sourceChain = props.sourceChain;

  // Contract states
  const [bridgeContract, setBridgeContract] = useState();
  const [claimList, setClaimList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getClaimList = useCallback(async () => {
    setIsLoading(true);
    let claimList = [];
    const userAddress = await signer.getAddress();
    const tokenList = sourceChain.tokens;
    const targetChain = getNetworkByChainId(sourceChain.targetChainId);
    // TODO: Use multicall
    if (tokenList?.length) {
      try {
        const result = await Promise.all(
          tokenList.map(tokenAddress =>
            bridgeContract.getClaimableTokensAmount(userAddress, tokenAddress),
          ),
        );

        // TODO: Fix index;
        claimList = result
          .map((tokenAmount, index) => {
            return {
              id: index,
              from: targetChain.label,
              to: sourceChain.label,
              token: truncate(tokenList[index], 6),
              amount: tokenAmount.toNumber(),
              action: 'Claim',
            };
          })
          .filter(claim => claim.amount > 0);
      } catch (error) {
        console.error('Cannot query claimable tokens', error);
      }
    }
    setClaimList(claimList);
    setIsLoading(false);
  }, [bridgeContract]);

  // Use effects
  useEffect(() => {
    if (signer) {
      const _bridgeContract = new ethers.Contract(sourceChain.bridge, bridgeABI, signer);
      setBridgeContract(_bridgeContract);
    }
  }, [signer, sourceChain]);

  useEffect(() => {
    bridgeContract && getClaimList();
  }, [bridgeContract, getClaimList]);

  // const rows = [
  //   { id: 1, from: 'Mark', to: 'Otto', token: '@mdo', amount: '@mdo', action: '@mdo' },
  //   { id: 2, from: 'Jacob', to: 'Thornton', token: '@fat', amount: '@mdo', action: '@mdo' },
  //   { id: 3, from: 'Larry', to: 'the Bird', token: '@twitter', amount: '@mdo', action: '@mdo' },
  // ];
  return (
    <div className="claim-list">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>From</th>
            <th>To</th>
            <th>Token</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!claimList.length ? (
            <tr>
              <td colSpan={6}>No tokens to claim</td>
            </tr>
          ) : (
            <></>
          )}
          {claimList.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.from}</td>
              <td>{row.to}</td>
              <td>{row.token}</td>
              <td>{row.amount}</td>
              <td>{row.action}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Claim;
