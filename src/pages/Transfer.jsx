import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Transfer(props) {
  const localNetworks = [
    { value: '1337', label: 'Ganache' },
    { value: '31337', label: 'Hardhat' },
    { value: '11155111', label: 'Sepolia' },
    { value: '5', label: 'Goerli' },
  ];

  const handleSelect = eventKey => {
    alert(eventKey);
  };
  return (
    <div className="container home-container my-5">
      <div className="card">
        <div className="card-body">
          <span>Choose network to bridge to:</span>
          <DropdownButton title="Select a network" onSelect={handleSelect}>
            {localNetworks.map(option => (
              <Dropdown.Item key={option.value} eventKey={option.value}>
                {option.label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </div>
      <div className="card">
        <div className="card-body">Choose Token/Address:</div>
      </div>
      <div className="card">
        <div className="card-body">Choose amount:</div>
      </div>
      <div>
        <Link to="/styleguide" className="btn btn-primary">
          Approve
        </Link>
        <Link to="/styleguide" className="btn btn-primary">
          Transfer
        </Link>
      </div>
    </div>
  );
}

export default Transfer;
