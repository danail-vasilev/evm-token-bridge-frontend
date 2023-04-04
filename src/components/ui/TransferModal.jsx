import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { Modal } from 'react-bootstrap';

function TransferModal(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [failMessage, setFailMessage] = useState('');
  const COMMON_FAIL_MSG = 'Failed to transfer token';

  const sourceChain = props.sourceChain;
  const targetChain = props.targetChain;
  const tokenAddress = props.tokenAddress;
  const tokenAmount = props.tokenAmount;
  const tokenSymbol = props.tokenSymbol || '';
  const bridge = props.bridge;
  const show = props.show;

  const onClose = () => {
    setFailMessage('');
    setIsSuccess(false);
    props.onHide();
  };

  const onTransfer = async () => {
    setIsSubmitting(true);
    try {
      const tx = await bridge.lockToken(tokenAddress, tokenAmount);
      const txResult = await tx.wait();
      const { status, transactionHash } = txResult;
      setTxHash(transactionHash);
      if (status === 1) {
        setIsSuccess(true);
      } else {
        setFailMessage('Check logs for details');
      }
    } catch (error) {
      setFailMessage(error.message);
      console.error(`${COMMON_FAIL_MSG}\n${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      {/* TODO: Fix overflow of content */}
      <Modal.Body className="d-flex flex-column align-items-center lh-lg mt-6 mb-6">
        {!isSuccess && !failMessage ? (
          <>
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
          </>
        ) : (
          <></>
        )}
        {isSuccess ? (
          <>
            <p>Your Transaction is Successful</p>
            <p>Transaction hash:</p>
            <p>{txHash}</p>
            <p>
              <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
                View on Etherscan
              </a>
            </p>
          </>
        ) : (
          <></>
        )}
        {failMessage ? (
          <>
            <p>{COMMON_FAIL_MSG}</p>
            <p>{failMessage}</p>
          </>
        ) : (
          <></>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-around">
        <Button onClick={onClose} type="secondary">
          {failMessage || isSuccess ? 'Close' : 'Cancel'}
        </Button>
        {failMessage || isSuccess ? (
          <></>
        ) : (
          <Button onClick={onTransfer} loading={isSubmitting}>
            Confirm
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default TransferModal;
