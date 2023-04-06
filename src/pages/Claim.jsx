import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import bridgeABI from '../abi/BridgeFactory.json';
import Table from 'react-bootstrap/Table';
import Button from '../components/ui/Button';
import ClaimModal from '../components/ui/ClaimModal';
import { getNetworkByChainId, truncate } from '../utils/index';

// TODO: Check other datagrid components:
// https://github.com/adazzle/react-data-grid/blob/main/website/demos/CommonFeatures.tsx
// https://github.com/adazzle/react-data-grid#rowrendererprops
function Claim(props) {
  // TODO: How to reuse signer and contract in multiple places ? Signer cannot be placed in App.jsx
  const { data: signer } = useSigner();
  const sourceChain = props.sourceChain;

  const [modalShow, setModalShow] = useState(false);
  const [selectedClaimData, setSelectedClaimData] = useState({});

  // Contract states
  const [bridgeContract, setBridgeContract] = useState();
  const [claimList, setClaimList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onClaim = row => {
    setSelectedClaimData({ from: row.from, to: row.to, token: row.token, amount: row.amount });
    setModalShow(true);
  };

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
              from: targetChain,
              to: sourceChain,
              token: tokenList[index],
              amount: tokenAmount.toNumber(),
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
              <td colSpan={6} className="text-center">
                No tokens to claim
              </td>
            </tr>
          ) : (
            <></>
          )}
          {claimList.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.from?.label}</td>
              <td>{row.to?.label}</td>
              <td>{truncate(row.token, 6)}</td>
              <td>{row.amount}</td>
              <td className="btn-wrapper">
                {' '}
                <Button onClick={() => onClaim(row)} type="primary btn-sm btn-y-center">
                  Claim
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ClaimModal
        sourceChain={selectedClaimData.from}
        targetChain={selectedClaimData.to}
        tokenAddress={selectedClaimData.token}
        tokenAmount={selectedClaimData.amount}
        bridge={bridgeContract}
        signer={signer}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default Claim;
