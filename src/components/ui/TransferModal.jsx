import React from 'react';
import Button from '../../components/ui/Button';
import { Modal } from 'react-bootstrap';

function TransferModal(props) {
  const sourceChain = props.sourceChain;
  const targetChain = props.targetChain;
  const tokenAddress = props.tokenAddress;
  const tokenAmount = props.tokenAmount;
  const tokenSymbol = props.tokenSymbol || '';
  const bridge = props.bridge;
  const show = props.show;
  const onTransfer = async () => {
    // TODO: Handle success/error
    await bridge.lockToken(tokenAddress, tokenAmount);
  };
  return (
    <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body className="d-flex flex-column align-items-center lh-lg mt-6 mb-6">
        <h2 className="mb-3">Please Confirm</h2>
        <p>Are you sure you want to bridge:</p>
        <p>
          <span className="me-3">Source Chain:</span>
          <span>{sourceChain?.label}</span>
        </p>
        <p>
          <span className="me-3">Target Chain:</span>
          <span>{targetChain?.label}</span>
        </p>
        <p>
          <span className="me-3">Token:</span>
          <span>
            {tokenAmount}
            {tokenSymbol}
          </span>
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-around">
        <Button onClick={props.onHide} type="secondary">
          Cancel
        </Button>
        <Button onClick={onTransfer}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TransferModal;
