import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { Dropdown, DropdownButton, ButtonGroup, Modal, Form } from 'react-bootstrap';
import networks from '../networks.json';

function Transfer(props) {
  const chain = props.chain;
  const [modalShow, setModalShow] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState();
  const [networkDropdownTitle, setNetworkDropdownTitle] = useState('Select a network');
  const [tokenAddressList, setTokenAddressList] = useState();
  const [selectedTokenAddr, setSelectedTokenAddr] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);

  const onNetworkDropdownSelect = chainId => {
    setSelectedChainId(chainId);
    const network = networks?.find(network => network.chainId === Number(chainId));
    setNetworkDropdownTitle(network?.label);
    setTokenAddressList(network?.tokens);
  };

  // TODO: Add placeholder when not connected
  return (
    <div className="container home-container my-5">
      {selectedTokenAddr}
      <div className="card">
        <div className="card-body d-flex justify-content-between align-items-baseline">
          <span className="me-3">Choose network to bridge to:</span>
          <DropdownButton title={networkDropdownTitle} onSelect={onNetworkDropdownSelect}>
            {networks
              .filter(option => option.chainId !== selectedChainId)
              .map(option => (
                <Dropdown.Item
                  key={option.chainId}
                  eventKey={option.chainId}
                  disabled={option.chainId === chain?.id}
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
        <Button onClick={() => setModalShow(true)} disabled={!selectedChainId} type="primary">
          Transfer
        </Button>
      </div>
      <TransferModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
}

function TransferModal(props) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body className="d-flex flex-column align-items-center lh-lg mt-6 mb-6">
        <h2 className="mb-3">Please Confirm</h2>
        <p>Are you sure you want to bridge:</p>
        <p>
          <span>Source Chain:</span>
          <span>Rinkeby</span>
        </p>
        <p>
          <span>Target Chain:</span>
          <span>Ropsten</span>
        </p>
        <p>
          <span>Token:</span>
          <span>123 DAI</span>
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-around">
        <Button onClick={props.onHide} type="secondary">
          Cancel
        </Button>
        <Button onClick={props.onHide}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Transfer;
