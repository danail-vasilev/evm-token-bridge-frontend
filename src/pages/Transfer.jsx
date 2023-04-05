import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import { Dropdown, DropdownButton, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../components/ui/Button';
import TransferModal from '../components/ui/TransferModal';
import { getNetworkByChainId } from '../utils/index';
import bridgeABI from '../abi/BridgeFactory.json';
import networks from '../networks.json';

function Transfer(props) {
  const { data: signer } = useSigner();

  const sourceChain = props.sourceChain;
  const [modalShow, setModalShow] = useState(false);
  const [targetChain, setTargetChain] = useState();
  const [networkDropdownTitle, setNetworkDropdownTitle] = useState('Select a network');
  const [tokenAddressList, setTokenAddressList] = useState();
  const [selectedTokenAddr, setSelectedTokenAddr] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);

  // Contract states
  const [bridgeContract, setBridgeContract] = useState();

  const onNetworkDropdownSelect = chainId => {
    const network = getNetworkByChainId(Number(chainId));
    setTargetChain(network);
    setNetworkDropdownTitle(network?.label);
    setTokenAddressList(network?.tokens);
  };

  // Use effects
  useEffect(() => {
    if (signer) {
      const _bridgeContract = new ethers.Contract(sourceChain.bridge, bridgeABI, signer);
      setBridgeContract(_bridgeContract);
    }
  }, [signer, sourceChain]);

  // TODO: Add placeholder when not connected
  // TODO: Add form validation
  return (
    <div className="container home-container my-5">
      {selectedTokenAddr}
      <div className="card">
        <div className="card-body d-flex justify-content-between align-items-baseline">
          <span className="me-3">Choose network to bridge to:</span>
          <DropdownButton title={networkDropdownTitle} onSelect={onNetworkDropdownSelect}>
            {networks
              .filter(option => option.chainId !== targetChain?.chainId)
              .map(option => (
                <Dropdown.Item
                  key={option.chainId}
                  eventKey={option.chainId}
                  disabled={option.chainId === sourceChain?.chainId}
                >
                  {option.label}
                </Dropdown.Item>
              ))}
          </DropdownButton>
        </div>
      </div>
      <div className="card">
        <div className="card-body d-flex justify-content-between align-items-baseline">
          <span className="me-3">Choose Token/Address:</span>
          <Dropdown as={ButtonGroup} onSelect={setSelectedTokenAddr}>
            <Form.Control
              onChange={e => setSelectedTokenAddr(e.target.value)}
              value={selectedTokenAddr}
              type="text"
              placeholder="0x"
              className="token-input"
            />
            <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
            <Dropdown.Menu>
              {tokenAddressList?.map(tokenAddr => (
                <Dropdown.Item
                  key={tokenAddr}
                  eventKey={tokenAddr}
                  disabled={tokenAddr === selectedTokenAddr}
                >
                  {tokenAddr}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="card">
        <div className="card-body d-flex justify-content-between align-items-baseline">
          <Form.Label className="me-3">Choose amount:</Form.Label>
          <Form.Control
            onChange={e => setSelectedAmount(e.target.value)}
            value={selectedAmount}
            min="0"
            type="number"
            className="amount-input"
          />
        </div>
      </div>
      <div>
        <Button type="secondary me-8">Approve</Button>
        <Button onClick={() => setModalShow(true)} disabled={!targetChain?.chainId} type="primary">
          Transfer
        </Button>
      </div>
      <TransferModal
        sourceChain={sourceChain}
        targetChain={targetChain}
        tokenAddress={selectedTokenAddr}
        tokenAmount={selectedAmount}
        bridge={bridgeContract}
        signer={signer}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default Transfer;
